// Telegram bot for HealthConnect AI
require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

class HealthChatbotService {
	constructor() {
		this.language = 'english';
	}
	detectLanguage(message) {
		const hindiPattern = /[\u0900-\u097F]/;
		return hindiPattern.test(message) ? 'hindi' : 'english';
	}
	isGreeting(message) {
		const greetings = ['hello','hi','hey','नमस्ते','हैलो','हाय'];
		return greetings.some(g => message.toLowerCase().includes(g.toLowerCase()));
	}
	getFirstAidResponse(msg) {
		const lower = msg.toLowerCase();
		const items = [
			{ keys:['cut','घाव','bleeding','खून'], hi:"1) साफ पानी से धोएं\n2) दबाव डालें\n3) साफ पट्टी\n4) गहरा हो तो डॉक्टर", en:"1) Rinse with clean water\n2) Apply pressure\n3) Bandage\n4) See a doctor if deep" },
			{ keys:['burn','जलना','fire'], hi:"1) ठंडे पानी में 10-15 मिनट\n2) बर्फ न लगाएं\n3) छाले न फोड़ें\n4) गंभीर हो तो अस्पताल", en:"1) Cool water 10-15 min\n2) No ice\n3) Do not pop blisters\n4) Hospital for severe burns" },
		];
		for (const it of items) {
			if (it.keys.some(k => lower.includes(k.toLowerCase()))) {
				const txt = this.language === 'hindi' ? it.hi : it.en;
				const extra = this.language === 'hindi' ? "\n\n🚨 आपातकाल: 102/108" : "\n\n🚨 Emergency: 102/108";
				return `${txt}${extra}`;
			}
		}
		return null;
	}
	getSymptomResponse(msg) {
		const lower = msg.toLowerCase();
		const items = [
			{ keys:['fever','बुखार','temperature','तापमान'], hi:"बुखार: पानी पिएं, आराम करें, ठंडी पट्टी। 102°F+ पर डॉक्टर से मिलें।", en:"Fever: Hydrate, rest, cool compress. See a doctor if above 102°F." },
			{ keys:['headache','सिर दर्द','सिरदर्द'], hi:"सिर दर्द: आराम, पानी, अंधेरा कमरा, हल्की मालिश।", en:"Headache: Rest in a dark room, hydrate, gentle massage." },
			{ keys:['cough','खांसी','कफ'], hi:"खांसी: गुनगुना पानी, शहद-अदरक, भाप।", en:"Cough: Warm water, honey-ginger, steam." },
			{ keys:['chest pain','छाती में दर्द','सीने में दर्द'], hi:"⚠️ छाती में दर्द: तुरंत आराम, 102/108 कॉल। दिल का खतरा हो सकता है।", en:"⚠️ Chest pain: Rest, call emergency (102/108)." },
		];
		for (const it of items) {
			if (it.keys.some(k => lower.includes(k.toLowerCase()))) {
				return this.language === 'hindi' ? it.hi : it.en;
			}
		}
		return null;
	}
	getWellness(msg) {
		const lower = msg.toLowerCase();
		if (/(diet|food|खाना|भोजन)/.test(lower)) {
			if (/(diabetes|डायबिटीज)/.test(lower)) {
				return this.language === 'hindi'
					? "डायबिटीज: कम चीनी, ज्यादा फाइबर, नियमित भोजन/व्यायाम।"
					: "Diabetes: Low sugar, high fiber, regular meals and exercise.";
			}
			if (/(hypertension|bp|बीपी)/.test(lower)) {
				return this.language === 'hindi'
					? "हाई BP: कम नमक, फल-सब्ज़ियां, वजन कंट्रोल।"
					: "High BP: Low salt, more fruits/veggies, weight control.";
			}
		}
		if (/(exercise|workout|व्यायाम|कसरत)/.test(lower)) {
			return this.language === 'hindi'
				? "दैनिक व्यायाम: 30 मिनट वॉक, योग, सांस अभ्यास।"
				: "Daily exercise: 30 min walk, yoga, breathing exercises.";
		}
		return null;
	}
	async handle(message) {
		this.language = this.detectLanguage(message);
		if (this.isGreeting(message)) {
			return this.language === 'hindi'
				? "🏥 नमस्ते! मैं HealthConnect AI हूँ — लक्षण जांच, प्राथमिक चिकित्सा, स्वास्थ्य सलाह में मदद कर सकता हूँ।"
				: "🏥 Hello! I’m HealthConnect AI — I help with symptom checks, first-aid and wellness advice.";
		}
		const fa = this.getFirstAidResponse(message);
		if (fa) return fa;
		const sym = this.getSymptomResponse(message);
		if (sym) return sym;
		const wel = this.getWellness(message);
		if (wel) return wel;
		return this.language === 'hindi'
			? "मैं पूरी तरह समझ नहीं पाया। उदाहरण: 'मुझे बुखार है', 'कटने पर क्या करें?'\n🚨 आपातकाल में 102/108 डायल करें।"
			: "I couldn’t fully understand. Try: 'I have fever', 'First aid for cuts?'\n🚨 In emergency dial local services (102/108).";
	}
}
const svc = new HealthChatbotService();

bot.start(ctx => ctx.reply('👋 Welcome to HealthConnect AI on Telegram! Type symptoms (e.g., "fever", "chest pain") or ask first-aid.'));
bot.help(ctx => ctx.reply('Try:\n• I have fever\n• First aid for burns\n• Diet for diabetes\n• Exercise tips'));

bot.on('text', async (ctx) => {
	const q = ctx.message.text || '';
	const answer = await svc.handle(q);
	await ctx.reply(answer);
});

bot.launch().then(() => console.log('Telegram bot running')).catch(console.error);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
