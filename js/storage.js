// storage.js - localStorage operations and data management

function getMatchHistory() {
    const data = localStorage.getItem('matchHistory');
    return data ? JSON.parse(data) : [];
}

function setMatchHistory(matches) {
    localStorage.setItem('matchHistory', JSON.stringify(matches));
}

function getMatchDates() {
    const data = localStorage.getItem('matchDates');
    return data ? JSON.parse(data) : [];
}

function setMatchDates(dates) {
    localStorage.setItem('matchDates', JSON.stringify(dates));
}

function getPlayerStats() {
    const data = localStorage.getItem('playerStats');
    return data ? JSON.parse(data) : {};
}

function setPlayerStats(stats) {
    localStorage.setItem('playerStats', JSON.stringify(stats));
}

function updateMatchDates(matches) {
    const dates = [...new Set(matches.map(match => match.date))];
    dates.sort((a, b) => new Date(b) - new Date(a)); // Sort newest to oldest
    setMatchDates(dates);
}

function computePlayerStats(matches) {
    const stats = {};

    matches.forEach(match => {
        const teamAPlayers = match.teams.A;
        const teamBPlayers = match.teams.B;
        const winner = match.winner;

        // Process Team A players
        teamAPlayers.forEach(player => {
            if (!stats[player]) {
                stats[player] = {
                    matches: 0,
                    wins: 0,
                    losses: 0,
                    winRate: 0
                };
            }
            stats[player].matches++;
            if (winner === 'A') {
                stats[player].wins++;
            } else {
                stats[player].losses++;
            }
        });

        // Process Team B players
        teamBPlayers.forEach(player => {
            if (!stats[player]) {
                stats[player] = {
                    matches: 0,
                    wins: 0,
                    losses: 0,
                    winRate: 0
                };
            }
            stats[player].matches++;
            if (winner === 'B') {
                stats[player].wins++;
            } else {
                stats[player].losses++;
            }
        });
    });

    // Calculate win rates
    Object.keys(stats).forEach(player => {
        const playerStats = stats[player];
        playerStats.winRate = playerStats.matches > 0 
            ? Math.round((playerStats.wins / playerStats.matches) * 100) 
            : 0;
    });

    return stats;
}

function saveAllData(matches) {
    setMatchHistory(matches);
    updateMatchDates(matches);
    const stats = computePlayerStats(matches);
    setPlayerStats(stats);
}