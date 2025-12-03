// converter.js - CSV to JSON converter logic

function initializeConverter() {
    // Set default date to today
    const dateInput = document.getElementById('converter-date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    // Setup event listeners
    const convertBtn = document.getElementById('convert-btn');
    const copyBtn = document.getElementById('copy-btn');

    convertBtn.addEventListener('click', convertCSVToJSON);
    copyBtn.addEventListener('click', copyJSONToClipboard);
}

function convertCSVToJSON() {
    const csvInput = document.getElementById('csv-input');
    const jsonOutput = document.getElementById('json-output');
    const dateInput = document.getElementById('converter-date');

    const csvText = csvInput.value.trim();
    const selectedDate = dateInput.value;

    // Validate date is selected
    if (!selectedDate) {
        showNotification('Please select a date', 'error');
        return;
    }

    // Validate CSV
    const validation = validateCSV(csvText);
    if (!validation.valid) {
        showNotification(validation.error, 'error');
        jsonOutput.value = '';
        return;
    }

    // Parse CSV and convert to JSON
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    const matches = [];

    lines.forEach(line => {
        const parts = line.split('|').map(p => p.trim());
        const [duration, teamA, teamB, score] = parts;

        // Parse teams
        const teamAPlayers = teamA.split('&').map(p => p.trim());
        const teamBPlayers = teamB.split('&').map(p => p.trim());

        // Parse scores
        const scoreParts = score.split('-').map(s => s.trim());
        const scoreA = parseInt(scoreParts[0]);
        const scoreB = parseInt(scoreParts[1]);

        // Determine winner
        const winner = scoreA > scoreB ? 'A' : 'B';

        // Create match object
        const match = {
            date: selectedDate,
            duration: duration,
            teams: {
                A: teamAPlayers,
                B: teamBPlayers
            },
            score: {
                A: scoreA,
                B: scoreB
            },
            winner: winner
        };

        matches.push(match);
    });

    // Display JSON output
    jsonOutput.value = JSON.stringify(matches, null, 2);
    showNotification('CSV converted successfully', 'success');
}

function copyJSONToClipboard() {
    const jsonOutput = document.getElementById('json-output');
    const jsonText = jsonOutput.value.trim();

    if (!jsonText) {
        showNotification('No JSON to copy', 'error');
        return;
    }

    // Copy to clipboard
    navigator.clipboard.writeText(jsonText)
        .then(() => {
            showNotification('Copied to clipboard', 'success');
        })
        .catch(err => {
            showNotification('Failed to copy to clipboard', 'error');
            console.error('Copy failed:', err);
        });
}