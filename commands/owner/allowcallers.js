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

    // JSON فائل کا پاتھ سیٹ کریں جہاں ڈیٹا سیو ہوگا
    const dataPath = path.join(__dirname, '../../allowed_callers.json'); 

    // ہیلپر فنکشنز: ڈیٹا ریڈ اور رائٹ کرنے کے لیے
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
        // نمبر سے ہر قسم کے فالتو کریکٹرز یا پلس کا سائن صاف کریں
        let inputNum = args.slice(1).join('').replace(/[^0-9]/g, '');
        
        if (!inputNum) {
            return sock.sendMessage(from, { text: "⚠️ *Format Check:* \`.allowcallers add 923151105391\`" }, { quoted: msg });
        }

        // واٹس ایپ کا آفیشل فارمیٹ (JID) بنائیں
        let fullJid = inputNum + '@s.whatsapp.net';
        let currentList = getAllowedNumbers();

        if (currentList.includes(fullJid)) {
            return sock.sendMessage(from, { text: `ℹ️ یہ نمبر پہلے سے ہی الاؤ لسٹ میں موجود ہے۔` }, { quoted: msg });
        }

        try {
            currentList.push(fullJid);
            saveAllowedNumbers(currentList); // ڈیٹا بیس میں سیو
            
            return sock.sendMessage(from, { 
                text: `✅ *Success:* @${inputNum} کو اینٹی کال بائی پاس لسٹ میں ایڈ کر دیا گیا ہے!`,
                mentions: [fullJid]
            }, { quoted: msg });
        } catch (err) {
            console.error(err);
            return sock.sendMessage(from, { text: "❌ Failed to save number to JSON file." }, { quoted: msg });
        }
    }

    // لسٹ دیکھنے کے لیے آپشن
    if (action === 'list') {
        const currentList = getAllowedNumbers();
        if (currentList.length === 0) return sock.sendMessage(from, { text: "ℹ️ لسٹ خالی ہے۔ سب بلاک ہوں گے۔" }, { quoted: msg });

        let listMsg = `⚡ 📲 *A L L O W E D   C A L L E R S* 📲 ⚡\n\n`;
        currentList.forEach((num, index) => {
            listMsg += `${index + 1}. @${num.split('@')[0]}\n`;
        });
        return sock.sendMessage(from, { text: listMsg, mentions: currentList }, { quoted: msg });
    }

    return sock.sendMessage(from, { text: "💡 *Usage:* \`.allowcallers add 923151105391\` ya \`.allowcallers list\`" }, { quoted: msg });
  }
};
      
