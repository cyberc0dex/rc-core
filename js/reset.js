// reset.js - Reset tab logic for deleting all data

function initializeReset() {
    const deleteBtn = document.getElementById('delete-all-btn');
    deleteBtn.addEventListener('click', deleteAllData);
}

function deleteAllData() {
    const confirmed = confirm('Are you sure you want to DELETE ALL DATA?\n\nThis action cannot be undone.');
    
    if (confirmed) {
        // Clear all localStorage data
        localStorage.removeItem('matchHistory');
        localStorage.removeItem('matchDates');
        localStorage.removeItem('playerStats');
        
        // Reinitialize with empty data
        localStorage.setItem('matchHistory', JSON.stringify([]));
        localStorage.setItem('matchDates', JSON.stringify([]));
        localStorage.setItem('playerStats', JSON.stringify({}));
        
        showNotification('All data deleted successfully', 'success');
        
        // Refresh all tabs
        loadMatchHistory();
        loadPlayerStats();
    }
}