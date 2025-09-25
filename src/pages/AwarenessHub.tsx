import { useState, useRef } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import {
  BookOpen,
  HelpCircle,
  Award,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  Scan,
  Camera,
  Upload,
  Loader2
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  author: string;
  image: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface Quiz {
  id: string;
  title: string;
  questions: number;
  duration: number;
  difficulty: "Easy" | "Medium" | "Hard";
  points: number;
}

interface NutritionResult {
  product: string;
  healthScore: number;
  nutrients: {
    calories: number;
    protein: number;
    fiber: number;
    sugar: number;
    sodium: number;
    carbs?: number;
    fat?: number;
    saturatedFat?: number;
  };
  recommendations: string[];
  warnings?: string[];
  ingredients?: string[];
  allergens?: string[];
}

// Mock nutrition service - replace with actual API calls
const nutritionService = {
  analyzeImage: async (file: File): Promise<NutritionResult> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock response based on file name or random data
    return {
      product: file.name.split('.')[0] || "Scanned Product",
      healthScore: Math.floor(Math.random() * 40) + 60, // 60-100
      nutrients: {
        calories: Math.floor(Math.random() * 500) + 100,
        protein: Math.floor(Math.random() * 30) + 5,
        fiber: Math.floor(Math.random() * 10) + 1,
        sugar: Math.floor(Math.random() * 50) + 5,
        sodium: Math.floor(Math.random() * 500) + 50
      },
      recommendations: [
        "Good source of protein",
        "Moderate sugar content - consider portion size",
        "Contains essential nutrients"
      ],
      warnings: Math.random() > 0.7 ? ["High sodium content"] : undefined,
      allergens: Math.random() > 0.5 ? ["Gluten", "Dairy"] : undefined
    };
  },
  
  analyzeProduct: async (productName: string): Promise<NutritionResult> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock response based on product name
    const healthScore = productName.toLowerCase().includes("healthy") ? 85 : 
                       productName.toLowerCase().includes("organic") ? 80 : 
                       Math.floor(Math.random() * 40) + 50;
    
    return {
      product: productName,
      healthScore,
      nutrients: {
        calories: Math.floor(Math.random() * 400) + 80,
        protein: Math.floor(Math.random() * 25) + 3,
        fiber: Math.floor(Math.random() * 8) + 2,
        sugar: Math.floor(Math.random() * 40) + 3,
        sodium: Math.floor(Math.random() * 400) + 30
      },
      recommendations: healthScore > 70 ? [
        "Excellent nutritional profile",
        "Good for daily consumption",
        "Balanced macronutrients"
      ] : [
        "Consider healthier alternatives",
        "Monitor portion sizes",
        "Combine with nutrient-rich foods"
      ],
      warnings: healthScore < 60 ? ["High processed content", "Added preservatives"] : undefined,
      allergens: Math.random() > 0.6 ? ["Soy", "Nuts"] : undefined
    };
  }
};

