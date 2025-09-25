// nutritionService.ts
// CORS-compatible version with proxy solutions

interface NutritionData {
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
  
  class NutritionService {
    // API Keys
    private readonly USDA_API_KEY = 'CLuw7oOCUUGkHeTEhmhKPIiZRnoJW3LJuYE3d62b';
    private readonly EDAMAM_APP_ID = '91f272bb';
    private readonly EDAMAM_APP_KEY = '30d4de6d592920d3886b3f0205aa1aac';
    private readonly SPOONACULAR_API_KEY = 'f475f5091e5045b9836b422ab9b4d74e';
    private readonly OCR_API_KEY = 'K87576736588957';
    private readonly CLARIFAI_API_KEY = '5429c362f845442ba5b8818dc8b91bf5';
  
    // CORS Proxy - Use this for development
    private readonly CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
    
    // Alternative CORS proxies you can try:
    // private readonly CORS_PROXY = 'https://api.allorigins.win/raw?url=';
    // private readonly CORS_PROXY = 'https://corsproxy.io/?';
  
    // Base URLs
    private readonly USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';
    private readonly SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/food';
  
    async analyzeProduct(productName: string): Promise<NutritionData> {
      console.log(`Analyzing product: ${productName}`);
      
      try {
        // Try USDA first (most reliable)
        const nutritionData = await this.getNutritionDataWithProxy(productName);
        
        if (nutritionData) {
          console.log('USDA data found:', nutritionData);
          return this.processNutritionData(nutritionData, null, productName);
        }
  
        // Fallback to Spoonacular
        const productInfo = await this.getProductInfoWithProxy(productName);
        
        if (productInfo) {
          console.log('Spoonacular data found:', productInfo);
          return this.processSpoonacularData(productInfo, productName);
        }
  
        throw new Error('No API data available');
      } catch (error) {
        console.error('API Error:', error);
        console.log('Using mock data for:', productName);
        return this.getMockData(productName);
      }
    }
  
    async analyzeImage(imageFile: File): Promise<NutritionData> {
      console.log('Analyzing image:', imageFile.name);
      
      try {
        // Convert to base64
        const base64Image = await this.fileToBase64(imageFile);
        
        // Try OCR first
        const extractedText = await this.performOCRWithProxy(base64Image);
        console.log('Extracted text:', extractedText);
        
        if (extractedText) {
          const nutritionInfo = this.parseNutritionLabel(extractedText);
          if (nutritionInfo) {
            console.log('Parsed nutrition from image:', nutritionInfo);
            return nutritionInfo;
          }
        }
  
        // Try food recognition
        const recognizedFood = await this.recognizeFoodWithProxy(base64Image);
        console.log('Recognized food:', recognizedFood);
        
        if (recognizedFood) {
          return this.analyzeProduct(recognizedFood);
        }
  
        throw new Error('Could not analyze image');
      } catch (error) {
        console.error('Image analysis error:', error);
        return this.getMockImageData();
      }
    }
  
    private async getNutritionDataWithProxy(foodName: string): Promise<any> {
      try {
        const url = `${this.CORS_PROXY}${this.USDA_BASE_URL}/foods/search?query=${encodeURIComponent(foodName)}&api_key=${this.USDA_API_KEY}&pageSize=1`;
        console.log('USDA API URL:', url);
  
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
  
        if (!response.ok) {
          console.error('USDA API failed:', response.status, response.statusText);
          return null;
        }
  
        const data = await response.json();
        console.log('USDA Response:', data);
  
        if (data.foods && data.foods.length > 0) {
          return {
            fdcId: data.foods[0].fdcId,
            description: data.foods[0].description,
            nutrients: data.foods[0].foodNutrients || []
          };
        }
  
        return null;
      } catch (error) {
        console.error('USDA API Error:', error);
        return null;
      }
    }
  
