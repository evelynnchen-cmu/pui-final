import fetch from 'node-fetch';

function formatDate(timestamp) {
    return new Date(timestamp).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
        hour12: true
    });
}

export default async function handler(req, res) {
    const { username } = req.query;

    const url = `https://api.hypixel.net/player?key=${process.env.API_KEY}&name=${username}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.success || !data.player) {
            return res.status(404).json({ error: 'Player not found' });
        }

        // map data to my custom playerData object
        const playerData = {
            general: {
                uuid: data.player.uuid,
                name: data.player.displayname,
                rank: data.player.newPackageRank,
                karma: data.player.karma,
                experience: data.player.stats?.Bedwars?.Experience || 0,
                coins: data.player.stats?.Bedwars?.coins || 0,
                achievement_points: data.player.achievementPoints || 0,
                kills: data.player.stats?.Bedwars?.kills_bedwars || 0,
                deaths: data.player.stats?.Bedwars?.deaths_bedwars || 0,
                final_kills: data.player.stats?.Bedwars?.final_kills_bedwars || 0,
                final_deaths: data.player.stats?.Bedwars?.final_deaths_bedwars || 0,
                wins: data.player.stats?.Bedwars?.wins_bedwars || 0,
                losses: data.player.stats?.Bedwars?.losses_bedwars || 0,
                beds_broken: data.player.stats?.Bedwars?.beds_broken_bedwars || 0,
                beds_lost: data.player.stats?.Bedwars?.beds_lost_bedwars || 0,
                last_login: formatDate(data.player.lastLogin),
                first_login: formatDate(data.player.firstLogin),
            },
            squad: {
                games_played: data.player.stats?.Bedwars?.four_four_games_played_bedwars || 0,
                wins: data.player.stats?.Bedwars?.four_four_wins_bedwars || 0,
                losses: data.player.stats?.Bedwars?.four_four_losses_bedwars || 0,
                beds_broken: data.player.stats?.Bedwars?.four_four_beds_broken_bedwars || 0,
                beds_lost: data.player.stats?.Bedwars?.four_four_beds_lost_bedwars || 0,
                kills: data.player.stats?.Bedwars?.four_four_kills_bedwars || 0,
                deaths: data.player.stats?.Bedwars?.four_four_deaths_bedwars || 0,
                final_kills: data.player.stats?.Bedwars?.four_four_final_kills_bedwars || 0,
                final_deaths: data.player.stats?.Bedwars?.four_four_final_deaths_bedwars || 0,
                resources_collected: data.player.stats?.Bedwars?.four_four_resources_collected_bedwars || 0,
            },
            trio: {
                games_played: data.player.stats?.Bedwars?.four_three_games_played_bedwars || 0,
                wins: data.player.stats?.Bedwars?.four_three_wins_bedwars || 0,
                losses: data.player.stats?.Bedwars?.four_three_losses_bedwars || 0,
                beds_broken: data.player.stats?.Bedwars?.four_three_beds_broken_bedwars || 0,
                beds_lost: data.player.stats?.Bedwars?.four_three_beds_lost_bedwars || 0,
                kills: data.player.stats?.Bedwars?.four_three_kills_bedwars || 0,
                deaths: data.player.stats?.Bedwars?.four_three_deaths_bedwars || 0,
                final_kills: data.player.stats?.Bedwars?.four_three_final_kills_bedwars || 0,
                final_deaths: data.player.stats?.Bedwars?.four_three_final_deaths_bedwars || 0,
                resources_collected: data.player.stats?.Bedwars?.four_three_resources_collected_bedwars || 0,
            },
            duo: {
                games_played: data.player.stats?.Bedwars?.eight_two_games_played_bedwars || 0,
                wins: data.player.stats?.Bedwars?.eight_two_wins_bedwars || 0,
                losses: data.player.stats?.Bedwars?.eight_two_losses_bedwars || 0,
                beds_broken: data.player.stats?.Bedwars?.eight_two_beds_broken_bedwars || 0,
                beds_lost: data.player.stats?.Bedwars?.eight_two_beds_lost_bedwars || 0,
                kills: data.player.stats?.Bedwars?.eight_two_kills_bedwars || 0,
                deaths: data.player.stats?.Bedwars?.eight_two_deaths_bedwars || 0,
                final_kills: data.player.stats?.Bedwars?.eight_two_final_kills_bedwars || 0,
                final_deaths: data.player.stats?.Bedwars?.eight_two_final_deaths_bedwars || 0,
                resources_collected: data.player.stats?.Bedwars?.eight_two_resources_collected_bedwars || 0,
            },
            solo: {
                games_played: data.player.stats?.Bedwars?.eight_one_games_played_bedwars || 0,
                wins: data.player.stats?.Bedwars?.eight_one_wins_bedwars || 0,
                losses: data.player.stats?.Bedwars?.eight_one_losses_bedwars || 0,
                beds_broken: data.player.stats?.Bedwars?.eight_one_beds_broken_bedwars || 0,
                beds_lost: data.player.stats?.Bedwars?.eight_one_beds_lost_bedwars || 0,
                kills: data.player.stats?.Bedwars?.eight_one_kills_bedwars || 0,
                deaths: data.player.stats?.Bedwars?.eight_one_deaths_bedwars || 0,
                final_kills: data.player.stats?.Bedwars?.eight_one_final_kills_bedwars || 0,
                final_deaths: data.player.stats?.Bedwars?.eight_one_final_deaths_bedwars || 0,
                resources_collected: data.player.stats?.Bedwars?.eight_one_resources_collected_bedwars || 0,
            },
        }

        res.status(200).json(playerData);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch player data', username: username, errorMessage: err.message });
    }
}
