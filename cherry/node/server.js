const http = require("http");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const { URL } = require("url");

loadEnvFile();

const PORT = process.env.PORT || 8080;
const LOG_FILE = path.join(__dirname, "mail.log");
const DATA_FILE = path.join(__dirname, "users.json");

initializeStorage();

function loadEnvFile() {
    const envPath = path.join(__dirname, ".env");

    if (!fs.existsSync(envPath)) {
        return;
    }

    const envContent = fs.readFileSync(envPath, "utf8");
    const lines = envContent.split(/\r?\n/);

    lines.forEach((line) => {
        const trimmedLine = line.trim();

        if (!trimmedLine || trimmedLine.startsWith("#")) {
            return;
        }

        const separatorIndex = trimmedLine.indexOf("=");

        if (separatorIndex === -1) {
            return;
        }

        const key = trimmedLine.slice(0, separatorIndex).trim();
        let value = trimmedLine.slice(separatorIndex + 1).trim();

        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }

        if (!(key in process.env)) {
            process.env[key] = value;
        }
    });
}

function initializeStorage() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            fs.writeFileSync(DATA_FILE, "{}\n");
        }

        if (!fs.existsSync(LOG_FILE)) {
            fs.writeFileSync(LOG_FILE, "");
        }
    } catch (error) {
        throw new Error("Failed to initialize storage files");
    }
}

function parseJsonBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {
            if (!body) {
                resolve({});
                return;
            }

            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(new Error("Invalid JSON body"));
            }
        });

        req.on("error", reject);
    });
}

function createTransporter() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
        throw new Error("Missing SMTP configuration in environment variables");
    }

    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });
}

async function sendEmail({ subject, text, html }) {
    const primaryRecipient = String(process.env.MAIL_TO || "").trim();
    const copyRecipient = String(process.env.MAIL_CC || "").trim();

    if (!primaryRecipient || !subject || (!text && !html)) {
        throw new Error("Missing MAIL_TO in environment or missing email content");
    }

    const transporter = createTransporter();

    return transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.SMTP_USER,
        to: primaryRecipient,
        cc: copyRecipient || undefined,
        subject,
        text,
        html,
    });
}

function sendJson(res, statusCode, payload) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end(JSON.stringify(payload));
}

function writeLog(entry) {
    const line = `${JSON.stringify(entry)}\n`;
    fs.appendFile(LOG_FILE, line, (error) => {
        if (error) {
            console.error("Failed to write mail log:", error.message);
        }
    });
}

function readUsers() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            writeUsers({});
            return {};
        }

        const raw = fs.readFileSync(DATA_FILE, "utf8");
        return raw ? JSON.parse(raw) : {};
    } catch (error) {
        throw new Error("Failed to read user storage");
    }
}

function writeUsers(users) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
    } catch (error) {
        throw new Error("Failed to write user storage");
    }
}

function normalizeUserId(userId) {
    return String(userId || "")
        .trim()
        .toLowerCase();
}

function getUserRecord(users, userId) {
    const normalizedUserId = normalizeUserId(userId);
    const existing = users[normalizedUserId];

    return (
        existing || {
            userId: normalizedUserId,
            clickedItems: [],
            updatedAt: null,
        }
    );
}

function normalizeClickedItems(clickedItems) {
    if (!Array.isArray(clickedItems)) {
        return [];
    }

    return clickedItems
        .map((item) => {
            if (typeof item === "number") {
                return {
                    itemId: item,
                    page: null,
                    clickedAt: null,
                };
            }

            if (item && Number.isFinite(Number(item.itemId))) {
                return {
                    itemId: Number(item.itemId),
                    page: item.page || null,
                    clickedAt: item.clickedAt || null,
                };
            }

            return null;
        })
        .filter(Boolean);
}

