const fs = require('fs');
const path = require('path');

const PERSONA_FILE = path.join(__dirname, '../../data/persona.json');

module.exports = {
  name: 'setprompt',
  aliases: ['setpersona', 'changeprompt'],
  description: 'AI ka system prompt/persona change karo',
  category: 'owner',
  ownerOnly: true,

  execute: async (sock, msg, args, { from, reply }) => {
    // ─── SHOW current prompt ───────────────────────────────────────────────
    if (!args.length || args[0].toLowerCase() === 'show') {
      try {
        const data = JSON.parse(fs.readFileSync(PERSONA_FILE, 'utf8'));
        return reply(
          `📋 *Current AI Prompt:*\n\n${data.prompt}\n\n` +
          `💡 Change karne ke liye:\n` +
          `\`.setprompt <naya prompt>\`\n\n` +
          `🔄 Default reset karne ke liye:\n` +
          `\`.setprompt reset\``
        );
      } catch {
        return reply('❌ Persona file nahi mili. Bot restart karo.');
      }
    }

    // ─── RESET to default ──────────────────────────────────────────────────
    if (args[0].toLowerCase() === 'reset') {
      const defaultPrompt =
        'You are SYED-AI, a friendly WhatsApp AI created by Syed Abdul Wahab Bukhari.\n\n' +
        'Rules:\n' +
        '- Reply in the user\'s language (English, Urdu, or Roman Urdu).\n' +
        '- Keep answers short, natural, and helpful.\n' +
        '- If asked who you are or who created you, say:\n' +
        '  "I am SYED-AI created by Syed Abdul Wahab Bukhari."\n' +
        '- Never claim to be human.\n' +
        '- Be respectful and honest.\n\n' +
        'User message:\n';

      fs.writeFileSync(PERSONA_FILE, JSON.stringify({ prompt: defaultPrompt }, null, 2), 'utf8');
      return reply('🔄 *AI prompt default par reset ho gaya!*');
    }

    // ─── SET new prompt ────────────────────────────────────────────────────
    const newPrompt = args.join(' ');

    if (newPrompt.length < 10) {
      return reply('❌ Prompt bohat chota hai. Kam se kam 10 characters likho.');
    }

    // Ensure "User message:" ending for clean separation
    const finalPrompt = newPrompt.endsWith('\n') ? newPrompt : newPrompt + '\n\nUser message:\n';

    try {
      fs.writeFileSync(PERSONA_FILE, JSON.stringify({ prompt: finalPrompt }, null, 2), 'utf8');
      return reply(
        `✅ *AI Prompt update ho gaya!*\n\n` +
        `📋 *Naya Prompt:*\n${finalPrompt}\n\n` +
        `💡 Check karne ke liye: \`.setprompt show\``
      );
    } catch (err) {
      console.error('setprompt error:', err);
      return reply('❌ Prompt save nahi hua. File permission check karo.');
    }
  }
};
        