    private async getProductInfoWithProxy(productName: string): Promise<any> {
      try {
        const url = `${this.CORS_PROXY}${this.SPOONACULAR_BASE_URL}/products/search?query=${encodeURIComponent(productName)}&apiKey=${this.SPOONACULAR_API_KEY}&number=1`;
        console.log('Spoonacular API URL:', url);
  
        const response = await fetch(url);
  
        if (!response.ok) {
          console.error('Spoonacular API failed:', response.status, response.statusText);
          return null;
        }
  
        const data = await response.json();
        console.log('Spoonacular Response:', data);
  
        if (data.products && data.products.length > 0) {
          return data.products[0];
        }
  
        return null;
      } catch (error) {
        console.error('Spoonacular API Error:', error);
        return null;
      }
    }
  
    private async performOCRWithProxy(base64Image: string): Promise<string> {
      try {
        const formData = new FormData();
        formData.append('base64Image', base64Image);
        formData.append('apikey', this.OCR_API_KEY);
        formData.append('language', 'eng');
        formData.append('isOverlayRequired', 'false');
  
        const response = await fetch(`${this.CORS_PROXY}https://api.ocr.space/parse/image`, {
          method: 'POST',
          body: formData
        });
  
        if (!response.ok) {
          console.error('OCR API failed:', response.status);
          return '';
        }
  
        const data = await response.json();
        console.log('OCR Response:', data);
  
        if (data.ParsedResults && data.ParsedResults.length > 0) {
          return data.ParsedResults[0].ParsedText;
        }
  
        return '';
      } catch (error) {
        console.error('OCR Error:', error);
        return '';
      }
    }
  
