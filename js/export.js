// export.js - Export tab logic for encrypting match data

function initializeExport() {
    const exportBtn = document.getElementById('export-btn');
    const copyExportBtn = document.getElementById('copy-export-btn');

    exportBtn.addEventListener('click', exportData);
    copyExportBtn.addEventListener('click', copyEncryptedData);
}

async function exportData() {
    const keyInput = document.getElementById('export-key');
    const encryptedOutput = document.getElementById('encrypted-output');
    const encryptionKey = keyInput.value.trim();

    // Validate encryption key
    if (!encryptionKey) {
        showNotification('Please enter an encryption key', 'error');
        return;
    }

    if (encryptionKey.length < 8) {
        showNotification('Encryption key must be at least 8 characters', 'error');
        return;
    }

    try {
        // Get match history from localStorage
        const matchHistory = getMatchHistory();

        if (matchHistory.length === 0) {
            showNotification('No data to export', 'error');
            return;
        }

        // Convert to JSON string
        const plainText = JSON.stringify(matchHistory);

        // Encrypt the data
        const encryptedData = await encryptText(plainText, encryptionKey);

        // Display encrypted data
        encryptedOutput.value = encryptedData;

        showNotification('Data encrypted successfully', 'success');
    } catch (error) {
        showNotification('Encryption failed: ' + error.message, 'error');
        console.error('Encryption error:', error);
    }
}

function copyEncryptedData() {
    const encryptedOutput = document.getElementById('encrypted-output');
    const encryptedText = encryptedOutput.value.trim();

    if (!encryptedText) {
        showNotification('No encrypted data to copy', 'error');
        return;
    }

    // Copy to clipboard
    navigator.clipboard.writeText(encryptedText)
        .then(() => {
            showNotification('Copied to clipboard', 'success');
        })
        .catch(err => {
            showNotification('Failed to copy to clipboard', 'error');
            console.error('Copy failed:', err);
        });
}