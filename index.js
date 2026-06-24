/* ================================================================
   🚀 SYED-MD CHATBOT ENGINE (PRO VERSION - FULL COMPLETED)
   🛡️ ULTRA ANTI-BAN INTEGRATION & GLASSMORPHISM UI UPGRADE
   🧹 AUTO RAM CLEANER & AUTO WELCOME DM SYSTEM
   ⚡ Powered by Syed Abdul Wahab Bukhari (Marco Malik)
   ================================================================
*/

const express = require('express');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    delay,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');

const app = express();
const PORT = process.env.PORT || 8080;

// Application Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global Socket Reference
let globalSock = null;

// =========================================================================
// 🎨 PREMIUM GLASSMORPHISM PORTAL (HTML + TAILWIND CSS)
// =========================================================================
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SYED-MD CORE ENGINE</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;800&family=Poppins:wght@300;400;600&display=swap');
            body {
                background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%);
                position: relative;
                overflow-x: hidden;
                font-family: 'Poppins', sans-serif;
            }
            body::before {
                content: "";
                position: absolute;
                inset: 0;
                background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), 
                                  linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
                background-size: 30px 30px;
                z-index: 0;
                pointer-events: none;
            }
            .glass-panel {
                background: rgba(15, 23, 42, 0.45);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.08);
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            }
            .glow-text {
                text-shadow: 0 0 15px rgba(56, 189, 248, 0.5);
            }
            .brand-glow {
                text-shadow: 0 0 10px rgba(192, 132, 252, 0.4);
            }
        </style>
    </head>
    <body class="min-h-screen flex items-center justify-center p-4 antialiased text-slate-100">
        <div class="glass-panel w-full max-w-md rounded-2xl p-8 z-10 text-center transition-all duration-300 hover:border-purple-500/20">
            
            <div class="mb-6">
                <div class="w-16 h-16 mx-auto bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 mb-3">
                    <span class="text-2xl font-black text-white tracking-widest" style="font-family: 'Orbitron';">S-MD</span>
                </div>
                <h1 class="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 glow-text" style="font-family: 'Orbitron';">SYED-MD CORE ENGINE</h1>
                <p class="text-xs text-slate-400 mt-1">Next-Gen WhatsApp Automation Sandbox</p>
            </div>

            <div id="formZone" class="space-y-4">
                <div class="text-left">
                    <label class="block text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2">Enter WhatsApp Number</label>
                    <input type="text" id="numberInput" placeholder="e.g. 923001234567" 
                           class="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors placeholder:text-slate-600 font-mono text-center tracking-widest text-white">
                </div>
                
                <button onclick="getPairingCode()" id="submitBtn"
                        class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm py-3 px-4 rounded-xl transition-all duration-200 transform active:scale-[0.98] shadow-md shadow-blue-900/40">
                    Generate Pairing Code
                </button>
            </div>

            <div id="codeZone" class="hidden mt-6 pt-6 border-t border-slate-800/60 animate-fade-in">
                <p class="text-xs text-slate-400 mb-3" id="statusTag">Connected Status: <span class="text-yellow-400 font-bold">Pending Pairing...</span></p>
                <div class="bg-slate-950/80 border border-purple-500/30 rounded-xl py-4 font-mono text-2xl font-black tracking-widest text-emerald-400 glow-text shadow-inner shadow-black" id="codeDisplay">
                    ---- ----
                </div>
                <p class="text-[11px] text-slate-500 mt-3 px-2">Copy this code, open WhatsApp -> Linked Devices -> Link with Phone Number, and enter it.</p>
                <button onclick="resetForm()" class="mt-4 text-xs text-slate-400 hover:text-purple-400 transition-colors underline underline-offset-4">Use Another Number</button>
            </div>

            <div class="mt-8 pt-4 border-t border-slate-900/40 text-[11px] text-slate-500 tracking-wide">
                ⚡ Powered by <span class="font-bold text-purple-400 brand-glow" style="font-family: 'Orbitron';">Syed Abdul Wahab Bukhari</span>
            </div>
        </div>

        <script>
            async function getPairingCode() {
                const numInput = document.getElementById('numberInput');
                let num = numInput.value.replace(/[^0-9]/g, '');
                
                if(!num || num.length < 10) {
                    return alert('Please enter a valid phone number with country code (Digits Only)!');
                }
                
                const btn = document.getElementById('submitBtn');
                const codeZone = document.getElementById('codeZone');
                const codeDisplay = document.getElementById('codeDisplay');
                
                btn.innerText = 'Initializing Secure Session...';
                btn.disabled = true;

                try {
                    const response = await fetch('/api/pair?number=' + num);
                    const data = await response.json();
                    
                    if(data.code) {
                        codeDisplay.innerText = data.code;
                        codeZone.classList.remove('hidden');
                        btn.innerText = 'Code Generated!';
                    } else {
                        alert(data.error || 'Failed to generate code.');
                        resetForm();
                    }
                } catch(err) {
                    alert('Server connection error. Check your deployment logs.');
                    resetForm();
                }
            }

            function resetForm() {
                document.getElementById('numberInput').value = '';
                document.getElementById('codeZone').classList.add('hidden');
                const btn = document.getElementById('submitBtn');
                btn.innerText = 'Generate Pairing Code';
                btn.disabled = false;
            }
        </script>
    </body>
    </html>
    `);
});

// =========================================================================
// 🛡️ SECURE ISOLATION PAIRING API ROUTE (ANTI-BAN MECHANISM)
// =========================================================================
app.get('/api/pair', async (req, res) => {
    let num = req.query.number;
    if (!num) return res.json({ error: "Number parameter is required." });
    num = num.replace(/[^0-9]/g, '');

    // Har user ka alag data folder banega taake main bot crash na ho
    const tempAuthFolder = path.join(__dirname, `./temp_auth_${num}`);
    
    try {
        const { state, saveCreds } = await useMultiFileAuthState(tempAuthFolder);
        const { version } = await fetchLatestBaileysVersion();
        
        const tempSock = makeWASocket({
            version,
            auth: state,
            printQRInTerminal: false,
            logger: pino({ level: 'fatal' }),
            browser: ['Mac OS', 'Chrome', '110.0.5481.100']
        });

        if (!tempSock.authState.creds.registered) {
            await delay(2000); // Network handling delay
            const rawCode = await tempSock.requestPairingCode(num);
            const formattedCode = rawCode?.match(/.{1,4}/g)?.join('-') || rawCode;
            res.json({ code: formattedCode });
        } else {
            res.json({ error: "Device already registered or active session exists." });
        }

        // Auth save events
        tempSock.ev.on('creds.update', saveCreds);
        
        // Connection & Welcome Trigger Logic
        tempSock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;
            
            if (connection === 'open') {
                console.log(`\x1b[32m[SUCCESS] Device ${num} successfully linked!\x1b[0m`);
                
                // 🎉 DM Welcome Card template
                const welcomeTemplate = `✨ *W E L C O M E  TO  S Y E D - M D* ✨\n\n` +
                                        `👋 Salam! Your device has been successfully linked to *Core Engine*.\n\n` +
                                        `🚀 *Type:* \`.menu\` in your chat to explore all functions.\n\n` +
                                        `🛡️ _Your session is safe and completely isolated._\n` +
                                        `⚡ _Powered by Syed Abdul Wahab Bukhari_`;
                
                // DM message delivery
                await tempSock.sendMessage(`${num}@s.whatsapp.net`, { text: welcomeTemplate });
                
                // Clean close session after message push
                await delay(3000);
                tempSock.logout();
            }

            if (connection === 'close') {
                const reason = lastDisconnect?.error?.output?.statusCode;
                if (reason === DisconnectReason.loggedOut || !reason) {
                    // Safe runtime cleanup to prevent storage lag
                    setTimeout(() => {
                        if (fs.existsSync(tempAuthFolder)) {
                            fs.rmSync(tempAuthFolder, { recursive: true, force: true });
                            console.log(`[🧹 CLEANER] Removed temporary storage buffer for: ${num}`);
                        }
                    }, 5000);
                }
            }
        });

    } catch (err) {
        console.error('API Core Error:', err.message);
        res.json({ error: "Engine Sandboxing Failure. Try again." });
    }
});

