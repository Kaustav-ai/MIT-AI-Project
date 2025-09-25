import { useEffect, useMemo, useRef, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GoogleTranslate from "@/components/ui/googleTranslate";
import { LANGUAGE_LABELS, SPEECH_LOCALES, translateText, type LocaleCode } from "@/lib/translate";
import healthChatbot from "@/lib/healthChatbot";
import { 
  Send, 
  Bot, 
  User, 
  Heart, 
  Pill, 
  Stethoscope,
  Languages,
  Mic,
  MicOff,
  HelpCircle
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: "symptom" | "medication" | "advice";
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI health assistant. I can help you with symptom checking, medication reminders, first-aid guidance, and connect you with healthcare professionals. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LocaleCode>("en");
  const recognitionRef = useRef<any>(null);
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
  const speechLocale = useMemo(() => SPEECH_LOCALES[selectedLanguage] || 'en-IN', [selectedLanguage]);

  const languages: Array<{ code: LocaleCode; label: string }> = (Object.keys(LANGUAGE_LABELS) as LocaleCode[])
    .map(code => ({ code, label: LANGUAGE_LABELS[code] }))
    .filter(item => ["en","hi","mr","bn","pa","ta","te","gu"].includes(item.code));

  const quickActions = [
    { label: "Symptom Checker", icon: Stethoscope, type: "symptom" },
    { label: "First Aid", icon: Heart, type: "first-aid" },
    { label: "Medicine Reminder", icon: Pill, type: "medication" },
    { label: "Find Doctor", icon: User, type: "doctor" },
    { label: "Common Symptoms", icon: HelpCircle, type: "common-symptoms", link: "/symptoms" },
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    try {
      // Translate user input to English for processing
      const inputForAI = await translateText(userMessage.content, 'en', selectedLanguage);
      const replyEn = await healthChatbot.handleChat(inputForAI);
      // Translate bot reply back to selected language
      const reply = await translateText(replyEn, selectedLanguage, 'en');
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: reply,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      speak(reply);
    } finally {
      setIsTyping(false);
    }
  };
  // Speech: Text-to-Speech
  const speak = (text: string) => {
    try {
      if (!synth) return;
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = speechLocale;
      // try pick a matching voice
      const voices = synth.getVoices();
      const match = voices.find(v => v.lang === speechLocale) || voices.find(v => v.lang.startsWith(selectedLanguage));
      if (match) utter.voice = match;
      synth.cancel();
      synth.speak(utter);
    } catch {}
  }

  // Speech: STT via Web Speech API
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setIsListening(false);
      return;
    }
    const recog: any = new SR();
    recognitionRef.current = recog;
    recog.lang = speechLocale;
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    recog.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInputMessage(transcript);
    };
    recog.onend = () => setIsListening(false);
    recog.onerror = () => setIsListening(false);
    setIsListening(true);
    recog.start();
  }

  useEffect(() => {
    // ensure voices are loaded
    if (!synth) return;
    if (synth.getVoices().length === 0) {
      synth.onvoiceschanged = () => {};
    }
  }, [synth]);

  const handleQuickAction = (type: string) => {
    const actionMessages = {
      symptom: "I'd like to check my symptoms",
      "first-aid": "I need first aid guidance",
      medication: "Help me with medication reminders",
      doctor: "I want to find a doctor"
    };
    
    setInputMessage(actionMessages[type as keyof typeof actionMessages] || "");
  };

  return (
    <Layout showChatButton={false}>
      <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-4rem)]">
        <div className="flex h-full gap-4">
          {/* Chat Interface */}
          <div className="flex-1 flex flex-col healthcare-card p-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/50">
              <div className="flex items-center space-x-3">
                <div className="primary-gradient p-2 rounded-lg">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">AI Health Assistant</h1>
                  <p className="text-sm text-muted-foreground">Online • Ready to help</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <select 
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as LocaleCode)}
                  className="bg-muted border border-border rounded-lg px-3 py-1 text-sm"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.label}</option>
                  ))}
                </select>
                <Languages className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <GoogleTranslate className="min-w-[120px]" languages="hi,mr,pa,gu,bn,ta,te,kn,ml,or,as" />
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[80%] ${
                    message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}>
                    <div className={`p-2 rounded-lg ${
                      message.sender === "user" 
                        ? "primary-gradient" 
                        : "bg-muted"
                    }`}>
                      {message.sender === "user" ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-foreground" />
                      )}
                    </div>
                    <div className={`p-4 rounded-lg ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border/50"
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.sender === "user" 
                          ? "text-primary-foreground/70" 
                          : "text-muted-foreground"
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3 max-w-[80%]">
                    <div className="p-2 rounded-lg bg-muted">
                      <Bot className="h-4 w-4 text-foreground" />
                    </div>
                    <div className="p-4 rounded-lg bg-card border border-border/50">
                      <p className="text-sm text-muted-foreground">AI is typing…</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border/50 pt-4">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your health question or concern..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  variant={isListening ? "warning" : "ghost"}
                  size="icon"
                  onClick={toggleListening}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button onClick={handleSendMessage} variant="hero">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="w-80 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  if (action.type === "common-symptoms" && action.link) {
                    return (
                      <a
                        key={action.type}
                        href={action.link}
                        className="w-full"
                        style={{ textDecoration: 'none' }}
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-start card-hover px-4 py-2"
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {action.label}
                        </Button>
                      </a>
                    );
                  }
                  return (
                    <Button
                      key={action.type}
                      variant="outline"
                      className="w-full justify-start card-hover px-4 py-2"
                      onClick={() => handleQuickAction(action.type)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {action.label}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Emergency (India)</span>
                    <Badge variant="destructive">112</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Ambulance</span>
                    <Badge variant="secondary">102</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Emergency Services</span>
                    <Badge variant="secondary">108</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Women Helpline</span>
                    <Badge variant="secondary">1091</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Child Helpline</span>
                    <Badge variant="secondary">1098</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chatbot;