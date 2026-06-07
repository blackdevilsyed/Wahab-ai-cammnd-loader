const config = require('../../config');
const fs = require('fs');
const path = require('path');

// Realtime config file update karne ka function
function updateConfigPrefix(value) {
  try {
    const configPath = path.join(__dirname, '../../config.js');
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    // Regex jo prefix: '.' ya prefix: "any" ko match karke naye value se replace karega
    const regex = /(prefix:\s*['"`])([^'"`]+)(['"`])/g;
    configContent = configContent.replace(regex, "$1" + value + "$3");
    
    fs.writeFileSync(configPath, configContent, 'utf8');
    
    // Require cache clear karna taake realtime load ho sake
    delete require.cache[require.resolve('../../config')];
  } catch (error) {
    console.error('Error saving new prefix to config:', error);
  }
}

module.exports = {
  name: 'setprefix',
  aliases: ['changeprefix', 'prefix'],
  category: 'owner',
  ownerOnly: true,
  description: 'Change the bot prefix in realtime',
  
  async execute(sock, msg, args, extra) {
    const newPrefix = args[0];
    
    if (!newPrefix) {
      const usageLines = [];
      usageLines.push("⚙️ *Bot Prefix Settings*");
      usageLines.push("");
      usageLines.push("Current Prefix: *" + config.prefix + "*");
      usageLines.push("");
      usageLines.push("📌 *Usage:*");
      usageLines.push("  .setprefix <new_prefix>");
      usageLines.push("");
      usageLines.push("📌 *Example:*");
      usageLines.push("  .setprefix !");
      usageLines.push("  .setprefix .");
      
      return extra.reply(usageLines.join('\n'));
    }

    if (newPrefix.length > 3) {
      return extra.reply("❌ Prefix too long! Please keep it under 3 characters.");
    }

    try {
      // Realtime file mein save karo aur variable update karo
      updateConfigPrefix(newPrefix);
      config.prefix = newPrefix;

      const successLines = [];
      successLines.push("✅ *Prefix Updated Successfully!*");
      successLines.push("");
      successLines.push("New Prefix: *" + newPrefix + "*");
      successLines.push("Now you can use commands like: *" + newPrefix + "menu*");
      
      return extra.reply(successLines.join('\n'));

    } catch (err) {
      console.error('Setprefix command error:', err);
      return extra.reply("❌ Failed to change prefix: " + err.message);
    }
  }
};
        
