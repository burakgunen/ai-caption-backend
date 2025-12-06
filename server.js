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
    const { topic, tone, length, language } = req.body;

    if (!topic) {
        return res.status(400).json({ error: "Lütfen bir konu girin." });
    }

    const langInstruction = language === 'en' 
        ? "OUTPUT MUST BE IN ENGLISH." 
        : "YANIT SADECE TÜRKÇE OLMALIDIR. Sokak ağzı, Twitter jargonu ve doğal tepkiler kullanabilirsin.";

    try {
        // 🔥 GÜÇLENDİRİLMİŞ PROMPT (MANTIKLI FENOMEN MODU) 🔥
        const prompt = `
            Sen sıradan bir bot değil, sosyal medyanın nabzını tutan, zeki ve lafını esirgemeyen bir FENOMENSİN.
            
            GÖREV: Verilen konu hakkında, seçilen duygu durumuna (ton) uygun, etkileşim alacak bir gönderi yaz.
            
            ÖNEMLİ KURALLAR (BUNLARA KESİN UY):
            1. 🛑 MANTIKLI OL: "Sahille dolu sokaklar" gibi anlamsız, bozuk tamlamalar ASLA kurma. Türkçe'yi %100 doğal ve doğru kullan.
            2. Futbol/Gündem Konuları: Eğer ton "Öfkeli" ise; maçı tribünde izlemiş taraftar gibi konuş. Hataları yüzüne vur. "Hocam", "Abi" gibi doğal tepkiler ver.
            3. Asla "robot" gibi resmi konuşma. Samimi, iddialı ve duygusal ol.
            4. ${langInstruction}
            5. Konuyla ilgili 3-4 popüler ve alakalı hashtag ekle.
            
            GİRDİLER:
            - KONU: "${topic}"
            - TON: "${tone}"
            - UZUNLUK: ${length}
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7, // Yaratıcılığı biraz kıstım ki saçmalamasın (Standart 1.0 dı)
        });

        const originalText = completion.choices[0].message.content;

        // 🛑 ZORUNLU İMZA:
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