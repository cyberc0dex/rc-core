// encryption.js - Core encryption/decryption functions using Web Crypto API

const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Generate random alphanumeric string of given length
function randomSalt(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Derive key using PBKDF2
async function deriveKey(password, saltStr) {
    const salt = encoder.encode(saltStr);
    const baseKey = await crypto.subtle.importKey(
        "raw", 
        encoder.encode(password), 
        { name: "PBKDF2" }, 
        false, 
        ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        baseKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

// Encrypt text using AES-GCM
async function encryptText(plainText, userKey) {
    const saltStr = randomSalt(10);   // 10-char random salt
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(userKey, saltStr);
    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encoder.encode(plainText)
    );

    // Combine IV + ciphertext
    const buff = new Uint8Array(iv.length + encrypted.byteLength);
    buff.set(iv, 0);
    buff.set(new Uint8Array(encrypted), iv.length);

    // Return base64: salt + encrypted data
    return saltStr + btoa(String.fromCharCode(...buff));
}

// Decrypt text using AES-GCM
async function decryptText(cipherTextB64, userKey) {
    const saltStr = cipherTextB64.slice(0, 10);   // first 10 chars = salt
    const cipherB64 = cipherTextB64.slice(10);
    const data = Uint8Array.from(atob(cipherB64), c => c.charCodeAt(0));
    const iv = data.slice(0, 12);
    const ciphertext = data.slice(12);
    const key = await deriveKey(userKey, saltStr);
    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        key,
        ciphertext
    );
    return decoder.decode(decrypted);
}