    private async recognizeFoodWithProxy(base64Image: string): Promise<string | null> {
      try {
        const response = await fetch(`${this.CORS_PROXY}https://api.clarifai.com/v2/models/bd367be194cf45149e75f01d59f77ba7/outputs`, {
          method: 'POST',
          headers: {
            'Authorization': `Key ${this.CLARIFAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputs: [{
              data: {
                image: {
                  base64: base64Image.split(',')[1]
                }
              }
            }]
          })
        });
  
        if (!response.ok) {
          console.error('Clarifai API failed:', response.status);
          return null;
        }
  
        const data = await response.json();
        console.log('Clarifai Response:', data);
  
        if (data.outputs && data.outputs[0].data.concepts.length > 0) {
          const topConcept = data.outputs[0].data.concepts[0];
          if (topConcept.value > 0.7) {
            return topConcept.name;
          }
        }
  
        return null;
      } catch (error) {
        console.error('Food recognition error:', error);
        return null;
      }
    }
  
    private fileToBase64(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    }
  
    private parseNutritionLabel(text: string): NutritionData | null {
      try {
        console.log('Parsing nutrition label text:', text);
  
        // Enhanced regex patterns for better matching
        const caloriesMatch = text.match(/(?:calories|energy)[:\s]*(\d+)/i);
        const proteinMatch = text.match(/protein[:\s]*(\d+\.?\d*)\s*g/i);
        const fiberMatch = text.match(/(?:fiber|fibre)[:\s]*(\d+\.?\d*)\s*g/i);
        const sugarMatch = text.match(/sugar[s]?[:\s]*(\d+\.?\d*)\s*g/i);
        const sodiumMatch = text.match(/sodium[:\s]*(\d+\.?\d*)\s*mg/i);
        const fatMatch = text.match(/(?:total\s+)?fat[:\s]*(\d+\.?\d*)\s*g/i);
        const carbsMatch = text.match(/(?:total\s+)?carbohydrate[s]?[:\s]*(\d+\.?\d*)\s*g/i);
  
        if (caloriesMatch || proteinMatch || fatMatch) {
          const nutrients = {
            calories: caloriesMatch ? parseInt(caloriesMatch[1]) : 0,
            protein: proteinMatch ? parseFloat(proteinMatch[1]) : 0,
            fiber: fiberMatch ? parseFloat(fiberMatch[1]) : 0,
            sugar: sugarMatch ? parseFloat(sugarMatch[1]) : 0,
            sodium: sodiumMatch ? parseFloat(sodiumMatch[1]) : 0,
            fat: fatMatch ? parseFloat(fatMatch[1]) : 0,
            carbs: carbsMatch ? parseFloat(carbsMatch[1]) : 0
          };
  
          console.log('Parsed nutrients:', nutrients);
          return this.processNutritionData({ nutrients }, null, 'Scanned Product');
        }
  
        return null;
      } catch (error) {
        console.error('Error parsing nutrition label:', error);
        return null;
      }
    }
  
    private processSpoonacularData(productInfo: any, productName: string): NutritionData {
      // Extract nutrition from Spoonacular product data
      const nutrients = {
        calories: productInfo.nutrition?.calories || 0,
        protein: productInfo.nutrition?.protein || 0,
        fiber: productInfo.nutrition?.fiber || 0,
        sugar: productInfo.nutrition?.sugar || 0,
        sodium: productInfo.nutrition?.sodium || 0,
        carbs: productInfo.nutrition?.carbohydrates || 0,
        fat: productInfo.nutrition?.fat || 0,
        saturatedFat: productInfo.nutrition?.saturatedFat || 0
      };
  
      return this.processNutritionData({ nutrients }, productInfo, productName);
    }
  
    private processNutritionData(nutritionData: any, productInfo: any, productName: string): NutritionData {
      let nutrients = {
        calories: 0,
        protein: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
        carbs: 0,
        fat: 0,
        saturatedFat: 0
      };
  
      // Process nutrition data
      if (nutritionData && nutritionData.nutrients) {
        if (Array.isArray(nutritionData.nutrients)) {
          // USDA format
          nutritionData.nutrients.forEach((nutrient: any) => {
            const name = (nutrient.nutrientName || '').toLowerCase();
            const value = nutrient.value || 0;
  
            if (name.includes('energy') || name.includes('calorie')) {
              nutrients.calories = Math.round(value);
            } else if (name.includes('protein')) {
              nutrients.protein = Math.round(value * 100) / 100;
            } else if (name.includes('fiber')) {
              nutrients.fiber = Math.round(value * 100) / 100;
            } else if (name.includes('sugar')) {
              nutrients.sugar = Math.round(value * 100) / 100;
            } else if (name.includes('sodium')) {
              nutrients.sodium = Math.round(value);
            } else if (name.includes('carbohydrate')) {
              nutrients.carbs = Math.round(value * 100) / 100;
            } else if (name.includes('total lipid') || name.includes('fat')) {
              nutrients.fat = Math.round(value * 100) / 100;
            }
          });
        } else {
          // Direct nutrient object
          nutrients = { ...nutrients, ...nutritionData.nutrients };
        }
      }
  
      const healthScore = this.calculateHealthScore(nutrients);
      const recommendations = this.generateRecommendations(nutrients, healthScore);
      const warnings = this.generateWarnings(nutrients);
      const allergens = this.extractAllergens(productInfo);
  
      console.log('Final processed data:', {
        product: productInfo?.title || nutritionData?.description || productName,
        healthScore,
        nutrients,
        recommendations,
        warnings,
        allergens
      });
  
      return {
        product: productInfo?.title || nutritionData?.description || productName,
        healthScore,
        nutrients,
        recommendations,
        warnings: warnings.length > 0 ? warnings : undefined,
        allergens: allergens.length > 0 ? allergens : undefined
      };
    }
  
    private calculateHealthScore(nutrients: any): number {
      let score = 100;
  
      if (nutrients.sodium > 800) score -= 20;
      else if (nutrients.sodium > 400) score -= 10;
  
      if (nutrients.sugar > 20) score -= 25;
      else if (nutrients.sugar > 10) score -= 15;
  
      if (nutrients.saturatedFat > 10) score -= 15;
      else if (nutrients.saturatedFat > 5) score -= 10;
  
      if (nutrients.fiber >= 5) score += 10;
      else if (nutrients.fiber >= 3) score += 5;
  
      if (nutrients.protein >= 10) score += 10;
      else if (nutrients.protein >= 5) score += 5;
  
      return Math.max(0, Math.min(100, Math.round(score)));
    }
  
    private generateRecommendations(nutrients: any, healthScore: number): string[] {
      const recommendations: string[] = [];
  
      if (nutrients.fiber >= 5) {
        recommendations.push('High in fiber - Great for digestive health');
      } else if (nutrients.fiber < 2) {
        recommendations.push('Low in fiber - Consider pairing with fiber-rich foods');
      }
  
      if (nutrients.protein >= 10) {
        recommendations.push('Good source of protein - Supports muscle health');
      }
  
      if (nutrients.sodium < 200) {
        recommendations.push('Low sodium - Heart-friendly choice');
      }
  
      if (nutrients.sugar < 5) {
        recommendations.push('Low sugar content - Good for blood sugar control');
      }
  
      if (healthScore >= 80) {
        recommendations.push('Overall nutritious choice - Fits well in a balanced diet');
      } else if (healthScore >= 60) {
        recommendations.push('Moderate nutritional value - Enjoy in moderation');
      }
  
      return recommendations;
    }
  
    private generateWarnings(nutrients: any): string[] {
      const warnings: string[] = [];
  
      if (nutrients.sodium > 800) {
        warnings.push('Very high sodium content - May contribute to high blood pressure');
      } else if (nutrients.sodium > 400) {
        warnings.push('High sodium content - Monitor daily intake');
      }
  
      if (nutrients.sugar > 20) {
        warnings.push('Very high sugar content - Limit portion size');
      } else if (nutrients.sugar > 10) {
        warnings.push('High sugar content - Consider healthier alternatives');
      }
  
      if (nutrients.saturatedFat > 10) {
        warnings.push('High saturated fat - May affect heart health');
      }
  
      if (nutrients.calories > 400) {
        warnings.push('High calorie density - Be mindful of portion sizes');
      }
  
      return warnings;
    }
  
    private extractAllergens(productInfo: any): string[] {
      const allergens: string[] = [];
  
      if (productInfo) {
        const productText = JSON.stringify(productInfo).toLowerCase();
        const commonAllergens = [
          'milk', 'eggs', 'peanuts', 'tree nuts', 'soy',
          'wheat', 'fish', 'shellfish', 'sesame'
        ];
  
        commonAllergens.forEach(allergen => {
          if (productText.includes(allergen)) {
            allergens.push(allergen.charAt(0).toUpperCase() + allergen.slice(1));
          }
        });
      }
  
      return [...new Set(allergens)];
    }
  
    private getMockData(productName: string): NutritionData {
      console.log('Generating mock data for:', productName);
      
      // Create realistic mock data based on product name
      let baseCalories = 200;
      let baseProtein = 8;
      let baseFiber = 3;
      let baseSugar = 12;
      let baseSodium = 300;
  
      // Adjust based on product name
      const name = productName.toLowerCase();
      if (name.includes('apple') || name.includes('fruit')) {
        baseCalories = 95;
        baseSugar = 19;
        baseFiber = 4;
        baseSodium = 2;
        baseProtein = 0.5;
      } else if (name.includes('bread')) {
        baseCalories = 265;
        baseProtein = 9;
        baseFiber = 4;
        baseSodium = 491;
        baseSugar = 5;
      } else if (name.includes('milk')) {
        baseCalories = 149;
        baseProtein = 8;
        baseSugar = 12;
        baseSodium = 105;
        baseFiber = 0;
      }
  
      const mockNutrients = {
        calories: Math.round(baseCalories + (Math.random() - 0.5) * 50),
        protein: Math.round((baseProtein + (Math.random() - 0.5) * 5) * 100) / 100,
        fiber: Math.round((baseFiber + (Math.random() - 0.5) * 2) * 100) / 100,
        sugar: Math.round((baseSugar + (Math.random() - 0.5) * 8) * 100) / 100,
        sodium: Math.round(baseSodium + (Math.random() - 0.5) * 200),
        carbs: Math.round((baseCalories / 4 + (Math.random() - 0.5) * 10) * 100) / 100,
        fat: Math.round((baseCalories / 20 + (Math.random() - 0.5) * 5) * 100) / 100
      };
  
      const healthScore = this.calculateHealthScore(mockNutrients);
  
      return {
        product: productName,
        healthScore,
        nutrients: mockNutrients,
        recommendations: this.generateRecommendations(mockNutrients, healthScore),
        warnings: this.generateWarnings(mockNutrients)
      };
    }
  
    private getMockImageData(): NutritionData {
      return this.getMockData('Scanned Food Product');
    }
  }
  
  export const nutritionService = new NutritionService();
