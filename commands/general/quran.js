const axios = require('axios');

// 114 سورتوں کے ناموں کا انٹیلیجنٹ ڈیٹا بیس (Roman Urdu, English & Common spellings)
const surahMapping = {
    "fatiha": 1, "al fatiha": 1, "baqarah": 2, "baqra": 2, "al baqarah": 2, "imran": 3, "aal e imran": 3, "ali imran": 3,
    "nisa": 4, "an nisa": 4, "maidah": 5, "maida": 5, "al maidah": 5, "anam": 6, "al anam": 6, "araf": 7, "al araf": 7,
    "anfal": 8, "al anfal": 8, "tawbah": 9, "tauba": 9, "at tawbah": 9, "yunus": 10, "hud": 11, "yusuf": 12, "yousuf": 12,
    "rad": 13, "ar rad": 13, "ibrahim": 14, "hijr": 15, "al hijr": 15, "nahl": 16, "an nahl": 16, "isra": 17, "bani israil": 17,
    "kahf": 18, "al kahf": 18, "maryam": 19, "mariam": 19, "taha": 20, "anbiya": 21, "al anbiya": 21, "hajj": 22, "al hajj": 22,
    "muminun": 23, "al muminun": 23, "nur": 24, "an nur": 24, "furqan": 25, "al furqan": 25, "shuara": 26, "ash shuara": 26,
    "naml": 27, "an naml": 27, "qasas": 28, "al qasas": 28, "ankabut": 29, "al ankabut": 29, "rum": 30, "ar rum": 30,
    "luqman": 31, "sajdah": 32, "as sajdah": 32, "ahzab": 33, "al ahzab": 33, "saba": 34, "fatir": 35, "yasin": 36, "yaseen": 36,
    "saffat": 37, "as saffat": 37, "sad": 38, "zumar": 39, "az zumar": 39, "ghafir": 40, "mumin": 40, "fussilat": 41, "ha mim": 41,
    "shura": 42, "ash shura": 42, "zukhruf": 43, "az zukhruf": 43, "dukhan": 44, "ad dukhan": 44, "jathiyah": 45, "al jathiyah": 45,
    "ahqaf": 46, "al ahqaf": 46, "muhammad": 47, "fath": 48, "al fath": 48, "hujurat": 49, "al hujurat": 49, "qaf": 50,
    "dhariyat": 51, "az dhariyat": 51, "tur": 52, "at tur": 52, "najm": 53, "an najm": 53, "qamar": 54, "al qamar": 54,
    "rahman": 55, "rehman": 55, "ar rahman": 55, "waqiah": 56, "waqia": 56, "al waqiah": 56, "hadid": 57, "al hadid": 57,
    "mujadilah": 58, "hashr": 59, "al hashr": 59, "mumtahinah": 60, "saff": 61, "as saff": 61, "jumuah": 62, "jumma": 62, "al jumuah": 62,
    "munafiqun": 63, "al munafiqun": 63, "taghabun": 64, "at taghabun": 64, "talaq": 65, "at talaq": 65, "tahrim": 66, "at tahrim": 66,
    "mulk": 67, "al mulk": 67, "qalam": 68, "al qalam": 68, "haqqah": 69, "al haqqah": 69, "maarij": 70, "al maarij": 70,
    "nuh": 71, "jinn": 72, "al jinn": 72, "muzammil": 73, "muzmil": 73, "al muzammil": 73, "muddaththir": 74, "mudassir": 74,
    "qiyamah": 75, "qiyamat": 75, "al qiyamah": 75, "insan": 76, "al insan": 76, "mursalat": 77, "al mursalat": 77,
    "naba": 78, "an naba": 78, "naziat": 79, "an naziat": 79, "abasa": 80, "takwir": 81, "at takwir": 81, "infitar": 82, "al infitar": 82,
    "mutaffifin": 83, "al mutaffifin": 83, "inshiqaq": 84, "al inshiqaq": 84, "buruj": 85, "al buruj": 85, "tariq": 86, "at tariq": 86,
    "ala": 87, "al ala": 87, "ghashiyah": 88, "al ghashiyah": 88, "fajr": 89, "al fajr": 89, "balad": 90, "al balad": 90,
    "shams": 91, "ash shams": 91, "layl": 92, "al layl": 92, "duha": 93, "ad duha": 93, "sharh": 94, "inshirah": 94, "nashrah": 94,
    "tin": 95, "at tin": 95, "alaq": 96, "al alaq": 96, "qadr": 97, "al qadr": 97, "bayyinah": 98, "al bayyinah": 98,
    "zilzal": 99, "zalzalah": 99, "az zilzal": 99, "adiyat": 100, "al adiyat": 100, "qariah": 101, "al qariah": 101,
    "takathur": 102, "at takathur": 102, "asr": 103, "al asr": 103, "humazah": 104, "al humazah": 104, "fil": 105, "al fil": 105,
    "quraysh": 106, "quraish": 106, "maun": 107, "al maun": 107, "kawthar": 108, "kauthar": 108, "al kawthar": 108,
    "kafirun": 109, "al kafirun": 109, "nasr": 110, "an nasr": 110, "masad": 111, "lahab": 111, "ikhlas": 112, "al ikhlas": 112,
    "falaq": 113, "al falaq": 113, "nas": 114, "an nas": 114
};

