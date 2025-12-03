// validation.js - Validation functions for CSV and JSON data

function validateCSV(csvText) {
    const lines = csvText.trim().split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
        return { valid: false, error: 'CSV data is empty' };
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const parts = line.split('|');

        // Check if line has exactly 4 pipe-delimited sections
        if (parts.length !== 4) {
            return { 
                valid: false, 
                error: `Row ${i + 1}: Must have exactly 4 pipe-delimited sections (found ${parts.length})` 
            };
        }

        const [duration, teamA, teamB, score] = parts.map(p => p.trim());

        // Validate duration format (mm:ss or m:ss)
        const durationRegex = /^\d{1,2}:\d{2}$/;
        if (!durationRegex.test(duration)) {
            return { 
                valid: false, 
                error: `Row ${i + 1}: Invalid duration format "${duration}". Expected format: mm:ss or m:ss` 
            };
        }

        // Validate Team A (must have 2 players separated by &)
        const teamAPlayers = teamA.split('&').map(p => p.trim()).filter(p => p !== '');
        if (teamAPlayers.length !== 2) {
            return { 
                valid: false, 
                error: `Row ${i + 1}: Team A must have exactly 2 players separated by "&" (found ${teamAPlayers.length})` 
            };
        }

        // Validate Team B (must have 2 players separated by &)
        const teamBPlayers = teamB.split('&').map(p => p.trim()).filter(p => p !== '');
        if (teamBPlayers.length !== 2) {
            return { 
                valid: false, 
                error: `Row ${i + 1}: Team B must have exactly 2 players separated by "&" (found ${teamBPlayers.length})` 
            };
        }

        // Validate score format (number - number)
        const scoreParts = score.split('-').map(s => s.trim());
        if (scoreParts.length !== 2) {
            return { 
                valid: false, 
                error: `Row ${i + 1}: Score must have exactly 2 numbers separated by "-"` 
            };
        }

        const scoreA = parseInt(scoreParts[0]);
        const scoreB = parseInt(scoreParts[1]);

        if (isNaN(scoreA) || isNaN(scoreB)) {
            return { 
                valid: false, 
                error: `Row ${i + 1}: Scores must be valid numbers` 
            };
        }

        if (scoreA < 0 || scoreB < 0) {
            return { 
                valid: false, 
                error: `Row ${i + 1}: Scores cannot be negative` 
            };
        }
    }

    return { valid: true };
}

function validateJSON(jsonText) {
    try {
        const data = JSON.parse(jsonText);

        // Must be an array
        if (!Array.isArray(data)) {
            return { valid: false, error: 'JSON must be an array of match objects' };
        }

        // Validate each match object
        for (let i = 0; i < data.length; i++) {
            const match = data[i];

            // Check required fields
            if (!match.date) {
                return { valid: false, error: `Match ${i + 1}: Missing "date" field` };
            }
            if (!match.duration) {
                return { valid: false, error: `Match ${i + 1}: Missing "duration" field` };
            }
            if (!match.teams) {
                return { valid: false, error: `Match ${i + 1}: Missing "teams" field` };
            }
            if (!match.score) {
                return { valid: false, error: `Match ${i + 1}: Missing "score" field` };
            }
            if (!match.winner) {
                return { valid: false, error: `Match ${i + 1}: Missing "winner" field` };
            }

            // Validate date format (YYYY-MM-DD)
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(match.date)) {
                return { 
                    valid: false, 
                    error: `Match ${i + 1}: Invalid date format "${match.date}". Expected format: YYYY-MM-DD` 
                };
            }

            // Validate teams structure
            if (!match.teams.A || !match.teams.B) {
                return { valid: false, error: `Match ${i + 1}: Teams must have both "A" and "B" properties` };
            }

            if (!Array.isArray(match.teams.A) || match.teams.A.length !== 2) {
                return { valid: false, error: `Match ${i + 1}: Team A must be an array of exactly 2 players` };
            }

            if (!Array.isArray(match.teams.B) || match.teams.B.length !== 2) {
                return { valid: false, error: `Match ${i + 1}: Team B must be an array of exactly 2 players` };
            }

            // Validate scores are numbers
            if (typeof match.score.A !== 'number' || typeof match.score.B !== 'number') {
                return { valid: false, error: `Match ${i + 1}: Scores must be numbers` };
            }

            // Validate winner is "A" or "B"
            if (match.winner !== 'A' && match.winner !== 'B') {
                return { 
                    valid: false, 
                    error: `Match ${i + 1}: Winner must be either "A" or "B" (found "${match.winner}")` 
                };
            }
        }

        return { valid: true, data: data };

    } catch (error) {
        return { 
            valid: false, 
            error: `JSON parsing error: ${error.message}` 
        };
    }
}