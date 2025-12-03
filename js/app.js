// app.js - Main application logic and initialization

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupTabNavigation();
    // registerServiceWorker();

    // Load Player Stats after DOM is ready
    loadPlayerStats();
});

function initializeApp() {
    // Initialize storage if empty
    if (!localStorage.getItem('matchHistory')) {
        localStorage.setItem('matchHistory', JSON.stringify([]));
    }
    if (!localStorage.getItem('matchDates')) {
        localStorage.setItem('matchDates', JSON.stringify([]));
    }
    if (!localStorage.getItem('playerStats')) {
        localStorage.setItem('playerStats', JSON.stringify({}));
    }

    loadPlayerStats();
}

function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(tabName).classList.add('active');

            // Load data for the selected tab
            loadTabData(tabName);
        });
    });
}

function loadTabData(tabName) {
    switch (tabName) {
        case 'match-history':
            loadMatchHistory();
            break;
        case 'player-stats':
            loadPlayerStats();
            break;
        case 'add-match':
            // No data to load, just the button
            break;
        case 'converter':
            initializeConverter();
            break;
        case 'export':
            initializeExport();
            break;
        case 'decryptor':
            initializeDecryptor();
            break;
        case 'reset':
            initializeReset();
            break;
    }
}


function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }
}


function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}