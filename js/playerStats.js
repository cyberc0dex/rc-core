// playerStats.js - Player Stats tab logic

function loadPlayerStats() {
    const stats = getPlayerStats();
    const matches = getMatchHistory();

    // Update summary cards
    updateSummaryCards(stats, matches);

    // Populate player cards
    populatePlayerCards(stats);
}

function updateSummaryCards(stats, matches) {
    const totalPlayersEl = document.getElementById('total-players');
    const totalMatchesEl = document.getElementById('total-matches');

    const totalPlayers = Object.keys(stats).length;
    const totalMatches = matches.length;

    totalPlayersEl.textContent = totalPlayers;
    totalMatchesEl.textContent = totalMatches;
}

function populatePlayerCards(stats) {
    const container = document.getElementById('player-cards-container');
    container.innerHTML = '';

    // Convert stats object to array for sorting
    const statsArray = Object.entries(stats).map(([playerName, playerStats]) => ({
        name: playerName,
        ...playerStats
    }));

    // Sort by matches played (descending), then by win rate (descending)
    statsArray.sort((a, b) => {
        if (b.matches !== a.matches) {
            return b.matches - a.matches;
        }
        return b.winRate - a.winRate;
    });

    // Create player cards
    statsArray.forEach(player => {
        const card = document.createElement('div');
        card.className = 'player-card';

        /*  
        // Avatar (black circle)
        const avatar = document.createElement('div');
        avatar.className = 'player-avatar';
        card.appendChild(avatar);
        */

        // Player Name
        const name = document.createElement('div');
        name.className = 'player-name';
        name.textContent = player.name;
        card.appendChild(name);

        // Matches
        const matches = document.createElement('div');
        matches.className = 'player-stat';
        matches.innerHTML = `<span class="player-stat-label">Matches Played</span><span class="player-stat-value">${player.matches}</span>`;
        card.appendChild(matches);

        // Wins
        const wins = document.createElement('div');
        wins.className = 'player-stat';
        wins.innerHTML = `<span class="player-stat-label">Total Wins</span><span class="player-stat-value">${player.wins}</span>`;
        card.appendChild(wins);

        // Losses
        const losses = document.createElement('div');
        losses.className = 'player-stat';
        losses.innerHTML = `<span class="player-stat-label">Total Loss</span><span class="player-stat-value">${player.losses}</span>`;
        card.appendChild(losses);

        // Win Rate
        const winRate = document.createElement('div');
        winRate.className = 'player-stat';
        winRate.innerHTML = `<span class="player-stat-label">Win Rate</span><span class="player-stat-value">${player.winRate}%</span>`;
        card.appendChild(winRate);

        container.appendChild(card);
    });

    // If no players found
    if (statsArray.length === 0) {
        const message = document.createElement('div');
        message.style.gridColumn = '1 / -1';
        message.style.textAlign = 'center';
        message.style.color = 'var(--text-secondary)';
        message.style.padding = '40px 20px';
        message.textContent = 'No player statistics available';
        container.appendChild(message);
    }
}