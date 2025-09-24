// Lightweight Health Chatbot service adapted for React UI
// Mirrors core behavior from the standalone chatbot while avoiding DOM usage

export type SupportedLanguage = "hindi" | "english";

type AnalysisResult = {
  response: string;
  confidence: number;
  type?: string;
};

export class HealthChatbotService {
  private language: SupportedLanguage = "english";
  private chatHistory: Array<{ user: string; bot: string; timestamp: Date }>= [];

  private medicalKnowledge = {
    symptoms: {
      fever: {
        keywords: ["fever", "बुखार", "temperature", "तापमान"],
        firstAid: {
          hindi:
            "बुखार के लिए: पानी पिएं, आराम करें, गीले कपड़े से माथा पोंछें। 102°F से ज्यादा हो तो डॉक्टर से मिलें।",
          english:
            "For fever: Drink fluids, rest, use cool compress. Consult a doctor if above 102°F.",
        },
      },
      headache: {
        keywords: ["headache", "सिर दर्द", "सिरदर्द"],
        firstAid: {
          hindi:
            "सिर दर्द के लिए: आराम करें, पानी पिएं, अंधेरे कमरे में रहें, हल्की मालिश करें।",
          english:
            "For headache: Rest in a dark room, hydrate, gentle massage, avoid loud sounds.",
        },
      },
      cough: {
        keywords: ["cough", "खांसी", "कफ"],
        firstAid: {
          hindi: "खांसी के लिए: गुनगुना पानी, शहद-अदरक, भाप लें।",
          english: "For cough: Warm water, honey-ginger, steam inhalation.",
        },
      },
      chestPain: {
        keywords: ["chest pain", "छाती में दर्द", "सीने में दर्द"],
        urgency: "high",
        firstAid: {
          hindi:
            "⚠️ छाती में दर्द: तुरंत आराम करें, 102/108 कॉल करें। यह दिल का दौरा हो सकता है।",
          english:
            "⚠️ Chest pain: Rest immediately, call emergency (102/108). Could be heart attack.",
        },
      },
    },
    firstAid: {
      cuts: {
        keywords: ["cut", "घाव", "bleeding", "खून"],
        steps: {
          hindi:
            "1) साफ पानी से धोएं\n2) दबाव डालकर खून रोकें\n3) साफ पट्टी लगाएं\n4) गहरा हो तो डॉक्टर जाएं",
          english:
            "1) Rinse with clean water\n2) Apply pressure\n3) Bandage\n4) See a doctor if deep",
        },
      },
      burns: {
        keywords: ["burn", "जलना", "fire"],
        steps: {
          hindi:
            "1) ठंडे पानी में 10-15 मिनट रखें\n2) बर्फ न लगाएं\n3) छाले न फोड़ें\n4) गंभीर जलन पर अस्पताल जाएं",
          english:
            "1) Cool water 10-15 min\n2) No ice\n3) Do not pop blisters\n4) Hospital for severe burns",
        },
      },
    },
    wellness: {
      diet: {
        diabetes: {
          hindi:
            "डायबिटीज में: कम चीनी, ज्यादा फाइबर, नियमित भोजन, नियमित व्यायाम।",
          english:
            "For diabetes: Low sugar, high fiber, regular meals, consistent exercise.",
        },
        hypertension: {
          hindi: "हाई BP: कम नमक, ज्यादा फल-सब्ज़ियां, वजन कंट्रोल।",
          english: "High BP: Low salt, more fruits/veggies, weight control.",
        },
      },
      exercise: {
        general: {
          hindi:
            "दैनिक व्यायाम: 30 मिनट वॉक, योग, और सांस के अभ्यास फायदेमंद।",
          english: "Daily exercise: 30 min walk, yoga, breathing exercises are beneficial.",
        },
      },
    },
  } as const;

  private detectLanguage(message: string): SupportedLanguage {
    const hindiPattern = /[\u0900-\u097F]/;
    return hindiPattern.test(message) ? "hindi" : "english";
  }

  private isGreeting(message: string): boolean {
    const greetings = ["hello", "hi", "hey", "नमस्ते", "हैलो", "हाय"];
    return greetings.some((g) => message.toLowerCase().includes(g.toLowerCase()));
  }

