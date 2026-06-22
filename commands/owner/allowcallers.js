const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'allowcallers',
  category: 'owner',
  ownerOnly: true,
  description: 'Add numbers to anti-call bypass list',

  async execute(sock, msg, args, extra) {
    const from = extra.from || msg.key.remoteJid;
    const action = args[0] ? args[0].toLowerCase() : '';

    // JSON file ka path jahan data save hoga
    const dataPath = path.join(__dirname, '../../allowed_callers.json'); 

    // Helper functions for reading and writing data
    const getAllowedNumbers = () => {
        if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify([]));
        try {
            return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        } catch (e) {
            return [];
        }
    };
    const saveAllowedNumbers = (data) => fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    if (action === 'add' || action === 'allow') {
        // Number se saare extra characters aur plus sign saaf karein
        let inputNum = args.slice(1).join('').replace(/[^0-9]/g, '');
        
        if (!inputNum) {
            return sock.sendMessage(from, { text: "⚠️ *Format Check:* \`.allowcallers add 923151105391\`" }, { quoted: msg });
        }

        // WhatsApp ka official JID format
        let fullJid = inputNum + '@s.whatsapp.net';
        let currentList = getAllowedNumbers();

        if (currentList.includes(fullJid)) {
            return sock.sendMessage(from, { text: `ℹ️ Yeh number pehle se hi allowed list me maujood hai.` }, { quoted: msg });
        }

        try {
            currentList.push(fullJid);
            saveAllowedNumbers(currentList); // Save to JSON file
            
            return sock.sendMessage(from, { 
                text: `✅ *Success:* @${inputNum} ko anti-call bypass list me add kar diya gaya hai! Ab yeh call kar sakte hain.`,
                mentions: [fullJid]
            }, { quoted: msg });
        } catch (err) {
            console.error(err);
            return sock.sendMessage(from, { text: "❌ Failed to save number to JSON file." }, { quoted: msg });
        }
    }

    // List check karne ke liye option
    if (action === 'list') {
        const currentList = getAllowedNumbers();
        if (currentList.length === 0) return sock.sendMessage(from, { text: "ℹ️ Allowed callers ki list khali hai. Sabhi calls block hongi." }, { quoted: msg });

        let listMsg = `⚡ 📲 *A L L O W E D   C A L L E R S* 📲 ⚡\n\n`;
        currentList.forEach((num, index) => {
            listMsg += `${index + 1}. @${num.split('@')[0]}\n`;
        });
        return sock.sendMessage(from, { text: listMsg, mentions: currentList }, { quoted: msg });
    }

    return sock.sendMessage(from, { text: "💡 *Usage:* \`.allowcallers add 923151105391\` ya \`.allowcallers list\`" }, { quoted: msg });
  }
};
      
