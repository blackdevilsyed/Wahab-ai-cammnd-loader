const { loadData, saveData } = require('../../utils/antideleteManager');

module.exports = {
  name: 'antidelete',
  category: 'owner',
  ownerOnly: true,
  description: 'Enable or disable anti delete',

  async execute(sock, msg, args, extra) {
    const data = loadData();

    if (!args[0]) {
      return extra.reply(
        `⚙️ *ANTI DELETE*\n\nStatus: ${data.enabled ? 'ON ✅' : 'OFF ❌'}\n\nUsage:\n.antidelete on\n.antidelete off`
      );
    }

    const option = args[0].toLowerCase();

    if (option === 'on') {
      data.enabled = true;
      saveData(data);
      return extra.reply('✅ AntiDelete Enabled');
    }

    if (option === 'off') {
      data.enabled = false;
      saveData(data);
      return extra.reply('❌ AntiDelete Disabled');
    }

    return extra.reply('❌ Invalid option! Use on or off.');
  }
};
