// server.js (Backend Kodu - DÜZELTİLMİŞ)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/generate', async (req, res) => {
    const { topic, tone, length, language, platform } = req.body;

    if (!topic) {
        return res.status(400).json({ error: "Lütfen bir konu girin." });
    }

    // Platforma göre talimatlar
    let platformInstruction = "";
    if (platform === 'twitter') {
        platformInstruction = "Bu bir X (Twitter) tweeti. Maksimum 280 karakter. Vurucu, kısa ve zekice olsun. Az hashtag kullan.";
    } else if (platform === 'linkedin') {
        platformInstruction = "Bu bir LinkedIn gönderisi. Profesyonel, kurumsal dil kullan. Paragraflara böl.";
    } else if (platform === 'facebook') {
        platformInstruction = "Bu bir Facebook gönderisi. Samimi, etkileşim odaklı olsun. Sorular sor.";
    } else {
        platformInstruction = "Bu bir Instagram başlığı. Bol emoji kullan. Duygusal ve havalı olsun. Bol hashtag ekle.";
    }

    const langInstruction = language === 'en' ? "OUTPUT MUST BE IN ENGLISH." : "YANIT SADECE TÜRKÇE OLMALIDIR.";

    try {
        const prompt = `
            Sen profesyonel bir Sosyal Medya Uzmanısın.
            GÖREV: Aşağıdaki bilgilere göre gönderi hazırla.
            PLATFORM: ${platform ? platform.toUpperCase() : 'INSTAGRAM'}
            KURALLAR:
            1. ${platformInstruction}
            2. ${langInstruction}
            3. Sadece metni yaz, açıklama ekleme.
            
            DETAYLAR:
            - KONU: "${topic}"
            - TON: "${tone}"
            - UZUNLUK: ${length}
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        });

        res.json({ caption: completion.choices[0].message.content });

    } catch (error) {
        console.error("Hata:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde hazır! 🚀`);
});