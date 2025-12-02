// server.js (Garanti Hashtag Versiyonu)
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

    // Platform Talimatları
    let platformInstruction = "";
    if (platform === 'twitter') {
        platformInstruction = "Bu bir X (Twitter) tweeti. Maksimum 280 karakter. Vurucu olsun.";
    } else if (platform === 'linkedin') {
        platformInstruction = "Bu bir LinkedIn gönderisi. Profesyonel ve kurumsal olsun.";
    } else if (platform === 'facebook') {
        platformInstruction = "Bu bir Facebook gönderisi. Samimi ve etkileşim odaklı olsun.";
    } else {
        platformInstruction = "Bu bir Instagram başlığı. Bol emoji kullan. Görseli betimleyen duygusal bir dil kullan.";
    }

    const langInstruction = language === 'en' 
        ? "OUTPUT MUST BE IN ENGLISH." 
        : "YANIT SADECE TÜRKÇE OLMALIDIR.";

    try {
        const prompt = `
            Sen profesyonel bir Sosyal Medya Uzmanısın.
            
            GÖREV: Aşağıdaki bilgilere göre bir gönderi hazırla.
            
            KURALLAR:
            1. ${platformInstruction}
            2. ${langInstruction}
            3. Konuyla ilgili 3-4 popüler hashtag ekle.
            
            DETAYLAR:
            - KONU: "${topic}"
            - TON: "${tone}"
            - UZUNLUK: ${length}
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        });

        // 🛑 İŞTE SİHİRLİ DOKUNUŞ BURADA:
        // AI ne verirse versin, sonuna biz ekliyoruz.
        const originalText = completion.choices[0].message.content;
        const finalText = `${originalText}\n\n#CapGenius 🚀`;

        res.json({ caption: finalText });

    } catch (error) {
        console.error("Hata:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde hazır! 🚀`);
});