const AwarenessHub = () => {
  const [activeTab, setActiveTab] = useState<"articles" | "faqs" | "quizzes" | "nutrition">("articles");
  const [searchTerm, setSearchTerm] = useState("");
  const [nutritionResult, setNutritionResult] = useState<NutritionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [productName, setProductName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const articles: Article[] = Array.from({ length: 36 }).map((_, i) => {
    const id = (i + 1).toString();
    const categories = [
      "Common Diseases",
      "Preventive Care",
      "Vaccination",
      "Exercise",
      "Diet & Lifestyle",
      "New Medicines"
    ];
    const category = categories[i % categories.length];
    const titlesByCategory: Record<string, string[]> = {
      "Common Diseases": [
        "Understanding Hypertension",
        "Recognizing Early Diabetes Signs",
        "Managing Asthma Attacks",
        "Migraine Triggers and Relief",
        "Seasonal Flu: What You Need to Know",
        "Arthritis Pain Management"
      ],
      "Preventive Care": [
        "Annual Health Checkup Guide",
        "How to Build Healthy Habits",
        "Cancer Screening Essentials",
        "Oral Health and Overall Wellness",
        "Sun Safety and Skin Care",
        "Sleep Hygiene for Better Health"
      ],
      "Vaccination": [
        "Adult Vaccination Schedule",
        "Flu Shots: Myths vs Facts",
        "COVID-19 Booster Updates",
        "Travel Vaccines Checklist",
        "Childhood Immunization Basics",
        "HPV Vaccine: Who and When"
      ],
      "Exercise": [
        "Beginner Cardio Routine",
        "Strength Training Safely",
        "Yoga for Back Pain",
        "Desk Stretches for Office Workers",
        "HIIT: Pros and Cons",
        "Walking Plans for Heart Health"
      ],
      "Diet & Lifestyle": [
        "Balanced Plate: A Simple Framework",
        "Low-Sodium Cooking Tips",
        "Managing Cholesterol with Diet",
        "Hydration: How Much Water?",
        "Healthy Snacking Ideas",
        "Diabetes-Friendly Meal Planning"
      ],
      "New Medicines": [
        "Latest in Diabetes Drugs",
        "New Cholesterol-Lowering Options",
        "Migraine Biologics Explained",
        "Antibiotic Stewardship 101",
        "Vaccines in Development",
        "Weight Loss Medications Overview"
      ]
    };
    const list = titlesByCategory[category];
    const title = list[i % list.length];
    return {
      id,
      title,
      excerpt: "Short, practical guidance to help you make informed health decisions.",
      category,
      readTime: 5 + (i % 7),
      author: "HealthAI Editorial Team",
      image: `/api/placeholder/400/250?${i}`
    } as Article;
  });

  const faqs: FAQ[] = [
    {
      id: "1",
      question: "When should I see a doctor for a persistent cough?",
      answer: "You should see a doctor if your cough lasts more than 2-3 weeks, is accompanied by blood, fever, or difficulty breathing, or if you have underlying health conditions.",
      category: "General"
    },
    {
      id: "2",
      question: "How often should I get a health checkup?",
      answer: "Generally, adults should have a health checkup annually. However, those with chronic conditions or risk factors may need more frequent visits as recommended by their healthcare provider.",
      category: "Preventive Care"
    },
    {
      id: "3",
      question: "What are the warning signs of a heart attack?",
      answer: "Common signs include chest pain or discomfort, shortness of breath, nausea, lightheadedness, and pain in the arm, back, neck, or jaw. Seek immediate medical attention if you experience these symptoms.",
      category: "Emergency"
    },
    {
      id: "4",
      question: "How much water should I drink daily?",
      answer: "The general recommendation is about 8 glasses (2 liters) per day, but this can vary based on age, activity level, and climate. Listen to your body's thirst signals.",
      category: "Nutrition"
    },
    {
      id: "5",
      question: "What's the difference between a cold and the flu?",
      answer: "Colds are usually milder with runny nose and sneezing, while flu symptoms are more severe and include fever, body aches, and fatigue. Flu can lead to serious complications.",
      category: "Common Diseases"
    }
  ];

  const quizzes: Quiz[] = [
    {
      id: "1",
      title: "Heart Health Basics",
      questions: 10,
      duration: 5,
      difficulty: "Easy",
      points: 50
    },
    {
      id: "2",
      title: "Nutrition and Wellness",
      questions: 15,
      duration: 10,
      difficulty: "Medium",
      points: 75
    },
    {
      id: "3",
      title: "Emergency First Aid",
      questions: 20,
      duration: 15,
      difficulty: "Hard",
      points: 100
    },
    {
      id: "4",
      title: "Mental Health Awareness",
      questions: 12,
      duration: 8,
      difficulty: "Medium",
      points: 65
    },
    {
      id: "5",
      title: "Diabetes Management",
      questions: 18,
      duration: 12,
      difficulty: "Hard",
      points: 90
    },
    {
      id: "6",
      title: "Healthy Lifestyle",
      questions: 8,
      duration: 5,
      difficulty: "Easy",
      points: 40
    }
  ];

  const TabButton = ({ tab, label, icon: Icon }: { tab: typeof activeTab, label: string, icon: any }) => (
    <Button
      variant={activeTab === tab ? "default" : "outline"}
      onClick={() => setActiveTab(tab)}
      className="flex-1"
    >
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await nutritionService.analyzeImage(file);
      setNutritionResult(result);
      toast({
        title: "Analysis Complete",
        description: "Nutrition information has been analyzed successfully",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      if (event.target) event.target.value = '';
    }
  };

  const handleCameraCapture = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleProductAnalysis = async () => {
    if (!productName.trim()) {
      toast({
        title: "Product Name Required",
        description: "Please enter a product name to analyze",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await nutritionService.analyzeProduct(productName.trim());
      setNutritionResult(result);
      toast({
        title: "Analysis Complete",
        description: `Nutrition information for ${productName} has been analyzed`,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not find nutrition information for this product. Please try a different product name.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBarcodeUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const ArticlesTab = () => (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search health articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles
          .filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.category.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((article) => (
            <Card key={article.id} className="cursor-pointer transition-all duration-200 hover:shadow-lg">
              <div className="h-48 bg-muted rounded-t-lg overflow-hidden">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{article.category}</Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {article.readTime} min
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">By {article.author}</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">Read More</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>{article.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <img src={article.image} alt={article.title} className="w-full h-64 object-cover rounded" />
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <Badge variant="secondary">{article.category}</Badge>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {article.readTime} min read
                          </div>
                          <span>By {article.author}</span>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <p className="text-lg font-medium mb-4">{article.excerpt}</p>
                          <p>
                            This comprehensive article covers practical steps, common pitfalls to avoid, 
                            and guidance on how to discuss this topic with your healthcare provider. 
                            You'll learn about the latest research, evidence-based practices, and 
                            actionable tips you can implement today.
                          </p>
                          <p className="mt-4 font-semibold text-foreground">
                            Always consult a healthcare professional for personalized medical advice.
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );

  const FAQsTab = () => (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search frequently asked questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-4">
        {faqs
          .filter(faq => 
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.category.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((faq) => (
            <Card key={faq.id} className="cursor-pointer transition-all duration-200 hover:shadow-md">
              <CardHeader>
                <div className="flex items-start space-x-3">
                  <HelpCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <CardTitle className="text-lg text-foreground">{faq.question}</CardTitle>
                    <Badge variant="outline" className="mt-2">{faq.category}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );

  const QuizzesTab = () => (
    <div className="space-y-6">
      <div className="text-center py-8">
        <Award className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Test Your Health Knowledge</h2>
        <p className="text-muted-foreground">Take quizzes to learn and earn reward points</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="cursor-pointer transition-all duration-200 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{quiz.title}</span>
                <Badge variant={
                  quiz.difficulty === "Easy" ? "default" :
                  quiz.difficulty === "Medium" ? "secondary" : "destructive"
                }>
                  {quiz.difficulty}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <HelpCircle className="h-4 w-4 mr-1" />
                  {quiz.questions} questions
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {quiz.duration} min
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="h-4 w-4 text-primary mr-1" />
                  <span className="text-sm font-medium">{quiz.points} points</span>
                </div>
                <Button variant="default" size="sm">Start Quiz</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const NutritionTab = () => (
    <div className="space-y-6">
      <div className="text-center py-8">
        <Scan className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Nutrition Checker</h2>
        <p className="text-muted-foreground">Scan food products to get health insights and nutrition scores</p>
      </div>
  
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="h-5 w-5 mr-2" />
              Scan Product
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Take a photo of ingredient list or barcode</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="default"
                  onClick={handleCameraCapture}
                  disabled={isAnalyzing}
                  className="flex-1 sm:flex-none"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleBarcodeUpload}
                  disabled={isAnalyzing}
                  className="flex-1 sm:flex-none"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </div>
            </div>
  
            <div className="text-center">
              <span className="text-sm text-muted-foreground">or</span>
            </div>
  
            <div className="space-y-3">
              <Input
                placeholder="Enter product name manually..."
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                disabled={isAnalyzing}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isAnalyzing) {
                    handleProductAnalysis();
                  }
                }}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={handleProductAnalysis}
                disabled={isAnalyzing || !productName.trim()}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Scan className="h-4 w-4 mr-2" />
                    Analyze Product
                  </>
                )}
              </Button>
            </div>
  
            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
            />
          </CardContent>
        </Card>
  
        {nutritionResult ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Nutrition Analysis</span>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-primary">{nutritionResult.healthScore}</span>
                  <span className="text-sm text-muted-foreground">/100</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{nutritionResult.product}</h3>
                <div className="flex items-center space-x-2 mt-2">
                  <Progress value={nutritionResult.healthScore} className="flex-1" />
                  <Badge variant={
                    nutritionResult.healthScore >= 70 ? "default" : 
                    nutritionResult.healthScore >= 50 ? "secondary" : "destructive"
                  }>
                    {nutritionResult.healthScore >= 70 ? "Healthy" : 
                     nutritionResult.healthScore >= 50 ? "Moderate" : "Unhealthy"}
                  </Badge>
                </div>
              </div>
  
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Calories</p>
                  <p className="text-lg font-semibold">{nutritionResult.nutrients.calories}</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Protein</p>
                  <p className="text-lg font-semibold">{nutritionResult.nutrients.protein}g</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Fiber</p>
                  <p className="text-lg font-semibold">{nutritionResult.nutrients.fiber}g</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Sodium</p>
                  <p className="text-lg font-semibold">{nutritionResult.nutrients.sodium}mg</p>
                </div>
              </div>
  
              {nutritionResult.warnings && nutritionResult.warnings.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-destructive" />
                    Health Warnings
                  </h4>
                  <div className="space-y-2">
                    {nutritionResult.warnings.map((warning, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                        <span className="text-sm text-destructive">{warning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
  
              <div>
                <h4 className="font-medium mb-3">Health Recommendations</h4>
                <div className="space-y-2">
                  {nutritionResult.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
  
              {nutritionResult.allergens && nutritionResult.allergens.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Allergen Information</h4>
                  <div className="flex flex-wrap gap-2">
                    {nutritionResult.allergens.map((allergen, index) => (
                      <Badge key={index} variant="destructive">{allergen}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Analysis</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <Scan className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Scan a product or enter a product name to see nutrition analysis</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Health Awareness Hub</h1>
          <p className="text-xl text-muted-foreground">
            Your gateway to reliable health information, interactive learning, and nutrition insights
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8">
          <TabButton tab="articles" label="Articles" icon={BookOpen} />
          <TabButton tab="faqs" label="FAQs" icon={HelpCircle} />
          <TabButton tab="quizzes" label="Quizzes" icon={Award} />
          <TabButton tab="nutrition" label="Nutrition" icon={Scan} />
        </div>

        {/* Tab Content */}
        {activeTab === "articles" && <ArticlesTab />}
        {activeTab === "faqs" && <FAQsTab />}
        {activeTab === "quizzes" && <QuizzesTab />}
        {activeTab === "nutrition" && <NutritionTab />}
      </div>
    </Layout>
  );
};

export default AwarenessHub;
