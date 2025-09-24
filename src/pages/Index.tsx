import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-healthcare.jpg";
import { Link } from "react-router-dom";
import { 
  Stethoscope, 
  MessageCircle, 
  UserRound, 
  BookOpen, 
  Heart,
  Shield,
  Clock,
  Award,
  Scan,
  Bell,
  Users,
  CheckCircle,
  Star,
  ArrowRight
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "AI Health Assistant",
      description: "Get instant health guidance, symptom checking, and first-aid advice from our intelligent chatbot.",
      link: "/chat",
      color: "primary"
    },
    {
      icon: UserRound,
      title: "Find Expert Doctors",
      description: "Connect with qualified healthcare professionals through video calls, voice consultations, or chat.",
      link: "/doctors",
      color: "secondary"
    },
    {
      icon: BookOpen,
      title: "Health Awareness Hub",
      description: "Access reliable health articles, interactive quizzes, and nutrition analysis tools.",
      link: "/awareness",
      color: "accent"
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description: "Never miss your medication with intelligent reminders and adherence tracking.",
      link: "/dashboard",
      color: "success"
    }
  ];

  const benefits = [
    { icon: Shield, title: "AI-Powered Health Screening", description: "Advanced AI analyzes symptoms and provides preliminary health insights" },
    { icon: Clock, title: "24/7 Availability", description: "Access healthcare guidance anytime, anywhere with our round-the-clock service" },
    { icon: Users, title: "Expert Network", description: "Connect with verified healthcare professionals across multiple specialties" },
    { icon: Award, title: "Reward System", description: "Earn points for medication adherence and healthy lifestyle choices" }
  ];

  const stats = [
    { value: "50K+", label: "Active Users" },
    { value: "1,200+", label: "Expert Doctors" },
    { value: "98%", label: "Accuracy Rate" },
    { value: "24/7", label: "Support Available" }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="mb-4">
                  <Stethoscope className="h-3 w-3 mr-1" />
                  AI-Powered Healthcare Platform
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Your Personal{" "}
                  <span className="text-primary">AI Health</span>{" "}
                  Assistant
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Experience the future of healthcare with our AI-driven platform. Get instant health guidance, 
                  connect with expert doctors, and take control of your wellness journey.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/chat">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Start AI Chat
                  </Button>
                </Link>
                <Link to="/doctors">
                  <Button variant="outline" size="xl" className="w-full sm:w-auto">
                    <UserRound className="h-5 w-5 mr-2" />
                    Find Doctors
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-border/50">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Healthcare AI Platform" 
                className="rounded-2xl shadow-[var(--shadow-lg)] hover-lift"
              />
              <div className="absolute -bottom-6 -left-6 primary-gradient p-4 rounded-xl shadow-[var(--shadow-lg)]">
                <div className="text-white text-center">
                  <div className="text-2xl font-bold">AI</div>
                  <div className="text-sm">Powered</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Comprehensive Healthcare Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with expert medical knowledge 
              to provide you with personalized healthcare experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={index} to={feature.link}>
                  <Card className="healthcare-card card-hover h-full">
                    <CardHeader className="text-center pb-4">
                      <div className={`inline-flex p-4 rounded-2xl mb-4 mx-auto ${
                        feature.color === 'primary' ? 'primary-gradient' :
                        feature.color === 'secondary' ? 'secondary-gradient' :
                        feature.color === 'accent' ? 'bg-accent' :
                        'bg-success'
                      }`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                      <div className="flex items-center justify-center mt-4 text-primary">
                        <span className="text-sm font-medium">Learn More</span>
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose HealthAI?
            </h2>
            <p className="text-xl text-muted-foreground">
              Advanced technology meets compassionate care
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex items-start space-x-4 p-6 healthcare-card">
                  <div className="primary-gradient p-3 rounded-lg flex-shrink-0">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-muted-foreground">
              Trusted by thousands of users worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Tanvi Pawar",
                role: "Working Professional",
                content: "The AI health assistant helped me understand my symptoms and connected me with the right specialist. Excellent service!",
                rating: 5
              },
              {
                name: "Dr. Mayank Vashi",
                role: "Healthcare Provider",
                content: "As a doctor, I'm impressed by the platform's AI accuracy and how it helps patients make informed decisions.",
                rating: 5
              },
              {
                name: " Rudra Mehta",
                role: "Patient",
                content: "Never missed my medication again thanks to the smart reminders. The reward system keeps me motivated!",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="healthcare-card">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who trust HealthAI for their healthcare needs. 
            Start your journey to better health today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/chat">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                <MessageCircle className="h-5 w-5 mr-2" />
                Get Started Now
              </Button>
            </Link>
            <Link to="/awareness">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                <BookOpen className="h-5 w-5 mr-2" />
                Learn More
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center justify-center mt-8 space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-1 text-success" />
              No Credit Card Required
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-1 text-success" />
              Free to Start
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-1 text-success" />
              HIPAA Compliant
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
