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

  private diseaseInfo = [
    {
      name: "Fever",
      keywords: ["fever", "बुखार", "temperature", "high temperature", "chills"],
      what: "A temporary rise in body temperature, often due to infection.",
      symptoms: "High temperature, chills, sweating, headache, body aches.",
      causes: "Infections (viral, bacterial), heat exhaustion, inflammation.",
      dos: "Drink fluids, rest, use a cool compress, monitor temperature.",
      donts: "Avoid overexertion, do not use alcohol rubs on children.",
      doctor: "If fever is above 102°F, lasts more than 3 days, or with confusion, rash, or difficulty breathing.",
    },
    {
      name: "Common Cold",
      keywords: ["cold", "जुकाम", "runny nose", "blocked nose", "nasal congestion", "sneezing"],
      what: "A mild viral infection of the nose and throat.",
      symptoms: "Runny or stuffy nose, sneezing, sore throat, mild cough.",
      causes: "Viruses (rhinovirus), close contact with infected people.",
      dos: "Rest, drink fluids, use steam inhalation, maintain hygiene.",
      donts: "Avoid cold drinks, do not use antibiotics unnecessarily.",
      doctor: "If symptoms last more than 10 days, high fever, or trouble breathing.",
    },
    {
      name: "Cough",
      keywords: ["cough", "खांसी", "कफ", "dry cough", "wet cough", "sore throat"],
      what: "A reflex to clear the airways of mucus or irritants.",
      symptoms: "Dry or wet cough, throat irritation, chest discomfort.",
      causes: "Infections, allergies, asthma, smoke, pollution.",
      dos: "Drink warm fluids, use honey (if age >1), avoid smoke.",
      donts: "Do not suppress productive cough excessively.",
      doctor: "If cough lasts >2 weeks, with blood, or severe breathlessness.",
    },
    {
      name: "Flu (Influenza)",
      keywords: ["flu", "influenza", "फ्लू", "viral fever"],
      what: "A contagious viral infection affecting nose, throat, and lungs.",
      symptoms: "Fever, chills, muscle aches, fatigue, cough, sore throat.",
      causes: "Influenza virus, spreads via droplets from cough/sneeze.",
      dos: "Rest, hydrate, use fever reducers, cover mouth when coughing.",
      donts: "Avoid close contact with others, do not self-medicate with antibiotics.",
      doctor: "If high risk (elderly, chronic illness), severe symptoms, or trouble breathing.",
    },
    {
      name: "Asthma",
      keywords: ["asthma", "अस्थमा", "wheezing", "shortness of breath", "inhaler"],
      what: "A condition causing narrowing of airways, making breathing difficult.",
      symptoms: "Wheezing, shortness of breath, chest tightness, cough.",
      causes: "Allergies, pollution, exercise, cold air, infections.",
      dos: "Use inhaler as prescribed, avoid triggers, monitor symptoms.",
      donts: "Do not ignore worsening symptoms, avoid smoke.",
      doctor: "If severe breathlessness, lips turning blue, or not relieved by inhaler.",
    },
    {
      name: "Diabetes",
      keywords: ["diabetes", "डायबिटीज", "high sugar", "blood sugar"],
      what: "A condition where blood sugar levels are too high.",
      symptoms: "Frequent urination, thirst, fatigue, slow healing wounds.",
      causes: "Genetics, obesity, unhealthy diet, inactivity.",
      dos: "Eat healthy, exercise, monitor sugar, take medicines as advised.",
      donts: "Avoid sugary foods, do not skip medicines.",
      doctor: "If very high/low sugar, confusion, unconsciousness, or infection.",
    },
    {
      name: "Hypertension (High BP)",
      keywords: ["hypertension", "high bp", "bp", "blood pressure", "उच्च रक्तचाप"],
      what: "A condition where blood pressure in arteries is persistently high.",
      symptoms: "Often none, sometimes headache, dizziness, nosebleeds.",
      causes: "Genetics, obesity, high salt diet, stress, inactivity.",
      dos: "Limit salt, exercise, take medicines, regular BP checks.",
      donts: "Avoid salty/processed foods, do not stop medicines suddenly.",
      doctor: "If very high BP, chest pain, vision changes, or confusion.",
    },
    {
      name: "Migraine/Headache",
      keywords: ["migraine", "headache", "सिर दर्द", "सिरदर्द", "pain in head"],
      what: "A severe headache often with nausea, light/sound sensitivity.",
      symptoms: "Throbbing headache, nausea, sensitivity to light/sound.",
      causes: "Stress, certain foods, hormonal changes, lack of sleep.",
      dos: "Rest in a dark room, hydrate, use cold/warm compress.",
      donts: "Avoid triggers, do not overuse painkillers.",
      doctor: "If sudden severe headache, vision loss, or with fever/stiff neck.",
    },
    {
      name: "Acidity/Indigestion",
      keywords: ["acidity", "indigestion", "heartburn", "gas", "burning stomach"],
      what: "A condition with burning sensation or discomfort in the stomach.",
      symptoms: "Burning in chest/stomach, bloating, burping, nausea.",
      causes: "Spicy/fatty foods, overeating, stress, late meals.",
      dos: "Eat small meals, avoid spicy foods, stay upright after eating.",
      donts: "Do not overeat, avoid lying down soon after meals.",
      doctor: "If severe pain, vomiting blood, or black stools.",
    },
    {
      name: "Food Poisoning",
      keywords: ["food poisoning", "vomiting", "nausea", "contaminated food", "spoiled food"],
      what: "Illness from eating contaminated food or water.",
      symptoms: "Nausea, vomiting, diarrhea, stomach pain, fever.",
      causes: "Bacteria, viruses, toxins in food/water.",
      dos: "Drink ORS, rest, eat light, maintain hygiene.",
      donts: "Avoid street food, do not ignore dehydration.",
      doctor: "If blood in vomit/stool, high fever, or signs of dehydration.",
    },
    {
      name: "Diarrhea",
      keywords: ["diarrhea", "दस्त", "loose motion", "watery stool"],
      what: "Frequent loose or watery stools.",
      symptoms: "Loose stools, abdominal cramps, dehydration, weakness.",
      causes: "Infections, contaminated food/water, stress.",
      dos: "Drink ORS, eat light, wash hands, avoid dehydration.",
      donts: "Avoid dairy, spicy foods, do not ignore dehydration.",
      doctor: "If blood in stool, high fever, or severe weakness.",
    },
    {
      name: "Constipation",
      keywords: ["constipation", "कब्ज", "hard stool", "difficulty passing stool"],
      what: "Difficulty or infrequent passing of stools.",
      symptoms: "Hard stools, straining, bloating, discomfort.",
      causes: "Low fiber diet, dehydration, inactivity, ignoring urge.",
      dos: "Eat fiber-rich foods, drink water, exercise, regular toilet routine.",
      donts: "Do not ignore urge, avoid junk food.",
      doctor: "If severe pain, blood in stool, or lasts >2 weeks.",
    },
    {
      name: "Malaria",
      keywords: ["malaria", "मलेरिया", "mosquito fever", "chills", "high fever"],
      what: "A mosquito-borne infectious disease causing fever and chills.",
      symptoms: "High fever, chills, sweating, headache, nausea.",
      causes: "Plasmodium parasite via mosquito bite.",
      dos: "Use mosquito nets, take medicines as prescribed, rest.",
      donts: "Do not ignore fever with chills, avoid mosquito bites.",
      doctor: "If high fever, confusion, or persistent vomiting.",
    },
    {
      name: "Dengue",
      keywords: ["dengue", "डेंगू", "mosquito fever", "platelet"],
      what: "A viral infection spread by mosquitoes.",
      symptoms: "High fever, severe headache, pain behind eyes, joint/muscle pain, rash.",
      causes: "Dengue virus via Aedes mosquito bite.",
      dos: "Rest, drink fluids, use mosquito protection, monitor platelets.",
      donts: "Do not take aspirin/NSAIDs, avoid mosquito bites.",
      doctor: "If bleeding, severe abdominal pain, or persistent vomiting.",
    },
    {
      name: "Typhoid",
      keywords: ["typhoid", "टाइफाइड", "enteric fever", "salmonella"],
      what: "A bacterial infection causing prolonged fever.",
      symptoms: "Fever, weakness, abdominal pain, headache, loss of appetite.",
      causes: "Salmonella bacteria via contaminated food/water.",
      dos: "Take antibiotics as prescribed, rest, drink fluids, eat light.",
      donts: "Do not stop medicines early, avoid outside food.",
      doctor: "If high fever, confusion, or persistent vomiting.",
    },
    {
      name: "Allergies",
      keywords: ["allergy", "एलर्जी", "sneezing", "itchy eyes", "runny nose", "hives"],
      what: "Body's reaction to harmless substances (allergens).",
      symptoms: "Sneezing, runny nose, itching, rash, watery eyes.",
      causes: "Dust, pollen, food, medicines, insect stings.",
      dos: "Avoid allergens, use prescribed medicines, keep surroundings clean.",
      donts: "Do not scratch rash, avoid known triggers.",
      doctor: "If difficulty breathing, swelling, or severe reaction.",
    },
    {
      name: "Skin Rashes",
      keywords: ["skin rash", "चमड़ी पर दाने", "itching", "red spots", "allergy"],
      what: "Changes in skin color, texture, or appearance.",
      symptoms: "Red spots, itching, swelling, blisters.",
      causes: "Allergies, infections, heat, irritants.",
      dos: "Keep area clean, use gentle moisturizer, avoid scratching.",
      donts: "Do not use harsh soaps, avoid irritants.",
      doctor: "If rash spreads rapidly, with fever, or difficulty breathing.",
    },
    {
      name: "Back Pain",
      keywords: ["back pain", "पीठ दर्द", "lower back pain", "stiffness"],
      what: "Pain or discomfort in the back area.",
      symptoms: "Aching, stiffness, pain with movement, muscle spasms.",
      causes: "Poor posture, injury, lifting heavy objects, inactivity.",
      dos: "Maintain good posture, gentle stretching, use support while sitting.",
      donts: "Avoid heavy lifting, do not rest in bed for long periods.",
      doctor: "If pain radiates to legs, with numbness, or after injury.",
    },
    {
      name: "Anemia",
      keywords: ["anemia", "एनीमिया", "low hemoglobin", "fatigue", "weakness"],
      what: "A condition with low red blood cells or hemoglobin.",
      symptoms: "Fatigue, weakness, pale skin, shortness of breath.",
      causes: "Iron deficiency, blood loss, chronic diseases.",
      dos: "Eat iron-rich foods, take supplements as advised, regular checkups.",
      donts: "Do not ignore persistent fatigue, avoid self-medicating.",
      doctor: "If severe weakness, chest pain, or rapid heartbeat.",
    },
    {
      name: "Stress/Anxiety",
      keywords: ["stress", "anxiety", "तनाव", "चिंता", "nervousness", "worry"],
      what: "Emotional/mental strain due to challenging situations.",
      symptoms: "Worry, restlessness, sleep problems, irritability, palpitations.",
      causes: "Work, studies, relationships, health issues.",
      dos: "Practice relaxation, talk to someone, exercise, maintain routine.",
      donts: "Avoid excessive caffeine, do not isolate yourself.",
      doctor: "If persistent sadness, thoughts of self-harm, or unable to function.",
    },
  ];
  // removed old wellness and diet objects, now handled by general health logic below

  private detectLanguage(message: string): SupportedLanguage {
    const hindiPattern = /[\u0900-\u097F]/;
    return hindiPattern.test(message) ? "hindi" : "english";
  }

  private isGreeting(message: string): boolean {
    const greetings = ["hello", "hi", "hey", "नमस्ते", "हैलो", "हाय"];
    return greetings.some((g) => message.toLowerCase().includes(g.toLowerCase()));
  }

  // Removed getFirstAidResponse: now handled by diseaseInfo and general health logic

  // Removed getWellnessResponse: now handled by general health logic

  private getDiseaseInfo(message: string): AnalysisResult | null {
    const lower = message.toLowerCase();
    for (const disease of this.diseaseInfo) {
      for (const kw of disease.keywords) {
        if (lower.includes(kw.toLowerCase())) {
          // Concise, plain text answer (2-3 lines)
          const info = `${disease.name}: ${disease.what} Signs: ${disease.symptoms} What to do: ${disease.dos} Go to a doctor if: ${disease.doctor}\n\n⚠️ I am not a doctor. This is only general health info. For serious or emergency problems, see a real doctor.`;
          return { response: info, confidence: 0.95, type: "disease_info" };
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

    // 1. Check for disease/symptom info first
    const disease = this.getDiseaseInfo(message);
    if (disease) {
      // Concise, plain text answer (2-3 lines)
      this.chatHistory.push({ user: message, bot: disease.response, timestamp: new Date() });
      return disease.response;
    }

    // 2. First aid quick answers
    const lowerMsg = message.toLowerCase();
    if (/cut|bleeding|wound|injury|burn|fracture|sprain|nosebleed|bite|sting|poison|fracture|bandage/.test(lowerMsg)) {
      let resp = "";
      if (/cut|bleeding|wound/.test(lowerMsg)) {
        resp = "For cuts/bleeding: Wash with clean water, apply pressure to stop bleeding, cover with a clean bandage. See a doctor if deep or won't stop bleeding.";
      } else if (/burn/.test(lowerMsg)) {
        resp = "For burns: Cool the area with running water for 10 minutes, cover with a clean cloth, do not apply ice or toothpaste. See a doctor if severe.";
      } else if (/fracture|sprain/.test(lowerMsg)) {
        resp = "For fractures/sprains: Immobilize the area, apply a cold pack, keep it elevated. Do not try to straighten. See a doctor.";
      } else if (/nosebleed/.test(lowerMsg)) {
        resp = "For nosebleed: Sit up, lean forward, pinch the nose for 10 minutes. Do not tilt head back. See a doctor if it doesn't stop.";
      } else if (/bite|sting/.test(lowerMsg)) {
        resp = "For bites/stings: Wash area, apply cold pack, watch for allergy. See a doctor if severe reaction.";
      } else if (/poison/.test(lowerMsg)) {
        resp = "For poisoning: Do not induce vomiting. Call emergency services or go to hospital immediately.";
      }
      if (resp) {
        resp += "\n\n⚠️ I am not a doctor. For serious or emergency problems, see a real doctor.";
        this.chatHistory.push({ user: message, bot: resp, timestamp: new Date() });
        return resp;
      }
    }

    // 3. Conversational greetings
    if (this.isGreeting(message)) {
      const greet =
        this.language === "hindi"
          ? "🏥 नमस्ते! मैं HealthConnect AI हूं। मैं सहायता कर सकता हूं: लक्षण जांच, प्राथमिक चिकित्सा, स्वास्थ्य जागरूकता, डाइट/व्यायाम सलाह."
          : "🏥 Hello! I am HealthConnect AI. I can help with symptom checks, first-aid, health awareness, and diet/exercise guidance.";
      this.chatHistory.push({ user: message, bot: greet, timestamp: new Date() });
      return greet;
    }

    // 4. Small talk and interactive follow-ups
    if (/how are you|how's it going|how do you do|what's up|how r u/.test(lowerMsg)) {
      const resp = "I'm just a helpful health assistant, always here for you! How can I help you today?";
      this.chatHistory.push({ user: message, bot: resp, timestamp: new Date() });
      return resp;
    }
    if (/thank you|thanks|shukriya|dhanyavad|thx/.test(lowerMsg)) {
      const resp = "You're welcome! If you have more questions or need health tips, just ask.";
      this.chatHistory.push({ user: message, bot: resp, timestamp: new Date() });
      return resp;
    }
    if (/who are you|what can you do|who made you/.test(lowerMsg)) {
      const resp = "I'm an AI health assistant. I give simple health info, tips, and help you know when to see a doctor. Want to know about a disease, symptom, or healthy habits?";
      this.chatHistory.push({ user: message, bot: resp, timestamp: new Date() });
      return resp;
    }

    // 5. General health topics
    if (/diet|healthy food|nutrition|खाना|भोजन|खाद्य|खाद्य पदार्थ/.test(lowerMsg)) {
      const resp = `Eat more fruits and vegetables. Drink water. Try to eat less sugar, salt, and junk food.\n\n⚠️ I am not a doctor. This is only general health info. For serious or emergency problems, see a real doctor.`;
      this.chatHistory.push({ user: message, bot: resp, timestamp: new Date() });
      return resp;
    }
    if (/exercise|workout|physical activity|व्यायाम|कसरत/.test(lowerMsg)) {
      const resp = `Move your body every day. Walk, stretch, or play. Exercise helps you feel better and stay healthy.\n\n⚠️ I am not a doctor. This is only general health info. For serious or emergency problems, see a real doctor.`;
      this.chatHistory.push({ user: message, bot: resp, timestamp: new Date() });
      return resp;
    }
    if (/immunity|boost immunity|प्रतिरक्षा|immunize/.test(lowerMsg)) {
      const resp = `To stay strong: eat well, sleep enough, move your body, and get your vaccines.\n\n⚠️ I am not a doctor. This is only general health info. For serious or emergency problems, see a real doctor.`;
      this.chatHistory.push({ user: message, bot: resp, timestamp: new Date() });
      return resp;
    }
    if (/home remedy|home remedies|remedy|gharelu|घरेलू/.test(lowerMsg)) {
      const resp = `For cough: try honey (if age >1). For sore throat: gargle with warm salt water. For stuffy nose: steam.\n\n⚠️ I am not a doctor. This is only general health info. For serious or emergency problems, see a real doctor.`;
      this.chatHistory.push({ user: message, bot: resp, timestamp: new Date() });
      return resp;
    }
    if (/prevent|prevention|बचाव|seasonal illness|flu season|monsoon/.test(lowerMsg)) {
      const resp = `Wash your hands. Stay away from sick people. Use mosquito nets. Eat well and rest.\n\n⚠️ I am not a doctor. This is only general health info. For serious or emergency problems, see a real doctor.`;
      this.chatHistory.push({ user: message, bot: resp, timestamp: new Date() });
      return resp;
    }

    // 6. Fallback
    const fb = this.getFallback(message);
    this.chatHistory.push({ user: message, bot: fb.response, timestamp: new Date() });
    return fb.response;
  }
}

export default new HealthChatbotService();