function saveClickedItem({ userId, itemId, page }) {
    const normalizedUserId = normalizeUserId(userId);

    if (!normalizedUserId) {
        throw new Error("Field 'userId' is required");
    }

    if (itemId === undefined || itemId === null) {
        throw new Error("Field 'itemId' is required");
    }

    const users = readUsers();
    const user = getUserRecord(users, normalizedUserId);
    const normalizedItemId = Number(itemId);
    const normalizedClickedItems = normalizeClickedItems(user.clickedItems);

    if (!Number.isFinite(normalizedItemId)) {
        throw new Error("Field 'itemId' must be a number");
    }

    if (!normalizedClickedItems.some((item) => item.itemId === normalizedItemId)) {
        normalizedClickedItems.push({
            itemId: normalizedItemId,
            page: page || null,
            clickedAt: new Date().toISOString(),
        });
    }

    user.clickedItems = normalizedClickedItems;
    user.updatedAt = new Date().toISOString();
    users[normalizedUserId] = user;
    writeUsers(users);

    return user;
}

function getClickedItems(userId) {
    const normalizedUserId = normalizeUserId(userId);

    if (!normalizedUserId) {
        throw new Error("Query parameter 'userId' is required");
    }

    const users = readUsers();
    const user = getUserRecord(users, normalizedUserId);
    user.clickedItems = normalizeClickedItems(user.clickedItems);
    users[normalizedUserId] = user;
    writeUsers(users);
    return user;
}

function getAllUsers() {
    const users = readUsers();

    Object.keys(users).forEach((userId) => {
        users[userId].clickedItems = normalizeClickedItems(users[userId].clickedItems);
    });

    writeUsers(users);
    return users;
}

const server = http.createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
        sendJson(res, 200, { success: true });
        return;
    }

    if (req.method === "POST" && req.url === "/send-email") {
        const startedAt = new Date().toISOString();

        try {
            const payload = await parseJsonBody(req);
            const info = await sendEmail(payload);

            writeLog({
                timestamp: startedAt,
                status: "success",
                to: process.env.MAIL_TO || null,
                cc: process.env.MAIL_CC || null,
                subject: payload.subject || null,
                text: payload.text || null,
                html: payload.html || null,
                messageId: info.messageId,
            });

            sendJson(res, 200, {
                success: true,
                messageId: info.messageId,
            });
        } catch (error) {
            writeLog({
                timestamp: startedAt,
                status: "error",
                error: error.message,
            });

            sendJson(res, 400, {
                success: false,
                error: error.message,
            });
        }

        return;
    }

    const requestUrl = new URL(req.url, `http://localhost:${PORT}`);

    if (req.method === "GET" && requestUrl.pathname === "/user-clicks") {
        try {
            const user = getClickedItems(requestUrl.searchParams.get("userId"));

            sendJson(res, 200, {
                success: true,
                user,
            });
        } catch (error) {
            sendJson(res, 400, {
                success: false,
                error: error.message,
            });
        }

        return;
    }

    if (req.method === "GET" && requestUrl.pathname === "/all-users") {
        try {
            const users = getAllUsers();

            sendJson(res, 200, {
                success: true,
                users,
            });
        } catch (error) {
            sendJson(res, 400, {
                success: false,
                error: error.message,
            });
        }

        return;
    }

    if (req.method === "POST" && requestUrl.pathname === "/click-item") {
        try {
            const payload = await parseJsonBody(req);
            const user = saveClickedItem(payload);

            writeLog({
                timestamp: new Date().toISOString(),
                status: "saved-click",
                userId: user.userId,
                itemId: Number(payload.itemId),
                page: payload.page || null,
            });

            sendJson(res, 200, {
                success: true,
                user,
            });
        } catch (error) {
            writeLog({
                timestamp: new Date().toISOString(),
                status: "click-error",
                error: error.message,
            });

            sendJson(res, 400, {
                success: false,
                error: error.message,
            });
        }

        return;
    }

    sendJson(res, 404, {
        success: false,
        error: "Not found",
    });
});

server.listen(PORT, () => {
    console.log(`Mail server listening on http://localhost:${PORT}`);
});

module.exports = {
    getClickedItems,
    saveClickedItem,
    sendEmail,
};