// =========================================================================
// 🤖 MAIN RUNTIME BOT LOOP (KEEPS THE ACTIVE SESSION ALIVE)
// =========================================================================
async function startMainBot() {
    const mainSessionPath = path.join(__dirname, 'session');
    if (!fs.existsSync(mainSessionPath)) return;

    console.log("\x1b[36m[🤖 MAIN ENGINE] Booting background runtime services...\x1b[0m");
    const { state, saveCreds } = await useMultiFileAuthState(mainSessionPath);
    const { version } = await fetchLatestBaileysVersion();
    
    globalSock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        browser: ['Mac OS', 'Chrome', '110.0.5481.100']
    });

    globalSock.ev.on('creds.update', saveCreds);

    globalSock.ev.on('connection.update', (update) => {
        const { connection } = update;
        if (connection === 'open') {
            console.log("\x1b[32m[✅ MAIN BOT] Connected and listening to commands live!\x1b[0m");
        }
    });

    globalSock.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const msg = chatUpdate.messages[0];
            if (!msg.message || msg.key.fromMe) return;

            const from = msg.key.remoteJid;
            const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

            // Custom commands integration handler
            if (text.toLowerCase() === '.menu') {
                await globalSock.sendMessage(from, { text: "📜 *SYED-MD Active Menu Router:* Core functions are operating smoothly." });
            }
        } catch (e) {
            console.error('Message Event Error:', e.message);
        }
    });
}

// Start Web Server Listening
app.listen(PORT, () => {
    console.log(`\n\x1b[35m🌐 [SERVER] Web Interface is live on Port: ${PORT}\x1b[0m`);
    // Main session recovery loop
    startMainBot().catch(err => console.log('Main Bot Engine Error:', err.message));
});

// =========================================================================
// 🧹 SILENT RAM CLEANER (PREVENTS RAILWAY SERVER CRASH)
// =========================================================================
setInterval(() => {
  try {
    if (global.gc) global.gc();
  } catch (e) {
    // Silent fail if garbage collector isn't exposed
  }
}, 30 * 60 * 1000);
  
