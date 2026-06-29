const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { loadCommands } = require('./utils/commandLoader');
const { loadData, saveData } = require('./utils/anticallManager');
const { normalizeJid, extractNumber } = require('./utils/jidHelper');

const commands = loadCommands();
const PERSONA_FILE = path.join(__dirname, 'data', 'persona.json');

// --- Persona Setup ---
const DEFAULT_PERSONA = 'You are SYED-AI, a friendly WhatsApp AI created by Syed Abdul Wahab Bukhari.\n\nUser message:\n';

const getPersona = () => {
    try {
        if (fs.existsSync(PERSONA_FILE)) return JSON.parse(fs.readFileSync(PERSONA_FILE, 'utf8')).prompt;
    } catch { }
    return DEFAULT_PERSONA;
};

// --- Security Helpers ---
const isOwner = (senderJid, sock, activeConfig) => {
    const senderNum = extractNumber(senderJid);
    if (activeConfig.ownerNumber.includes(senderNum)) return true;
    if (sock?.user?.id && senderNum === extractNumber(sock.user.id)) return true;
    return false;
};

// --- Message Handler ---
const handleMessage = async (sock, msg) => {
    try {
        if (!msg.message) return;
        const from = normalizeJid(msg.key.remoteJid);
        if (from.includes('@broadcast') || from.includes('@newsletter')) return;

        delete require.cache[require.resolve('./config')];
        const activeConfig = require('./config');

        const sender = normalizeJid(msg.key.participant || msg.key.remoteJid);
        const isFromMe = msg.key.fromMe;
        const isSenderOwner = isOwner(sender, sock, activeConfig);

        let body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
        let textMsg = body.trim();
        
        // --- Auto AI Reply ---
        if (activeConfig.autoReply && !isFromMe && !from.endsWith('@g.us') && textMsg.length > 0) {
            await sock.sendPresenceUpdate('composing', from);
            try {
                const res = await axios.get(`https://arslan-apis-v2.vercel.app/ai/blackbox?q=${encodeURIComponent(getPersona() + '\n' + textMsg)}`);
                const replyText = res.data.result || res.data.reply;
                if (replyText) await sock.sendMessage(from, { text: String(replyText).trim() }, { quoted: msg });
            } catch (err) { console.error('AI Error:', err.message); }
        }

        // --- Command Logic (Simplified) ---
        if (textMsg.startsWith(activeConfig.prefix)) {
            const args = textMsg.slice(activeConfig.prefix.length).trim().split(/\s+/);
            const cmdName = args.shift().toLowerCase();
            const command = commands.get(cmdName) || Array.from(commands.values()).find(c => c.aliases?.includes(cmdName));
            
            if (command) {
                if (command.ownerOnly && !isSenderOwner && !isFromMe) return;
                await command.execute(sock, msg, args, { from, sender, isOwner: isSenderOwner || isFromMe, reply: (text) => sock.sendMessage(from, { text }, { quoted: msg }) });
            }
        }
    } catch (e) { console.error('Handler Error:', e); }
};

// --- Anti-Call Logic ---
const initializeAntiCall = (sock) => {
    sock.ev.on('call', async (calls) => {
        const data = loadData();
        if (!data.enabled) return;

        const whitelistPath = path.join(__dirname, 'allowed_callers.json');
        let allowedCallers = [];
        if (fs.existsSync(whitelistPath)) {
            try { allowedCallers = JSON.parse(fs.readFileSync(whitelistPath, 'utf-8')); } catch (e) {}
        }

        delete require.cache[require.resolve('./config')];
        const activeConfig = require('./config');

        for (const call of calls) {
            if (call.status !== 'offer') continue;
            const caller = normalizeJid(call.from);
            const callerNum = caller.split('@')[0].split(':')[0];

            // Whitelist/Owner Bypass
            if (activeConfig.ownerNumber.includes(callerNum) || (data.allowed || []).includes(callerNum) || allowedCallers.includes(caller)) {
                continue;
            }

            // Reject and Warn
            await sock.rejectCall(call.id, caller);
            
            const now = Date.now();
            if (!data.warnings[caller]) data.warnings[caller] = { count: 0, lastTime: now };
            data.warnings[caller].count++;
            data.warnings[caller].lastTime = now;

            if (data.warnings[caller].count >= 4) {
                await sock.updateBlockStatus(caller, 'block');
                await sock.sendMessage(caller, { text: "🚫 You have been blocked for calling." });
                data.blocked[caller] = now;
                delete data.warnings[caller];
            } else {
                await sock.sendMessage(caller, { text: `⚠️ Warning ${data.warnings[caller].count}/3\n🚫 Calls are not allowed.` });
            }
            saveData(data);
        }
    });
};

module.exports = { handleMessage, initializeAntiCall, isOwner };
          
