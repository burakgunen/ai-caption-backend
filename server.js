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
    // Platformu kaldırdık, sadece konu, ton, uzunluk ve dil alıyoruz.
    const { topic, tone, length, language } = req.body;

    if (!topic) {
        return res.status(400).json({ error: "Lütfen bir konu girin." });
    }

    // Dil Talimatı
    const langInstruction = language === 'en' 
        ? "OUTPUT MUST BE IN ENGLISH." 
        : "YANIT SADECE TÜRKÇE OLMALIDIR. Sokak ağzı, Twitter jargonu ve doğal tepkiler kullanabilirsin.";

    try {
        // 🔥 GÜÇLENDİRİLMİŞ PROMPT (FENOMEN MODU) 🔥
        const prompt = `
            Sen sıradan bir bot değil, sosyal medyanın nabzını tutan, fanatik, lafını esirgemeyen bir FENOMENSİN.
            
            GÖREV: Verilen konu hakkında, seçilen duygu durumuna (ton) uygun, etkileşim alacak bir gönderi yaz.
            
            ÖNEMLİ TAKTİKLER:
            - Eğer konu bir futbol takımı, teknik direktör veya maç ise ve ton "Öfkeli" ise: Sanki maçı tribünde izlemiş ve çıldırmış bir taraftar gibi konuş. Hataları yüzüne vur, "Hocam", "Abi", "Yeter artık" gibi doğal tepkiler ver.
            - Eğer ton "Mizahi" ise: Durumla inceden dalga geç, ironi yap.
            - Asla "robot" gibi resmi konuşma. Samimi, iddialı ve duygusal ol.
            - Konu hakkında net bilgin yoksa bile (örn: maç skoru), en olası senaryoya göre (örn: yenilgi veya kötü oyun) varsayımda bulunarak yorum yap.

            KURALLAR:
            1. ${langInstruction}
            2. Konuyla ilgili 3-4 popüler ve alakalı hashtag ekle.
            
            GİRDİLER:
            - KONU: "${topic}"
            - TON: "${tone}"
            - UZUNLUK: ${length}
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        });

        const originalText = completion.choices[0].message.content;

        // 🛑 ZORUNLU İMZA:
        // AI ne verirse versin, sonuna biz ekliyoruz.
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