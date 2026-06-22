const axios = require('axios');

module.exports = {
  name: 'tts',
  category: 'tools',
  description: 'Text To Speech (Bypass Format Error)',
  usage: '.tts [your text]',

  async execute(sock, msg, args, extra) {
    const from = extra.from || msg.key.remoteJid;
    const text = args.join(' ');

    if (!text) {
      return extra.reply('Baraye meharbani text likhein!\n\n*Example:*\n.tts hello bro');
    }

    try {
      const url = `https://tts.fastdevelopers.workers.dev/tts?voice=nova&text=${encodeURIComponent(text)}`;
      
      const response = await axios.get(url, {
        responseType: 'arraybuffer'
      });

      const audioBuffer = Buffer.from(response.data);

      // Hack: ptt ko false kar diya aur mimetype ko standard mp3 rakha
      // Is se audio click karne par direct play ho jaye gi bina error diye
      await sock.sendMessage(
        from,
        {
          audio: audioBuffer,
          mimetype: 'audio/mpeg', 
          ptt: false // Voice note ke bajaye audio track bana kar bhejein ge
        },
        { quoted: msg }
      );

    } catch (err) {
      console.error('TTS Bypass Error:', err.message);
      return extra.reply('❌ TTS Error: Server storage format block.');
    }
  }
};
          
