import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ComparisonTable({ playersData, avatars }) {

    useEffect(() => {
        // display scroll msg if table overflows
        function checkOverflow() {
            const table = document.getElementById('comparison-table');
            if (table.offsetWidth > window.innerWidth - 32) {
              document.getElementById('scroll-msg').style.display = 'block';
            } else {
              document.getElementById('scroll-msg').style.display = 'none';
            }
          };

        checkOverflow();

        window.addEventListener('resize', checkOverflow);

        return () => window.removeEventListener('resize', checkOverflow);
    }, []);

    const [selectedMode, setSelectedMode] = useState('solo');

    const gameModes = {
        solo: 'Solos',
        duo: 'Doubles',
        trio: '3v3v3v3',
        squad: '4v4v4v4'
    };

    const statCategories = [
        'games_played', 'wins', 'losses', 'kills', 'deaths',
        'beds_broken', 'beds_lost', 'final_kills', 'final_deaths', 'resources_collected'
    ];

    function getStatValue(playerData, gameModeKey, statKey) {
        const modeData = playerData.data[gameModeKey];
        return modeData && modeData[statKey] ? modeData[statKey] : '0';
    };

    function findHighestStats(data, modeKey) {
        let highestStats = {
            wins: 0, beds_broken: 0, kills: 0, final_kills: 0
        };

        data.forEach(player => {
            const modeData = player.data[modeKey];
            Object.keys(highestStats).forEach(stat => {
                const playerStatValue = modeData[stat];
                if (!isNaN(playerStatValue) && playerStatValue > highestStats[stat]) {
                    highestStats[stat] = playerStatValue;
                }
            });
        });

        return highestStats;
    }

    const handleModeChange = (event) => {
        setSelectedMode(event.target.value);
    };

    const highestStats = findHighestStats(playersData, selectedMode);

    return (
        <>
            <div className="mx-auto w-48 mb-8">
                <label htmlFor="game-mode-select" className="block text-center">Select Mode:</label>
                <select id="game-mode-select" className="mt-1 block w-full pl-2 pr-10 py-2 text-sm bg-mc-gray border border-black rounded outline-none" value={selectedMode} onChange={handleModeChange}>
                    {Object.entries(gameModes).map(([key, name]) => (
                        <option key={key} value={key}>{name}</option>
                    ))}
                </select>
            </div>
            <h5 id="scroll-msg" className="text-right text-sm italic mb-2">Scroll to view more</h5>
            <div className="overflow-x-auto">
                <table id="comparison-table" className="mx-auto">
                    <thead className="bg-mc-gray border-b border-gray-400">
                        <tr>
                            <th className="px-4 lg:px-8 py-2 lg:py-4 text-right text-sm font-normal tracking-wider">{gameModes[selectedMode]} Stats</th>
                            {playersData.map(player => (
                                <th key={player.username} className="px-2 lg:px-8 py-2 lg:py-3 text-xs lg:text-inherit text-center font-normal tracking-wider">
                                    <Image
                                        src={avatars[player.data.general.uuid]}
                                        width={32}
                                        height={32}
                                        alt={`Avatar of ${player.username}`}
                                        unoptimized={true}
                                        className="inline-block"
                                    />
                                    <p className="py-1">{player.username}</p>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-gray-300">
                        {statCategories.map((statKey, index) => (
                            <tr key={statKey} className={`${index % 2 === 0 ? 'bg-mc-gray/95' : 'bg-mc-gray/85'}`}>
                                <td className="px-4 lg:px-8 py-2 lg:py-3 whitespace-nowrap text-sm text-right tracking-wider capitalize">{statKey.replace(/_/g, ' ')}</td>
                                {playersData.map(player => {
                                    const currentValue = getStatValue(player, selectedMode, statKey);
                                    const highestValue = highestStats[statKey];
                                    const isHighest = currentValue === highestValue;
                                    return (
                                        <td key={player.username + statKey}
                                            className={`whitespace-nowrap text-center font-medium ${isHighest ? 'text-mc-green' : ''}`}>
                                            {currentValue}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
