const express = require('express');
const pino = require('pino');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const handler = require('./handler');

// =======================
// AUTO LOAD .ENV FILE
// =======================
if (fs.existsSync('./.env')) {
  const envConfig = fs.readFileSync('./.env', 'utf8').split('\n');
  envConfig.forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  });
}

// =========================================================================
// 🌐 SYED-MD LIVE MULTI-USER PAIRING CODE WEB SERVER (GLASSMORPHISM THEME)
// =========================================================================
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global reference socket کنکشن کو ویب سرور کے ساتھ بائنڈ کرنے کے لیے
let globalSock = null;

// 1. فرنٹ اینڈ ویب سائٹ کا انٹرفیس
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SYED-MD Multi-Device Pairing</title>
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { 
                background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); 
                color: #f8fafc; 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                min-height: 100vh;
                padding: 20px;
            }
            .container { 
                background: rgba(255, 255, 255, 0.03); 
                backdrop-filter: blur(12px); 
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.08);
                padding: 40px 30px; 
                border-radius: 20px; 
                width: 100%;
                max-width: 450px;
                text-align: center; 
                box-shadow: 0 20px 40px rgba(0,0,0,0.4); 
            }
            h1 { font-size: 28px; margin-bottom: 10px; font-weight: 800; letter-spacing: 2px; color: #38bdf8; }
            p { font-size: 14px; color: #94a3b8; margin-bottom: 25px; line-height: 1.5; }
            .input-group { position: relative; margin-bottom: 20px; }
            input { 
                width: 100%; 
                padding: 14px; 
                border-radius: 10px; 
                border: 1px solid rgba(255, 255, 255, 0.15); 
                background: rgba(15, 23, 42, 0.6); 
                color: #fff; 
                font-size: 16px; 
                text-align: center; 
                outline: none;
                transition: 0.3s;
            }
            input:focus { border-color: #38bdf8; box-shadow: 0 0 10px rgba(56, 189, 248, 0.2); }
            button { 
                background: linear-gradient(90deg, #2563eb, #3b82f6); 
                color: white; 
                border: none; 
                padding: 14px; 
                width: 100%;
                font-size: 16px; 
                font-weight: bold;
                border-radius: 10px; 
                cursor: pointer; 
                transition: 0.3s;
                box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
            }
            button:hover { background: linear-gradient(90deg, #1d4ed8, #2563eb); transform: translateY(-1px); }
            .footer { margin-top: 25px; font-size: 11px; color: #64748b; }
            .footer span { color: #38bdf8; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>⚡ S Y E D - M D ⚡</h1>
            <p>Enter your phone number with country code to link your bot instantly.</p>
            <form action="/pair" method="POST">
                <div class="input-group">
                    <input type="text" name="number" placeholder="e.g. 923001234567" required>
                </div>
                <button type="submit">Generate Pairing Code</button>
            </form>
            <div class="footer">Powered by <span>Syed Abdul Wahab Bukhari</span></div>
        </div>
    </body>
    </html>
    `);
});

// 2. لائیو پیئرنگ کوڈ ریکویسٹ پروسیسنگ ہینڈلر
app.post('/pair', async (req, res) => {
    let num = req.body.number.replace(/[^0-9]/g, '');
    if (!num) {
        return res.send(`
            <body style="background:#0f172a; color:#ef4444; font-family:sans-serif; text-align:center; padding-top:100px;">
                <h2>❌ Invalid Number! Please go back and write digits only.</h2>
                <br><a href="/" style="color:#38bdf8; text-decoration:none; font-weight:bold;">← Go Back</a>
            </body>
        `);
    }

    try {
        if (globalSock) {
            // واٹس ایپ سے لائیو پیئرنگ کوڈ کی ریکویسٹ
            let code = await globalSock.requestPairingCode(num);
            let formattedCode = code?.match(/.{1,4}/g)?.join('-') || code;

            res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Your Pairing Code - SYED-MD</title>
                <style>
                    body { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); color: #f8fafc; font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
                    .card { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); padding: 40px; border-radius: 20px; text-align: center; max-width: 450px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
                    h2 { color: #94a3b8; font-size: 18px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; }
                    .code-display { background: rgba(34, 197, 94, 0.1); border: 1px dashed #22c55e; color: #22c55e; font-size: 32px; font-weight: bold; padding: 15px 25px; border-radius: 10px; margin: 20px 0; letter-spacing: 3px; display: inline-block; }
                    p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 25px; }
                    a { color: #38bdf8; text-decoration: none; font-weight: bold; font-size: 15px; }
                    a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h2>Your Pairing Code Below:</h2>
                    <div class="code-display">${formattedCode}</div>
                    <p>Go to WhatsApp -> Linked Devices -> Link with Phone Number, and enter this specific code to start <b>SYED-MD</b>.</p>
                    <a href="/">← Link Another Number</a>
                </div>
            </body>
            </html>
            `);
        } else {
            res.send(`
                <body style="background:#0f172a; color:#eab308; font-family:sans-serif; text-align:center; padding-top:100px;">
                    <h2>⚠️ Engine Initializing! Bot is sleeping or starting up, please refresh after 10 seconds.</h2>
                    <br><a href="/" style="color:#38bdf8; text-decoration:none;">← Try Again</a>
                </body>
            `);
        }
    } catch (err) {
        console.error('Web UI Pairing Error:', err.message);
        res.send(`
            <body style="background:#0f172a; color:#ef4444; font-family:sans-serif; text-align:center; padding-top:100px;">
                <h2>❌ Error: ${err.message}</h2>
                <p style="color:#94a3b8;">If this number is already linked or active, logout first.</p>
                <br><a href="/" style="color:#38bdf8; text-decoration:none;">← Go Back</a>
            </body>
        `);
    }
});

// سرور کو لیسن موڈ پر لگانا
app.listen(PORT, () => {
    console.log(chalk.bold.green(`\n🌐 [WEB SERVER] SYED-MD UI Live on Port: ${PORT}`));
});
// =========================================================================

// =======================
// ERROR SUPPRESSION (LAG FIX)
// =======================
process.on('uncaughtException', (err) => {
    let e = String(err);
    if (e.includes('conflict') || e.includes('not-authorized') || e.includes('Socket connection timeout')) return;
    if (e.includes('Bad MAC') || e.includes('decrypt')) return;
});

process.on('unhandledRejection', (reason, promise) => {
    let r = String(reason);
    if (r.includes('Connection Closed') || r.includes('Rate Overlimit') || r.includes('Timed Out')) return;
});

const originalConsoleError = console.error;
console.error = (...args) => {
    const errorMsg = args.join(' ');
    const junkErrors = ['Bad MAC', 'Failed to decrypt', 'Session error', 'item-not-found', 'Connection reset by peer', 'ECONNRESET', 'socket hang up'];
    if (junkErrors.some(junk => errorMsg.includes(junk))) return; 
    originalConsoleError.apply(console, args);
};

// =======================
// MAIN BOT FUNCTION
// =======================
async function startBot() {
  const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
  
  const sessionFolder = `./${config.sessionName}`;
  const sessionFile = path.join(sessionFolder, 'creds.json');

  // 1. Session ID Decoding
  if (config.sessionID && config.sessionID.startsWith('ICONIC-MD~')) {
    if (!fs.existsSync(sessionFile)) {
      try {
        console.log(chalk.yellow('🔄 Loading Session ID...'));
        const b64data = config.sessionID.replace('ICONIC-MD~', '').trim();
        const decodedData = Buffer.from(b64data, 'base64').toString('utf-8');

        if (fs.existsSync(sessionFolder)) {
          fs.rmSync(sessionFolder, { recursive: true, force: true });
        }
        fs.mkdirSync(sessionFolder, { recursive: true });

        fs.writeFileSync(sessionFile, decodedData, 'utf8');
        console.log(chalk.green('✅ Session Decoded Successfully!'));
      } catch (e) {
        console.log(chalk.red('❌ Session Decode Error:', e.message));
      }
    }
  }

  const { state, saveCreds } = await useMultiFileAuthState(sessionFolder);
  const { version } = await fetchLatestBaileysVersion();

  // 2. Socket Initialization
  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: ['Ubuntu', 'Chrome', '20.0.04'],
    auth: state,
    syncFullHistory: false,
    generateHighQualityLinkPreview: false,
    getMessage: async () => undefined 
  });

  // 🔗 ساکٹ اب گلوبل ویریبل میں بائنڈ ہو گیا تاکہ ایکسپریس ویب سائٹ اسے استعمال کر سکے
  globalSock = sock;

  // 3. AUTO TERMINAL LOG FOR SERVER STATUS
  if (!sock.authState.creds.registered) {
      console.log(chalk.bold.green('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
      console.log(chalk.bold.yellow('🛠️  SYED-MD MULTI-USER WEB PORTAL READIED'));
      console.log(chalk.cyan('👉 Open your cloud server domain/URL link to generate codes live.'));
      console.log(chalk.bold.green('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
  }

  // =========================================================================
  // 🛡️ SYED-MD ADVANCED ANTI-CALL INTERCEPTOR (BYPASS INTELLIGENCE)
  // =========================================================================
  sock.ev.on('call', async (callEvents) => {
    const dataPath = path.join(__dirname, './allowed_callers.json');
    let allowedCallers = [];
    
    if (fs.existsSync(dataPath)) {
        try { allowedCallers = JSON.parse(fs.readFileSync(dataPath, 'utf-8')); } catch (e) { allowedCallers = []; }
    }

    for (const call of callEvents) {
        if (call.status === 'offer') {
            const callFrom = call.from; 
            const callId = call.id;

            if (allowedCallers.includes(callFrom)) {
                console.log(chalk.green(`[CALL ALLOWED] Whitelisted member is calling: ${callFrom}`));
                continue; 
            }

            console.log(chalk.red(`[CALL BLOCKED] Unauthorized call from: ${callFrom}`));
            try {
                await sock.rejectCall(callId, callFrom);
                
                const warningCard = `⚡ 📲 *S Y E D   M D   S E C U R I T Y* 📲 ⚡\n` +
                                    `╔═════════════════════════╗\n` +
                                    `  ⚠️ *CALL DETECTED & REJECTED!*\n` +
                                    `  👤 *FROM:* @${callFrom.split('@')[0]}\n` +
                                    `  🚫 *STATUS:* Unauthorized Device\n` +
                                    `╚═════════════════════════╝\n\n` +
                                    `💡 _Note: Calling this bot is restricted. Please chat via text only._`;

                await sock.sendMessage(callFrom, { text: warningCard, mentions: [callFrom] });
            } catch (err) {
                console.error('Anti-Call Injection Error:', err.message);
            }
        }
    }
  });

  // 4. Connection Events
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      if (statusCode === DisconnectReason.loggedOut) {
        console.log(chalk.red('❌ Session Expired ya Logged Out!'));
        if (fs.existsSync(sessionFolder)) {
          fs.rmSync(sessionFolder, { recursive: true, force: true });
        }
        console.log(chalk.yellow('🔄 Restarting bot to pair again...'));
        process.exit(1); 
      } else if (shouldReconnect) {
        console.log(chalk.yellow('⚠️ Disconnected. Reconnecting in 5 seconds...'));
        setTimeout(startBot, 5000);
      }
    }

    if (connection === 'open') {
      console.log(chalk.green('✅ SYED-MD Connected Successfully!'));

      const botNum = sock.user.id.split(':')[0];
      if (!config.ownerNumber.includes(botNum)) {
        config.ownerNumber.push(botNum);
        console.log(chalk.blue(`🔧 Bot number auto-added as owner: ${botNum}`));
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);

  // 5. Message Handler
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const msg of messages) {
      if (!msg.message) continue;
      handler.handleMessage(sock, msg).catch(() => {});
    }
  });

  return sock;
}

// =======================
// START BOT
// =======================
console.log(chalk.cyan('🚀 Starting SYED-MD Bot Framework...\n'));
startBot().catch(err => {
  console.log(chalk.red('Startup Error:', err));
});

// =======================
// 🧹 SILENT RAM CLEANER
// =======================
setInterval(() => {
  try {
    if (global.gc) global.gc();
  } catch {}
}, 30 * 60 * 1000);
