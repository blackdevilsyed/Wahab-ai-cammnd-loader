const axios = require('axios');

module.exports = {
  name: 'hadith',
  aliases: ['hadees', 'bukhari', 'muslim', 'termizi'],
  category: 'religious',
  description: 'Sahi Bukhari, Muslim, aur deegar kootab se hadees talash karein (Arabic, Urdu, English)',
  usage: '.hadith bukhari 1',

  async execute(sock, msg, args, extra) {
    const from = extra.from || msg.key.remoteJid;

    // Sahi tariqa samjhane ke liye menu
    if (!args[0] || !args[1]) {
      let helpMsg = `📖 *M A R C O  -  M D  H A D I T H*\n\n`;
      helpMsg += `Hadith check karne ka sahi tariqa:\n`;
      helpMsg += `🔹 \`.hadith bukhari 1\` (Sahi Bukhari Hadees No. 1)\n`;
      helpMsg += `🔹 \`.hadith muslim 45\` (Sahi Muslim Hadees No. 45)\n`;
      helpMsg += `🔹 \`.hadith tirmidhi 102\` (Jami Tirmidhi Hadees No. 102)\n\n`;
      helpMsg += `*Available Books:* bukhari, muslim, tirmidhi, abudawood, ibnmajah, nasai`;
      
      return extra.reply(helpMsg);
    }

    let book = args[0].toLowerCase().trim();
    let hadithNumber = args[1].trim();

    // Book names mapping for API
    const bookMapping = {
      'bukhari': 'bukhari',
      'sahibukhari': 'bukhari',
      'muslim': 'muslim',
      'sahimuslim': 'muslim',
      'tirmidhi': 'tirmidhi',
      'termizi': 'tirmidhi',
      'abudawood': 'abudawood',
      'ibnmajah': 'ibnmajah',
      'nasai': 'nasai'
    };

    let apiBook = bookMapping[book];

    if (!apiBook) {
      return extra.reply('❌ Yeh kitab maujood nahi hai. Type sirf: *bukhari, muslim, tirmidhi, abudawood, ibnmajah, nasai*');
    }

    try {
      await extra.reply(`🔍 *Searching:* \`${apiBook.toUpperCase()} Hadees No. ${hadithNumber}\`...\n⚡ Fetching Arabic, Urdu & English translations.`);

      // Public Islamic API for Hadiths
      const apiUrl = `https://hadithapi.com/api/hadiths?api_key=$2y$10$N76fRWhf2p70ZOfwXzLpbeZ9bKx4S8SIsdDBytMWhG6fWreE0bZ2&book=${apiBook}&hadithNumber=${hadithNumber}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.hadiths && response.data.hadiths.data.length > 0) {
        const hadithData = response.data.hadiths.data[0];
        
        let arabicText = hadithData.hadithArabic || '';
        let urduText = hadithData.hadithUrdu || '';
        let englishText = hadithData.hadithEnglish || '';
        
        let chapterUrdu = hadithData.chapter ? hadithData.chapter.chapterUrdu : 'Unknown';
        let chapterEnglish = hadithData.chapter ? hadithData.chapter.chapterEnglish : 'Unknown';
        let status = hadithData.status || 'Valid';

        // Premium Grid Formatting for WhatsApp
        let finalResponse = `📜 *H A D I T H  -  I N F O*\n`;
        finalResponse += `📋 *Book:* ${apiBook.toUpperCase()} | *No:* ${hadithNumber}\n`;
        finalResponse += `✨ *Status:* ${status}\n`;
        finalResponse += `────────────────────\n\n`;
        
        // 1. ARABIC
        if (arabicText) {
          finalResponse += `🟢 *Arabic:* \n_${arabicText}_\n\n`;
          finalResponse += `────────────────────\n\n`;
        }
        
        // 2. URDU
        if (urduText) {
          finalResponse += `🇵🇰 *Urdu Translation:* \n*🗂️ Baab:* ${chapterUrdu}\n\n*${urduText}*\n\n`;
          finalResponse += `────────────────────\n\n`;
        }
        
        // 3. ENGLISH
        if (englishText) {
          finalResponse += `🇬🇧 *English Translation:* \n*🗂️ Chapter:* ${chapterEnglish}\n\n_${englishText}_\n\n`;
          finalResponse += `────────────────────\n`;
        }
        
        finalResponse += `Powered by *Marco Malik*`;

        return await sock.sendMessage(from, { text: finalResponse }, { quoted: msg });

      } else {
        return extra.reply(`❌ Sorry bhai, \`${apiBook.toUpperCase()}\` me Hadees number \`${hadithNumber}\` nahi mili.`);
      }

    } catch (err) {
      console.error('Hadith Command Error:', err.message);
      return extra.reply('❌ *Error:* Database se connect karne me masla aa raha hai. Dubara try karein.');
    }
  }
};
                
