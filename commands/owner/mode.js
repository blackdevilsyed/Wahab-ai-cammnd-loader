const config = require('../../config');
const fs = require('fs');
const path = require('path');

function updateConfig(key, value) {
  try {
    const configPath = path.join(__dirname, '../../config.js');
    let configContent = fs.readFileSync(configPath, 'utf8');
    const regex = new RegExp(`(${key}:\\s*)(true|false)`, 'g');
    configContent = configContent.replace(regex, `$1${value}`);
    fs.writeFileSync(configPath, configContent, 'utf8');
    delete require.cache[require.resolve('../../config')];
  } catch (error) {
    console.error('Error saving config:', error);
  }
}

module.exports = {
  name: 'mode',
  aliases: ['botmode', 'privatemode', 'publicmode'],
  category: 'owner',
  ownerOnly: true,
  description: 'Toggle bot between private and public mode',
  
  async execute(sock, msg, args, extra) {
    if (!args[0]) {
      return extra.reply(`🤖 *Bot Mode*\n\nCurrent Mode: *${config.selfMode ? 'PRIVATE' : 'PUBLIC'}*\n\nUsage:\n  .mode private\n  .mode public`);
    }
    
    const mode = args[0].toLowerCase();
    
    if (mode === 'private' || mode === 'priv') {
      updateConfig('selfMode', true);
      config.selfMode = true;
      return extra.reply('🔒 Bot mode changed to *PRIVATE*\nOnly owner can use commands now.');
    }
    
    if (mode === 'public' || mode === 'pub') {
      updateConfig('selfMode', false);
      config.selfMode = false;
      return extra.reply('🌐 Bot mode changed to *PUBLIC*\nEveryone can use commands now.');
    }
    
    return extra.reply('❌ Invalid mode! Usage: .mode <private/public>');
  }
};
  