  private getFirstAidResponse(message: string): AnalysisResult | null {
    const lower = message.toLowerCase();
    for (const [, data] of Object.entries(this.medicalKnowledge.firstAid)) {
      for (const kw of data.keywords) {
        if (lower.includes(kw.toLowerCase())) {
          const steps = data.steps[this.language];
          const extra =
            this.language === "hindi"
              ? "\n\n🚨 आपातकाल में 102/108 डायल करें।"
              : "\n\n🚨 For emergency, dial 102/108.";
          return { response: `${steps}${extra}`, confidence: 0.85, type: "first_aid" };
        }
      }
    }
    return null;
  }

  private getWellnessResponse(message: string): AnalysisResult | null {
    const lower = message.toLowerCase();
    if (/(diet|food|खाना|भोजन)/.test(lower)) {
      if (/(diabetes|डायबिटीज)/.test(lower)) {
        return {
          response: this.medicalKnowledge.wellness.diet.diabetes[this.language],
          confidence: 0.8,
          type: "wellness",
        };
      }
      if (/(hypertension|bp|बीपी)/.test(lower)) {
        return {
          response: this.medicalKnowledge.wellness.diet.hypertension[this.language],
          confidence: 0.8,
          type: "wellness",
        };
      }
    }
    if (/(exercise|workout|व्यायाम|कसरत)/.test(lower)) {
      return {
        response: this.medicalKnowledge.wellness.exercise.general[this.language],
        confidence: 0.8,
        type: "wellness",
      };
    }
    return null;
  }

  private getSymptomHint(message: string): AnalysisResult | null {
    const lower = message.toLowerCase();
    for (const [, data] of Object.entries(this.medicalKnowledge.symptoms)) {
      for (const kw of data.keywords) {
        if (lower.includes(kw.toLowerCase())) {
          const advice = (data as any).firstAid?.[this.language];
          if (advice) return { response: advice, confidence: 0.75, type: "symptom" };
        }
      }
    }
    return null;
  }

  private getFallback(message: string): AnalysisResult {
    const pre =
      this.language === "hindi"
        ? "मुझे आपकी बात पूरी तरह समझ नहीं आई। कृपया ऐसे पूछें:"
        : "I couldn't fully understand. Try asking like:";
    const suggestions =
      this.language === "hindi"
        ? [
            "• अपने लक्षण स्पष्ट लिखें (जैसे: ‘मुझे बुखार और सिरदर्द है’)",
            "• First aid के लिए पूछें (जैसे: ‘कटने पर क्या करें?’)",
            "• स्वास्थ्य सलाह (जैसे: ‘डायबिटीज में क्या खाएं?’)",
          ]
        : [
            "• Describe symptoms (e.g., ‘I have fever and headache’)",
            "• Ask for first aid (e.g., ‘What to do for cuts?’)",
            "• Ask health advice (e.g., ‘Diet for diabetes?’)",
          ];
    return { response: `${pre}\n\n${suggestions.join("\n")}`, confidence: 0.5, type: "fallback" };
  }

  async handleChat(message: string): Promise<string> {
    this.language = this.detectLanguage(message);

    if (this.isGreeting(message)) {
      const greet =
        this.language === "hindi"
          ? "🏥 नमस्ते! मैं HealthConnect AI हूं। मैं सहायता कर सकता हूं: लक्षण जांच, प्राथमिक चिकित्सा, स्वास्थ्य जागरूकता, डाइट/व्यायाम सलाह."
          : "🏥 Hello! I am HealthConnect AI. I can help with symptom checks, first-aid, health awareness, and diet/exercise guidance.";
      this.chatHistory.push({ user: message, bot: greet, timestamp: new Date() });
      return greet;
    }

    const firstAid = this.getFirstAidResponse(message);
    if (firstAid) {
      this.chatHistory.push({ user: message, bot: firstAid.response, timestamp: new Date() });
      return firstAid.response;
    }

    const wellness = this.getWellnessResponse(message);
    if (wellness) {
      this.chatHistory.push({ user: message, bot: wellness.response, timestamp: new Date() });
      return wellness.response;
    }

    const symptom = this.getSymptomHint(message);
    if (symptom) {
      this.chatHistory.push({ user: message, bot: symptom.response, timestamp: new Date() });
      return symptom.response;
    }

    const fb = this.getFallback(message);
    this.chatHistory.push({ user: message, bot: fb.response, timestamp: new Date() });
    return fb.response;
  }
}

export default new HealthChatbotService();



