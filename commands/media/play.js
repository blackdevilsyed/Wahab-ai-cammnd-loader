const ytdl = require('@distube/ytdl-core');
const axios = require('axios');

module.exports = {
  name: 'play',
  aliases: ['song', 'music'],
  category: 'general',
  description: 'Search and play audio directly from YouTube',
  usage: '.play [song name]',

  async execute(sock, msg, args, extra) {
    const from = extra.from || msg.key.remoteJid;
    const songQuery = args.join(' ');

    if (!songQuery) {
        return sock.sendMessage(from, {
            text: "╭━━━〔 ⚠️ *MISSING INPUT* 〕━━━👉\n┃\n┃ ⚠️ *Error:* Song name missing!\n┃ 📝 *Format:* `.play [Song Name]`\n┃\n┃ 💡 *Example:* `.play tum hi ho`\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━━👉"
        }, { quoted: msg });
    }

    // SYED MD Music Search Message
    const initialMsg = await sock.sendMessage(from, { 
        text: `⚡ 💠 *S Y E D  M D  M U S I C* 💠 ⚡\n\n🔍 *Searching:* \`${songQuery}\`\n⏳ Please wait, fetching audio directly from YouTube...` 
    }, { quoted: msg });

    try {
      // YouTube search API to get the video ID/URL safely
      const searchUrl = `https://api.vreden.web.id/api/ytsearch?query=${encodeURIComponent(songQuery)}`;
      const searchResponse = await axios.get(searchUrl);
      
      if (!searchResponse.data || !searchResponse.data.result || searchResponse.data.result.length === 0) {
          return sock.sendMessage(from, { text: "❌ *Error:* Song not found. Try again with proper spelling!" }, { quoted: msg });
      }

      const videoData = searchResponse.data.result[0]; // Pehla result utha liya
      const videoUrl = videoData.url;

      // V.I.P UI Card
      let musicCard = `⚡ 📲  *S Y E D   M D   M U S I C*  📲 ⚡\n`;
      musicCard += `╔══════════════════════╗\n`;
      musicCard += `  🎵 *TITLE:* \`${videoData.title || 'Unknown'}\`\n`;
      musicCard += `  👤 *CHANNEL:* \`${videoData.author?.name || 'N/A'}\`\n`;
      musicCard += `  ⏱️ *DURATION:* \`${videoData.timestamp || 'N/A'}\`\n`;
      musicCard += `  🔗 *URL:* ${videoUrl}\n`;
      musicCard += `╚══════════════════════╝\n\n`;
      musicCard += `🎶 *Sending Audio... Stay tuned!*`;

      await sock.sendMessage(from, { text: musicCard, edit: initialMsg.key });

      // Direct High-Quality Audio Stream from YouTube (No FFmpeg required)
      const stream = ytdl(videoUrl, {
          filter: 'audioonly',
          quality: 'highestaudio',
          headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          }
      });

      const chunks = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      
      stream.on('end', async () => {
          const audioBuffer = Buffer.concat(chunks);

          // Sending Audio File safely
          await sock.sendMessage(
              from,
              {
                  audio: audioBuffer,
                  mimetype: 'audio/mpeg',
                  ptt: false
              },
              { quoted: msg }
          );
      });

      stream.on('error', (err) => {
          console.error('YTDL Stream Error:', err.message);
          sock.sendMessage(from, { text: "❌ *Stream Error:* Failed to process video stream." }, { quoted: msg });
      });

    } catch (err) {
      console.error('Play Command Error:', err.message);
      return sock.sendMessage(from, { text: "❌ *Server Error:* Unable to stream this song right now." }, { quoted: msg });
    }
  }
};
                                                                                           
