import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const SYMPTOMS = [
  {
    name: "Fever",
    medicines: ["Paracetamol (Acetaminophen)", "Ibuprofen"],
    remedies: ["Rest", "Hydration", "Light clothing"],
    dos: ["Monitor temperature", "Seek care if >103°F or persistent"],
    donts: ["Overexertion", "Alcohol-based rubs on kids"],
    fee: 550,
  },
  {
    name: "Common Cold",
    medicines: ["Antihistamines", "Decongestant nasal spray"],
    remedies: ["Steam inhalation", "Saline nasal drops"],
    dos: ["Rest well", "Stay hydrated"],
    donts: ["Unnecessary antibiotics"],
    fee: 375,
  },
  {
    name: "Cough",
    medicines: ["Dextromethorphan cough syrup", "Guaifenesin"],
    remedies: ["Honey + warm fluids", "Humidifier"],
    dos: ["Avoid smoke", "Hydrate"],
    donts: ["Suppress productive cough excessively"],
    fee: 550,
  },
  {
    name: "Headache",
    medicines: ["Paracetamol", "Ibuprofen"],
    remedies: ["Rest in a dark room", "Cold/warm compress"],
    dos: ["Hydrate", "Limit screen time"],
    donts: ["Excess caffeine"],
    fee: 550,
  },
  {
    name: "Stomach Pain",
    medicines: ["Antacids", "ORS if diarrhea"],
    remedies: ["Light meals", "Warm compress"],
    dos: ["Track triggers", "Seek care if severe"],
    donts: ["Spicy/oily food when symptomatic"],
    fee: 700,
  },
  {
    name: "Sore Throat",
    medicines: ["Lozenges", "Paracetamol"],
    remedies: ["Warm saline gargles", "Warm fluids"],
    dos: ["Rest voice", "Hydrate"],
    donts: ["Very cold drinks"],
    fee: 375,
  },
  {
    name: "Allergic Rhinitis",
    medicines: ["Cetirizine/Levocetirizine", "Nasal saline"],
    remedies: ["Avoid triggers", "Steam inhalation"],
    dos: ["Keep rooms dust-free", "Use mask in pollen season"],
    donts: ["Exposure to smoke/perfumes"],
    fee: 550,
  },
  {
    name: "Acidity/Indigestion",
    medicines: ["Antacids", "H2 blockers (famotidine)"],
    remedies: ["Smaller meals", "Avoid late-night eating"],
    dos: ["Keep a food diary", "Elevate head during sleep"],
    donts: ["Spicy/fatty foods", "Excess caffeine"],
    fee: 550,
  },
  {
    name: "Diarrhea",
    medicines: ["ORS", "Zinc (short course)", "Probiotics"],
    remedies: ["BRAT diet (short-term)", "Hydration"],
    dos: ["Wash hands often", "Seek care for blood in stool"],
    donts: ["Street food", "Unboiled water"],
    fee: 550,
  },
  {
    name: "Muscle Pain",
    medicines: ["Paracetamol", "Topical analgesic gel"],
    remedies: ["Rest/ice", "Gentle stretching"],
    dos: ["Warm-up before exercise", "Good posture"],
    donts: ["Heavy lifting while in pain"],
    fee: 550,
  },
  {
    name: "Migraine",
    medicines: ["Paracetamol", "Ibuprofen", "Caffeine (limited)"],
    remedies: ["Dark quiet room", "Cold/ warm compress"],
    dos: ["Maintain sleep schedule", "Hydrate"],
    donts: ["Skipping meals", "Excess screen time"],
    fee: 700,
  },
  {
    name: "Skin Rash",
    medicines: ["Calamine lotion", "Antihistamine (for itch)", "Hydrocortisone 1% (short-term)"],
    remedies: ["Cool compress", "Gentle fragrance-free moisturizer"],
    dos: ["Keep area clean/dry", "Patch-test products"],
    donts: ["Scratching", "Harsh soaps/irritants"],
    fee: 550,
  },
];

const CommonSymptoms = () => {
  const navigate = useNavigate();
  return (
    <Layout showChatButton={false}>
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Common Diseases</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {SYMPTOMS.map((s) => (
            <Card
              key={s.name}
              className="healthcare-card h-full min-h-[500px] flex flex-col card-hover transition-transform duration-300 ease-out hover:-translate-y-3 hover:scale-[1.01] hover:shadow-[var(--shadow-xl)]"
            >
              <CardHeader>
                <CardTitle className="text-lg">{s.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 flex flex-col">
                <div>
                  <p className="text-sm font-medium">Common Medicines</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground">
                    {s.medicines.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
                <div className="min-h-[100px]">
                  <p className="text-sm font-medium">Home Remedies / Cure</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground">
                    {s.remedies.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4 min-h-[120px]">
                  <div className="min-h-[100px]">
                    <p className="text-sm font-medium">Do’s</p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      {s.dos.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="min-h-[100px]">
                    <p className="text-sm font-medium">Don’ts</p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      {s.donts.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-auto pt-2">
                  <Button
                    variant="hero"
                    className="w-full group"
                    onClick={() => navigate("/payment", { state: { fee: s.fee, consultationType: "video" } })}
                  >
                    <span className="flex items-center justify-center gap-2">
                      Book Consultation
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-3" />
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Information is for educational purposes only. Please consult a doctor for serious conditions.
        </p>
      </div>
    </Layout>
  );
};

export default CommonSymptoms;


