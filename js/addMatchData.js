// addMatchData.js - Add/Edit match data modal logic

document.addEventListener('DOMContentLoaded', () => {
    setupAddMatchData();
});

function setupAddMatchData() {
    const openModalBtn = document.getElementById('open-modal-btn');
    const modal = document.getElementById('match-modal');
    const saveBtn = document.getElementById('save-data-btn');
    const cancelBtn = document.getElementById('cancel-modal-btn');

    openModalBtn.addEventListener('click', openModal);
    cancelBtn.addEventListener('click', closeModal);
    saveBtn.addEventListener('click', saveMatchData);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function openModal() {
    const modal = document.getElementById('match-modal');
    const textarea = document.getElementById('match-data-textarea');

    // Load current match history
    const matches = getMatchHistory();
    textarea.value = JSON.stringify(matches, null, 2);

    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('match-modal');
    modal.classList.remove('show');
}

function saveMatchData() {
    const textarea = document.getElementById('match-data-textarea');
    const jsonText = textarea.value.trim();

    // Pre-check validation - validate JSON format first
    const validation = validateJSON(jsonText);
    
    if (!validation.valid) {
        // Show error alert, do NOT save
        showNotification(validation.error, 'error');
        return;
    }

    // If valid: Update matchHistory → matchDates → recompute playerStats → save to localStorage
    const matches = validation.data;
    saveAllData(matches);

    // Show success message
    showNotification('Data saved successfully', 'success');

    // Close modal
    closeModal();

    // Refresh current tab if it's match history or player stats
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab.id === 'match-history') {
        loadMatchHistory();
    } else if (activeTab.id === 'player-stats') {
        loadPlayerStats();
    }
}