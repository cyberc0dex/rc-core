// decryptor.js - Decryptor tab logic for decrypting and importing match data

function initializeDecryptor() {
    const decryptBtn = document.getElementById('decrypt-btn');
    const copyPlaintextBtn = document.getElementById('copy-plaintext-btn');
    const importBtn = document.getElementById('import-btn');

    decryptBtn.addEventListener('click', decryptData);
    copyPlaintextBtn.addEventListener('click', copyPlaintextData);
    importBtn.addEventListener('click', importData);
}

async function decryptData() {
    const keyInput = document.getElementById('decrypt-key');
    const encryptedInput = document.getElementById('encrypted-input');
    const plaintextOutput = document.getElementById('plaintext-output');
    const decryptionKey = keyInput.value.trim();
    const encryptedText = encryptedInput.value.trim();

    // Validate decryption key
    if (!decryptionKey) {
        showNotification('Please enter a decryption key', 'error');
        return;
    }

    if (decryptionKey.length < 8) {
        showNotification('Decryption key must be at least 8 characters', 'error');
        return;
    }

    // Validate encrypted input
    if (!encryptedText) {
        showNotification('Please paste encrypted data', 'error');
        return;
    }

    try {
        // Decrypt the data
        const decryptedText = await decryptText(encryptedText, decryptionKey);

        // Display decrypted data
        plaintextOutput.value = decryptedText;

        showNotification('Data decrypted successfully', 'success');
    } catch (error) {
        showNotification('Decryption failed: Invalid key or corrupted data', 'error');
        console.error('Decryption error:', error);
        plaintextOutput.value = '';
    }
}

function importData() {
    const plaintextOutput = document.getElementById('plaintext-output');
    const decryptedText = plaintextOutput.value.trim();

    if (!decryptedText) {
        showNotification('No decrypted data to import', 'error');
        return;
    }

    // Validate JSON before importing
    const validation = validateJSON(decryptedText);

    if (!validation.valid) {
        showNotification('Invalid data format: ' + validation.error, 'error');
        return;
    }

    // Confirm before overwriting existing data
    const matchHistory = getMatchHistory();
    if (matchHistory.length > 0) {
        const confirmed = confirm('This will overwrite existing data. Continue?');
        if (!confirmed) {
            return;
        }
    }

    // Import validated data
    const matches = validation.data;
    saveAllData(matches);

    showNotification('Data imported successfully', 'success');

    // Refresh current tab if it's match history or player stats
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab.id === 'match-history') {
        loadMatchHistory();
    } else if (activeTab.id === 'player-stats') {
        loadPlayerStats();
    }
}

function copyPlaintextData() {
    const plaintextOutput = document.getElementById('plaintext-output');
    const plaintextText = plaintextOutput.value.trim();

    if (!plaintextText) {
        showNotification('No plaintext data to copy', 'error');
        return;
    }

    navigator.clipboard.writeText(plaintextText)
        .then(() => {
            showNotification('Copied to clipboard', 'success');
        })
        .catch(err => {
            showNotification('Failed to copy to clipboard', 'error');
            console.error('Copy failed:', err);
        });
}