const fs = require('fs');
const path = require('path');
const config = require('../../config');

module.exports = {
  name: 'noprefix',
  aliases: ['withoutprefix', 'toggleprefix'],
  category: 'owner',
  ownerOnly: true,
  description: 'Enable or disable bot working without a prefix',
  usage: '.noprefix on/off/status',

  async execute(sock, msg, args, extra) {
    const filePath = path.join(__dirname, '../../data/noprefix.json');
    
    // Check current state from JSON
    let currentState = config.noprefix || false;
    try {
      if (fs.existsSync(filePath)) {
          currentState = JSON.parse(fs.readFileSync(filePath)).enabled;
      }
    } catch(e) {}

    if (!args[0]) {
      let textMenu = 
        `╭═✦〔 ⚙️ *ɴᴏ-ᴘʀᴇꜰɪx ᴍᴏᴅᴇ* 〕✦═╮\n│\n` +
        `│🚀 Status: *${currentState ? 'ON ✅' : 'OFF ❌'}*\n│\n` +
        `│ *ᴄᴏᴍᴍᴀɴᴅꜱ*\n` +
        `│ 🔹 \`.noprefix on\`  -> Bot works without prefix\n` +
        `│ 🔹 \`.noprefix off\` -> Bot requires prefix\n` +
        `│ 🔹 \`.noprefix status\` -> Check current status\n` +
        `╰═❀════════════❀═╯`;
      
      return extra.reply(textMenu);
    }

    const option = args[0].toLowerCase().trim();

    if (option === 'status') {
      return extra.reply(`🚀 No-Prefix Mode is currently: *${currentState ? 'ON ✅' : 'OFF ❌'}*`);
    }

    if (option === 'on') {
      fs.writeFileSync(filePath, JSON.stringify({ enabled: true }, null, 2));
      return extra.reply('✅ *No-Prefix Mode is ON!*\n\nUsers can now trigger commands without typing the prefix (e.g., just type `menu` instead of `.menu`).');
    }

    if (option === 'off') {
      fs.writeFileSync(filePath, JSON.stringify({ enabled: false }, null, 2));
      return extra.reply('❌ *No-Prefix Mode is OFF!*\n\nBot will strictly require the prefix to execute commands.');
    }

    return extra.reply('❌ Invalid option! Use `.noprefix on`, `.noprefix off`, or `.noprefix status`.');
  }
};