module.exports = {
  name: 'quran',
  aliases: ['surah', 'para', 'ayat', 'q'],
  category: 'general',
  description: 'Smart Al-Quran Engine with Search by Name/Number',
  usage: '.quran [Name/Number/Para/Ayat] [Optional Range]',

  async execute(sock, msg, args, extra) {
    const from = extra.from || msg.key.remoteJid;
    
    if (!args[0]) {
        return sock.sendMessage(from, {
            text: `╭━━━〔 🗺️ *S Y E D  M D  Q U R A N* 〕━━━👉
┃
┃ ⚠️ *No Input Detected!*
┃ 📝 *Super-Easy Formats:*
┃
┃ 🔹 *By Name:* \`.quran muzamil\` یا \`.quran yaseen 1-5\`
┃ 🔹 *By Number:* \`.quran 73\` یا \`.quran 2 1-10\`
┃ 🔹 *By Para:* \`.quran para 30\` یا \`.quran para 1 1-5\`
┃ 🔹 *By Specific Ayat:* \`.quran 2:255\` (Direct)
┃
╰━━━━━━━━━━━━━━━━━━━━━━━👉`
        }, { quoted: msg });
    }

    let searchType = 'surah';
    let targetNumber = '';
    let rangeInput = '';

    // ==================== SMART PARSING ENGINE ====================
    const firstArg = args[0].toLowerCase();
    const secondArg = args[1] ? args[1].toLowerCase() : '';

    // Check if user specified 'para' or 'juz'
    if (firstArg === 'para' || firstArg === 'juz' || firstArg === 'sepra') {
        searchType = 'para';
        targetNumber = args[1];
        rangeInput = args[2] || '';
    }
    // Check if it's a direct single ayat like 2:255
    else if (firstArg.includes(':')) {
        searchType = 'ayat';
        targetNumber = args[0];
    }
    // Check if first argument is a number (Direct Surah Number)
    else if (!isNaN(firstArg)) {
        searchType = 'surah';
        targetNumber = firstArg;
        rangeInput = args[1] || '';
    }
    // Check if first argument is a Surah Name
    else {
        // Clean up text for better matching (remove spaces/dashes if any)
        const cleanName = args.join(' ').replace(/[0-9]|-/g, '').trim().toLowerCase();
        
        if (surahMapping[cleanName]) {
            searchType = 'surah';
            targetNumber = surahMapping[cleanName];
            
            // Extract range if provided at the end (e.g., .quran muzmil 1-5)
            const lastArg = args[args.length - 1];
            if (lastArg && lastArg.includes('-')) {
                rangeInput = lastArg;
            }
        } else {
            // Fallback: search for partial word matching
            let foundSurah = Object.keys(surahMapping).find(key => cleanName.includes(key));
            if (foundSurah) {
                searchType = 'surah';
                targetNumber = surahMapping[foundSurah];
                const lastArg = args[args.length - 1];
                if (lastArg && lastArg.includes('-')) rangeInput = lastArg;
            } else {
                return sock.sendMessage(from, { text: `❌ *Error:* \`${args.join(' ')}\` نام کی کوئی سورہ نہیں ملی۔ اسپیلنگ چیک کریں یا سورہ نمبر لکھیں!` }, { quoted: msg });
            }
        }
    }

    // Dynamic Loader Graphics
    const displayQuery = searchType === 'surah' ? `Surah No. ${targetNumber}` : `${searchType.toUpperCase()} ${targetNumber}`;
    const initialMsg = await sock.sendMessage(from, { 
        text: `✨ 💠 *S Y E D  M D  I S L A M I C* 💠 ✨\n\n🔍 Engine Matched: *${displayQuery}*\n⏳ Fetching Arabic, Urdu & English translations parallelly...` 
    }, { quoted: msg });

    try {
      let arabicUrl, urduUrl, englishUrl;
      let titleHeader = '';
      let startAyah = 1;
      let endAyah = 10;
      let totalAyahsFound = 0;
      let ayahsArrayArabic = [];
      let ayahsArrayUrdu = [];
      let ayahsArrayEnglish = [];

      // ==================== FETCH & BUILD: SURAH ====================
      if (searchType === 'surah') {
          arabicUrl = `https://api.alquran.cloud/v1/surah/${targetNumber}`;
          urduUrl = `https://api.alquran.cloud/v1/surah/${targetNumber}/ur.ahmedali`;
          englishUrl = `https://api.alquran.cloud/v1/surah/${targetNumber}/en.sahih`;

          const [resA, resU, resE] = await Promise.all([axios.get(arabicUrl), axios.get(urduUrl), axios.get(englishUrl)]);
          
          const sData = resA.data.data;
          totalAyahsFound = sData.numberOfAyahs;
          titleHeader = `📖 *SURAH:* \`${sData.englishName} (${sData.name})\`\n🗺️ *REVELATION:* \`${sData.revelationType}\``;

          if (rangeInput && rangeInput.includes('-')) {
              const parts = rangeInput.split('-');
              startAyah = parseInt(parts[0]) || 1;
              endAyah = parseInt(parts[1]) || totalAyahsFound;
          } else {
              endAyah = Math.min(totalAyahsFound, 5); // Safe default for great interface view
          }

          if(startAyah < 1 || endAyah > totalAyahsFound || startAyah > endAyah) {
              return sock.sendMessage(from, { text: `⚠️ *Invalid Range:* This surah has total ${totalAyahsFound} ayats.` }, { quoted: msg });
          }

          ayahsArrayArabic = sData.ayahs.slice(startAyah - 1, endAyah);
          ayahsArrayUrdu = resU.data.data.ayahs.slice(startAyah - 1, endAyah);
          ayahsArrayEnglish = resE.data.data.ayahs.slice(startAyah - 1, endAyah);

      // ==================== FETCH & BUILD: PARA ====================
      } else if (searchType === 'para') {
          if (targetNumber < 1 || targetNumber > 30) {
              return sock.sendMessage(from, { text: "❌ *Error:* Para number must be between 1 and 30." }, { quoted: msg });
          }
          arabicUrl = `https://api.alquran.cloud/v1/juz/${targetNumber}/quran-simple`;
          urduUrl = `https://api.alquran.cloud/v1/juz/${targetNumber}/ur.ahmedali`;
          englishUrl = `https://api.alquran.cloud/v1/juz/${targetNumber}/en.sahih`;

          const [resA, resU, resE] = await Promise.all([axios.get(arabicUrl), axios.get(urduUrl), axios.get(englishUrl)]);
          
          totalAyahsFound = resA.data.data.ayahs.length;
          titleHeader = `✨ *PARA / SEPRA:* \`${targetNumber}\`\n🔢 *TOTAL AYATS IN JUZ:* \`${totalAyahsFound}\``;

          if (rangeInput && rangeInput.includes('-')) {
              const parts = rangeInput.split('-');
              startAyah = parseInt(parts[0]) || 1;
              endAyah = parseInt(parts[1]) || totalAyahsFound;
          } else {
              endAyah = Math.min(totalAyahsFound, 4);
          }

          ayahsArrayArabic = resA.data.data.ayahs.slice(startAyah - 1, endAyah);
          ayahsArrayUrdu = resU.data.data.ayahs.slice(startAyah - 1, endAyah);
          ayahsArrayEnglish = resE.data.data.ayahs.slice(startAyah - 1, endAyah);

      // ==================== FETCH & BUILD: AYAT ====================
      } else if (searchType === 'ayat') {
          arabicUrl = `https://api.alquran.cloud/v1/ayah/${targetNumber}`;
          urduUrl = `https://api.alquran.cloud/v1/ayah/${targetNumber}/ur.ahmedali`;
          englishUrl = `https://api.alquran.cloud/v1/ayah/${targetNumber}/en.sahih`;

          const [resA, resU, resE] = await Promise.all([axios.get(arabicUrl), axios.get(urduUrl), axios.get(englishUrl)]);
          
          const aData = resA.data.data;
          titleHeader = `🟢 *SPECIFIC AYAH KEY:* \`${targetNumber}\`\n%🕌 *SURAH:* \`${aData.surah.englishName}\` | *AYAH:* \`${aData.numberInSurah}\``;
          
          startAyah = 1;
          endAyah = 1;
          ayahsArrayArabic = [aData];
          ayahsArrayUrdu = [resU.data.data];
          ayahsArrayEnglish = [resE.data.data];
      }

      // Safe Chunk Validation
      if ((endAyah - startAyah) > 15) {
          return sock.sendMessage(from, { text: `⚠️ *Interface Alert:* WhatsApp lag سے بچنے کے لیے ایک وقت میں زیادہ سے زیادہ 15 آیات منگوائیں۔\n💡 *مثال:* \`.quran ${args[0]} 1-10\`` }, { quoted: msg });
      }

      // VIP Interface Frame Generation
      let quranCard = `⚡ 📲  *S Y E D   M D   A L - Q U R A N*  📲 ⚡\n`;
      quranCard += `╔═════════════════════════╗\n`;
      quranCard += `  ${titleHeader}\n`;
      quranCard += `  🔢 *DISPLAYING:* \`Ayats ${startAyah} - ${endAyah}\`\n`;
      quranCard += `╚═════════════════════════╝\n\n`;

      // Top Bismillah Layout
      if (searchType === 'surah' && targetNumber !== 1 && targetNumber !== 9 && startAyah === 1) {
          quranCard += `✨ *بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ* ✨\n`;
          quranCard += `_In the name of Allah, the Entirely Merciful, the Especially Merciful._\n`;
          quranCard += `_شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے_\n`;
          quranCard += `─────────────────────────\n\n`;
      }

      // Layout Grid Loop
      for (let i = 0; i < ayahsArrayArabic.length; i++) {
          let arText = ayahsArrayArabic[i].text;
          let urText = ayahsArrayUrdu[i].text;
          let enText = ayahsArrayEnglish[i].text;
          
          let currentAyahNum = searchType === 'ayat' ? ayahsArrayArabic[i].numberInSurah : (startAyah + i);
          let insideSurahName = searchType === 'para' ? ` (${ayahsArrayArabic[i].surah.englishName})` : '';

          // Format clean up
          if (searchType === 'surah' && currentAyahNum === 1 && targetNumber !== 1 && arText.startsWith("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ")) {
              arText = arText.replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", "").trim();
          }

          quranCard += `🟢 *[ AYAH ${currentAyahNum}${insideSurahName} ]* 💠━━━👉\n`;
          quranCard += `▶️ \`${arText}\`\n\n`;
          quranCard += `📝 *URDU:* _${urText}_\n\n`;
          quranCard += `🇬🇧 *ENGLISH:* _${enText}_\n`;
          quranCard += `─────────────────────────\n`;
      }

      // Smarter pagination hint
      if (endAyah < totalAyahsFound && searchType !== 'ayat') {
          let nextStart = endAyah + 1;
          let nextEnd = Math.min(endAyah + 5, totalAyahsFound);
          quranCard += `\n💡 *Next Track:* \`.quran ${args[0]} ${nextStart}-${nextEnd}_\n`;
      }

      await sock.sendMessage(from, { text: quranCard, edit: initialMsg.key });

    } catch (err) {
      console.error('Quran Engine Core Failure:', err.message);
      return sock.sendMessage(from, { text: "❌ *Engine Error:* ڈیٹا حاصل کرنے میں ناکامی۔ براہ کرم نام یا نمبر دوبارہ چیک کریں!" }, { quoted: msg });
    }
  }
};
  
