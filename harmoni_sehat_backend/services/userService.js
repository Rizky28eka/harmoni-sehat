const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY ? crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32) : null;

const encrypt = (text) => {
    if (!ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEY is not set.');
    const iv = crypto.randomBytes(IV_LENGTH);
    const salt = crypto.randomBytes(SALT_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([salt, iv, tag, encrypted]).toString('hex');
};

const decrypt = (encryptedText) => {
    if (!ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEY is not set.');
    try {
        const data = Buffer.from(encryptedText, 'hex');
        const salt = data.slice(0, SALT_LENGTH);
        const iv = data.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
        const tag = data.slice(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
        const encrypted = data.slice(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
        const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
        decipher.setAuthTag(tag);
        return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
    } catch (error) {
        console.error("Decryption failed:", error.message);
        return null; 
    }
};

const createHash = (data) => {
    return crypto.createHash('sha256').update(data).digest('hex');
};

const generateCustomUserId = (role) => {
    let prefix;
    switch (role) {
        case 'Pasien':
            prefix = '08';
            break;
        case 'Dokter':
            prefix = '10';
            break;
        case 'Apoteker':
            prefix = '20';
            break;
        case 'Admin':
            prefix = '04';
            break;
        default:
            prefix = '99'; // Fallback for unknown roles
    }
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase(); // 8 random chars
    return `${prefix}-${randomPart}`;
};

module.exports = { generateCustomUserId, encrypt, decrypt, createHash };
