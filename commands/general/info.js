const axios = require('axios');

module.exports = {
  name: 'info',
  aliases: ['sim', 'siminfo'],
  category: 'tools',
  description: 'Fetch SIM information for Pakistan, India, and Brazil',
  usage: '.info [number with country code]',

  async execute(sock, msg, args, extra) {
    // extra.from یا msg.key.remoteJid میسج بھیجنے کے لیے استعمال ہوگا
    const from = extra.from || msg.key.remoteJid;

    if (!args[0]) {
        return sock.sendMessage(from, { 
            text: "Baraye meharbani number country code ke sath likhein!\n\n*Example:*\n.info 923034410077\n.info 918276093956\n.info 5513996666666" 
        }, { quoted: msg });
    }

    let cleanNumber = args[0].replace(/[^0-9]/g, ''); // Sirf numbers rakhein ge
    let apiUrl = '';
    let countryFlag = '';
    let countryName = '';

    // Country code check karne ki logic
    if (cleanNumber.startsWith('92')) {
        // Pakistan (Bina 92 ke 3xx wala number)
        let pakNum = cleanNumber.substring(2); 
        apiUrl = `https://public.codexdart.site/pak.php?num=${pakNum}`;
        countryFlag = '🇵🇰';
        countryName = 'Pakistan';
    } else if (cleanNumber.startsWith('91')) {
        // India (Bina 91 ke number)
        let indNum = cleanNumber.substring(2);
        apiUrl = `https://public.codexdart.site/ind.php?num=${indNum}`;
        countryFlag = '🇮🇳';
        countryName = 'India';
    } else if (cleanNumber.startsWith('55')) {
        // Brazil (Pura number country code ke sath)
        apiUrl = `https://public.codexdart.site/brazil.php?query=${cleanNumber}`;
        countryFlag = '🇧🇷';
        countryName = 'Brazil';
    } else {
        return sock.sendMessage(from, { 
            text: "Yeh country code supported nahi hai! Filhal sirf 92 (PK), 91 (IN) aur 55 (BR) available hain." 
        }, { quoted: msg });
    }

    try {
        // API ko hit marein ge
        const response = await axios.get(apiUrl);
        const data = response.data;

        // Agar data na mile ya empty object ho
        if (!data || Object.keys(data).length === 0) {
            return sock.sendMessage(from, { 
                text: "Koi data nahi mila ya yeh number record mein maujood nahi hai." 
            }, { quoted: msg });
        }

        // Output message formatting
        let output = `${countryFlag} *SIM INFO - ${countryName.toUpperCase()}* ${countryFlag}\n\n`;
        
        // Loop chala kar saara data auto format karein ge
        for (let key in data) {
            if (typeof data[key] === 'object') {
                output += `▪️ *${key.toUpperCase()}:* ${JSON.stringify(data[key])}\n`;
            } else {
                output += `▪️ *${key.toUpperCase()}:* ${data[key]}\n`;
            }
        }

        output += `\n-------------------------\n`;
        output += `👑 *DEVILPOER:* Syed Abdul Wahab Bukhari\n`;
        output += `📢 *CHANNEL:* https://whatsapp.com/channel/0029VbD1rlH5Ui2NwN6idF2v`;

        // Final message send karein ge
        await sock.sendMessage(from, { text: output }, { quoted: msg });

    } catch (error) {
        console.error(error);
        await sock.sendMessage(from, { 
            text: "Data fetch karne mein koi error aya hai. Ya to API down hai ya number format galat hai." 
        }, { quoted: msg });
    }
  }
};
                
