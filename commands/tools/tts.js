const axios = require('axios');

module.exports = {
  name: 'tts',
  category: 'tools',
  description: 'Text To Speech Format Fixed',
  usage: '.tts [your text]',

  async execute(sock, msg, args, extra) {
    const from = extra.from || msg.key.remoteJid;
    const text = args.join(' ');

    if (!text) {
      return extra.reply('Baraye meharbani text likhein!\n\n*Example:*\n.tts hello bro');
    }

    try {
      // Aap ki original API
      const url = `https://tts.fastdevelopers.workers.dev/tts?voice=nova&text=${encodeURIComponent(text)}`;
      
      const response = await axios.get(url, {
        responseType: 'arraybuffer'
      });

      // Buffer direct generate karein ge
      const audioBuffer = Buffer.from(response.data);

      // Format Fix: WhatsApp core ko bina conversion ke play karwane ke liye specs
      await sock.sendMessage(
        from,
        {
          audio: audioBuffer,
          mimetype: 'audio/mp4', // Khtambum/Baileys par voice note ke liye mp4 default handler behtareen hai
          ptt: true,
          fileName: 'tts.mp3' // Fake extension pass karne se WhatsApp auto-decode kar leta hai
        },
        { quoted: msg }
      );

    } catch (err) {
      console.error('TTS Format Error:', err.message);
      return extra.reply('❌ TTS Error: Format bypass nahi ho saka.');
    }
  }
};
    
