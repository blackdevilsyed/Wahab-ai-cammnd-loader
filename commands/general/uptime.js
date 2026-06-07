module.exports = {
  name: 'uptime',
  aliases: ['runtime'],
  category: 'general',
  description: 'Check how long the bot has been running',
  usage: '.uptime',

  async execute(sock, msg, args, extra) {
    try {
      const seconds = process.uptime();
      
      const d = Math.floor(seconds / (3600 * 24));
      const h = Math.floor((seconds % (3600 * 24)) / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor(seconds % 60);

      const dDisplay = d > 0 ? `${d}d ` : "";
      const hDisplay = h > 0 ? `${h}h ` : "";
      const mDisplay = m > 0 ? `${m}m ` : "";
      const sDisplay = s > 0 ? `${s}s` : "";

      const uptimeString = `🤖 *Bot Uptime:* ${dDisplay}${hDisplay}${mDisplay}${sDisplay}`.trim();

      await sock.sendMessage(extra.from, { text: uptimeString }, { quoted: msg });
    } catch (error) {
      await extra.reply(`❌ *Failed to get uptime!*\n${error.message}`);
    }
  }
};
