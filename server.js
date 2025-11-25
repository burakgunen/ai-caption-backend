// server.js (Global & Duygusal Versiyon)
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
    // Artık 'language' (dil) bilgisini de alıyoruz
    const { topic, tone, length, language } = req.body;

    if (!topic) {
        return res.status(400).json({ error: "Lütfen bir konu girin." });
    }

    // Dil seçimine göre Yapay Zeka'ya talimat
    const langInstruction = language === 'en' 
        ? "OUTPUT MUST BE IN ENGLISH." 
        : "YANIT SADECE TÜRKÇE OLMALIDIR.";

    try {
        const prompt = `
            Sen profesyonel bir Sosyal Medya İçerik Uzmanısın.
            
            GÖREV: Aşağıdaki KONU için, belirtilen TONDA ve UZUNLUKTA bir Instagram başlığı (caption) yaz.
            
            KURALLAR:
            1. ${langInstruction} (Dil kuralına kesinlikle uy).
            2. Başlık dışında ek açıklama, giriş veya sonuç cümlesi asla yazma.
            3. Emoji kullanımı: Tonuna uygun bolca emoji kullan.
            4. Hashtag: Konuyla ilgili 5 popüler hashtag ekle.
            
            DETAYLAR:
            - KONU: "${topic}"
            - TON (Duygu Durumu): "${tone}"
            - UZUNLUK: ${length}
            - DİL: ${language === 'en' ? 'English' : 'Türkçe'}
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        });

        const caption = completion.choices[0].message.content;
        res.json({ caption: caption });

    } catch (error) {
        console.error("Hata:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Global Sunucu http://localhost:${PORT} adresinde hazır! 🌍`);
});