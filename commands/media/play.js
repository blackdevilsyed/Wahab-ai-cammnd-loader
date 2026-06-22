const axios = require('axios');

module.exports = {
  name: 'play',
  aliases: ['song', 'music'],
  category: 'media',
  description: 'Search and play audio from YouTube (Stable)',
  usage: '.play [song name]',

  async execute(sock, msg, args, extra) {
    const from = extra.from || msg.key.remoteJid;
    const songQuery = args.join(' ');

    if (!songQuery) {
        return sock.sendMessage(from, {
            text: "╭━━━〔 ⚠️ *MISSING INPUT* 〕━━━👉\n┃\n┃ ⚠️ *Error:* Song name missing!\n┃ 📝 *Format:* `.play [Song Name]`\n┃\n┃ 💡 *Example:* `.play tum hi ho`\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━━👉"
        }, { quoted: msg });
    }

    // Processing Message with SYED MD Branding
    const initialMsg = await sock.sendMessage(from, { 
        text: `⚡ 💠 *S Y E D  M D  M U S I C* 💠 ⚡\n\n🔍 *Searching:* \`${songQuery}\`\n⏳ Please wait, preparing high-quality audio...` 
    }, { quoted: msg });

    try {
      // Step 1: YouTube Search (Stable Network)
      const searchUrl = `https://api.vreden.web.id/api/ytsearch?query=${encodeURIComponent(songQuery)}`;
      const searchResponse = await axios.get(searchUrl);
      
      if (!searchResponse.data || !searchResponse.data.result || searchResponse.data.result.length === 0) {
          return sock.sendMessage(from, { text: "❌ *Error:* Song not found. Check spelling!" }, { quoted: msg });
      }

      const video = searchResponse.data.result[0];
      const videoUrl = video.url;

      // Step 2: High-Speed Direct Audio Downloader API
      const downloadUrl = `https://api.vreden.web.id/api/ytmp3?url=${encodeURIComponent(videoUrl)}`;
      const downloadResponse = await axios.get(downloadUrl);

      if (!downloadResponse.data || !downloadResponse.data.result || !downloadResponse.data.result.downloadUrl) {
          return sock.sendMessage(from, { text: "❌ *Error:* Server cannot extract audio right now. Try again!" }, { quoted: msg });
      }

      const audioLink = downloadResponse.data.result.downloadUrl;

      // V.I.P UI Card
      let musicCard = `⚡ 📲  *S Y E D   M D   M U S I C*  📲 ⚡\n`;
      musicCard += `╔══════════════════════╗\n`;
      musicCard += `  🎵 *TITLE:* \`${video.title || 'Unknown'}\`\n`;
      musicCard += `  👤 *CHANNEL:* \`${video.author?.name || 'N/A'}\`\n`;
      musicCard += `  ⏱️ *DURATION:* \`${video.timestamp || 'N/A'}\`\n`;
      musicCard += `  🔗 *URL:* ${videoUrl}\n`;
      musicCard += `╚══════════════════════╝\n\n`;
      musicCard += `🎶 *Sending Audio Track... Enjoy!*`;

      // Update Text Card
      await sock.sendMessage(from, { text: musicCard, edit: initialMsg.key });

      // Step 3: Fetch Audio Buffer from Global CDN
      const audioResponse = await axios.get(audioLink, { responseType: 'arraybuffer' });
      const audioBuffer = Buffer.from(audioResponse.data);

      // Final Audio message without PTT (Best for long songs)
      await sock.sendMessage(
        from,
        {
          audio: audioBuffer,
          mimetype: 'audio/mpeg',
          ptt: false
        },
        { quoted: msg }
      );

    } catch (err) {
      console.error('Play Global Command Error:', err.message);
      return sock.sendMessage(from, { text: "❌ *Server Error:* Global downloaders are rate-limited. Try again later." }, { quoted: msg });
    }
  }
};
    
