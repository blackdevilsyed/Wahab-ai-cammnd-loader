const axios = require('axios');

module.exports = {
  name: 'play',
  aliases: ['song', 'audio', 'ytmp3'],
  category: 'general',
  description: 'YouTube se audio play karein (Cloud API Version)',
  usage: '.play surah rehman',

  async execute(sock, msg, args, extra) {
    const from = extra.from || msg.key.remoteJid;
    
    if (!args[0]) {
      return extra.reply('🎵 *Sahi Tariqa:* \`.play surah rehman\`\n\nBatao bhai konsa audio sunna hai?');
    }

    const searchQuery = args.join(' ');
    
    try {
      await extra.reply(`🔍 *Searching:* \`"${searchQuery}"\`\n⚡ YouTube se audio fetch kiya ja raha hai, thoda sabar karein...`);

      // High-speed API for cloud hosting
      const apiUrl = `https://api.nexray.eu.cc/download/ytmp3?search=${encodeURIComponent(searchQuery)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.status && response.data.result) {
        const audioData = response.data.result;
        const audioUrl = audioData.downloadUrl || audioData.url;
        const title = audioData.title || 'Audio File';
        const duration = audioData.duration || 'Unknown';

        // Info Card
        let details = `🎧 *S Y E D  -  M D  P L A Y E R*\n\n`;
        details += `📌 *Title:* ${title}\n`;
        details += `⏱️ *Duration:* ${duration}\n\n`;
        details += `🚀 *Sending Audio...*`;
        await sock.sendMessage(from, { text: details }, { quoted: msg });

        // Audio Send
        await sock.sendMessage(from, {
          audio: { url: audioUrl },
          mimetype: 'audio/mp4',
          ptt: false
        }, { quoted: msg });

      } else {
        return extra.reply('❌ Sorry bhai! YouTube par yeh cheez nahi mili ya server down hai. Kuch der baad try karein.');
      }

    } catch (err) {
      console.error('Play Command Error:', err.message);
      return extra.reply('❌ *Error:* Audio download karne me masla aaya hai. Thodi der baad try karein.');
    }
  }
};
            
