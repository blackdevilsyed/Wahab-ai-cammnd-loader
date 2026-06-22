


const axios = require("axios");
const config = require('../../config');

module.exports = {
  name: 'tiktok',
  aliases: ['tt', 'ttdl'],
  category: 'media',
  description: 'Download TikTok Video',
  usage: '.tiktok <url>',

  async execute(sock, msg, args, extra) {
    const url = Array.isArray(args) ? args.join(" ") : String(args || '');
    
    if (!url || !url.includes('tiktok.com')) {
      return extra.reply(`❌ *Invalid Link!*\nPlease provide a valid TikTok URL.`);
    }

    try {
      await sock.sendMessage(extra.from, { react: { text: '⏳', key: msg.key } });
      
      const waitMsg = await sock.sendMessage(extra.from, { text: "⏳ *Processing TikTok video...*" }, { quoted: msg });

      const apiUrl = `https://api.nexray.eu.cc/downloader/tiktok?url=${encodeURIComponent(url)}`;
      const { data } = await axios.get(apiUrl, { timeout: 20000 });

      if (!data.status || !data.result) {
        throw new Error("API returned failure status.");
      }

      const res = data.result;
      const videoUrl = res.data; 

      if (!videoUrl) {
        return await sock.sendMessage(extra.from, { 
            text: "❌ *Video not found!* The link might be broken or private.", 
            edit: waitMsg.key 
        });
      }

      await sock.sendMessage(extra.from, { 
          text: `✅ *Video Found!* Uploading...`, 
          edit: waitMsg.key 
      });

      const botName = config.botName?.toUpperCase() || 'QADEER-AI';
      
      let vidOpt = {
        video: { url: videoUrl },
        caption: `🎵 *TIKTOK DOWNLOADER*\n\n📝 *Title:* ${res.title || "TikTok Video"}\n👁️ *Views:* ${res.stats?.views || 'N/A'}\n💖 *Likes:* ${res.stats?.likes || 'N/A'}\n\n> *© POWERED BY ${botName}*`
      };

      await sock.sendMessage(extra.from, vidOpt, { quoted: msg });
      await sock.sendMessage(extra.from, { react: { text: '✅', key: msg.key } });

    } catch (error) {
      console.error("TikTok Scraper Error:", error);
      await sock.sendMessage(extra.from, { react: { text: '❌', key: msg.key } });
      await sock.sendMessage(extra.from, { text: `❌ *Critical Error:* Could not fetch video.` });
    }
  }
};
