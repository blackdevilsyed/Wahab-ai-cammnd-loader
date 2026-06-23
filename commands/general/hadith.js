module.exports = {
  name: 'hadith',
  aliases: ['hadees', 'bukhari', 'muslim'],
  category: 'general',
  description: '100% Offline Bug-Free Hadith Command',
  usage: '.hadith bukhari 1',

  async execute(sock, msg, args, extra) {
    const from = extra.from || msg.key.remoteJid;

    if (!args[0] || !args[1]) {
      let helpMsg = `📖 *S Y E D  -  M D  H A D I T H*\n\n`;
      helpMsg += `Hadith check karne ka sahi tariqa:\n`;
      helpMsg += `🔹 \`.hadith bukhari 1\` (Try 1 se 5 tak)\n`;
      helpMsg += `🔹 \`.hadith muslim 1\` (Try 1 se 5 tak)\n\n`;
      helpMsg += `*Note:* By Syed Abdul Wahab Bukhari`;
      return extra.reply(helpMsg);
    }

    let book = args[0].toLowerCase().trim();
    let hadithNumber = args[1].trim();

    // 100% Local Database inside code (No API, No Internet required)
    const localHadithDB = {
      bukhari: {
        '1': {
          arabic: "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى",
          urdu: "Aamal ka daromadar niyyat par hai, aur har insan ko wahi milega jiski usne niyyat ki.",
          english: "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended."
        },
        '2': {
          arabic: "بني الإسلام على خمس",
          urdu: "Islam ki bunyad panch sutoonon par rakhi gai hai.",
          english: "Islam is based on five principles."
        },
        '3': {
          arabic: "المسلم من سلم المسلمون من لسانه ويده",
          urdu: "Musalman woh hai jiski zaban aur hath se doosre Musalman mehfooz rahein.",
          english: "A Muslim is the one from whose tongue and hands other Muslims are safe."
        },
        '4': {
          arabic: "لا يؤمن أحدكم hasta يحب لأخيه ما يحب لنفسه",
          urdu: "Tum mein se koi us waqt tak momin nahi ho sakta jab tak apne bhai ke liye woh pasand na kare jo apne liye karta hai.",
          english: "None of you will have faith till he wishes for his brother what he likes for himself."
        },
        '5': {
          arabic: "الدين النصيحة",
          urdu: "Deen khair khwahi ka naam hai.",
          english: "Religion is sincerity and well-wishing."
        }
      },
      muslim: {
        '1': {
          arabic: "الطهور شطر الإيمان",
          urdu: "Pakeezgi (Safai) iman ka hissa hai.",
          english: "Purity is half of faith."
        },
        '2': {
          arabic: "الدنيا سجن المؤمن وجنة الكافر",
          urdu: "Duniya momin ke liye qaid khana aur kafir ke liye jannat hai.",
          english: "The world is a prison for the believer and a paradise for the disbeliever."
        },
        '3': {
          arabic: "من لا يرحم لا يرحم",
          urdu: "Jo reham nahi karta, us par reham nahi kiya jata.",
          english: "He who is not merciful to others will not be shown mercy."
        },
        '4': {
          arabic: "خيركم من تعلم القرآن وعلمه",
          urdu: "Tum mein se behtareen woh hai jo Quran seekhe aur doosron ko sikhaye.",
          english: "The best among you are those who learn the Quran and teach it."
        },
        '5': {
          arabic: "اتق الله حيثما كنت",
          urdu: "Tum jahan bhi raho Allah se daro.",
          english: "Fear Allah wherever you may be."
        }
      }
    };

    if (!localHadithDB[book]) {
      return extra.reply('❌ Abhi offline mode me sirf *bukhari* aur *muslim* available hain.');
    }

    const hadith = localHadithDB[book][hadithNumber];

    if (!hadith) {
      return extra.reply(`❌ Offline database me abhi yeh number nahi hai. Please \`1\` se \`5\` tak check karein.`);
    }

    // Beautiful Formatting
    let finalResponse = `📜 *H A D I T H  -  I N F O*\n`;
    finalResponse += `📋 *Book:* ${book.toUpperCase()} | *No:* ${hadithNumber}\n`;
    finalResponse += `────────────────────\n\n`;
    finalResponse += `🟢 *Arabic:* \n_${hadith.arabic}_\n\n`;
    finalResponse += `────────────────────\n\n`;
    finalResponse += `🇵🇰 *Urdu Translation:* \n*${hadith.urdu}*\n\n`;
    finalResponse += `────────────────────\n\n`;
    finalResponse += `🇬🇧 *English Translation:* \n_${hadith.english}_\n\n`;
    finalResponse += `────────────────────\n`;
    finalResponse += `Powered by *Syed Abdul Wahab Bukhari*`;

    return await sock.sendMessage(from, { text: finalResponse }, { quoted: msg });
  }
};
        
