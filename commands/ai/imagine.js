const axios = require('axios');

module.exports = {
  name: 'imagine',
  aliases: ['img'],
  category: 'ai',
  description: 'Generate AI Images',

  async execute(sock, msg, args, extra) {
    const prompt = args.join(' ');

    if (!prompt) {
      return extra.reply(
        'Example:\n.imagine cute anime girl'
      );
    }

    try {
      await extra.reply('🎨 Generating image...');

      const { data } = await axios.get(
        `https://api.fastdevelopers.in/seaart?prompt=${encodeURIComponent(prompt)}`
      );

      if (!data.status || !data.images || !data.images.length) {
        return extra.reply('❌ Image generation failed.');
      }

      await sock.sendMessage(
        extra.from,
        {
          image: {
            url: data.images[0].url
          },
          caption: `🎨 Prompt: ${prompt}`
        },
        { quoted: msg }
      );

    } catch (err) {
      console.error('Imagine Error:', err.response?.data || err.message);
      return extra.reply('❌ Image generation failed.');
    }
  }
};
