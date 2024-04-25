import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function PlayerTabs({ playersData, avatars }) {

    useEffect(() => {
        // display scroll msg if table overflows
        function checkOverflow() {
            const table = document.getElementById('player-table');
            if (table.offsetWidth > window.innerWidth) {

              document.getElementById('scroll-msg').style.display = 'block';
            } else {
              document.getElementById('scroll-msg').style.display = 'none';
            }
          };

        checkOverflow();

        window.addEventListener('resize', checkOverflow);

        return () => window.removeEventListener('resize', checkOverflow);
    }, []);

    const gameModes = {
        solo: 'Solos',
        duo: 'Doubles',
        trio: '3v3v3v3',
        squad: '4v4v4v4'
    };

    const [activeTab, setActiveTab] = useState(0);
    
    const statCategories = [
        'games_played', 'wins', 'losses', 'kills', 'deaths',
        'beds_broken', 'beds_lost', 'final_kills', 'final_deaths', 'resources_collected'
    ];

    function calculateRatio(numerator, denominator) {
        if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
            return "0";
        } else {
            return (numerator / denominator).toFixed(2);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl md:text-3xl lg:text-4xl mb-8 text-center">Break it down by player.</h1>
            <ul className="flex flex-wrap text-sm text-center border-b border-gray-500">
                {playersData.map((player, index) => (
                    <li key={index} className="mr-2 flex-auto text-center">
                        <button onClick={() => setActiveTab(index)}
                            className={`inline-flex items-center justify-center w-full p-4 rounded-t-lg border-b-2 ${activeTab === index
                                ? 'text-mc-green border-mc-green'
                                : 'border-transparent hover:text-mc-green-dark hover:border-mc-green-dark'} group focus:outline-none relative`}>
                            {avatars[player.data.general.uuid] && (
                                <div className="inline-flex flex-col items-center">
                                    <Image
                                        src={avatars[player.data.general.uuid]}
                                        width={24}
                                        height={24}
                                        alt={`Head of ${player.username}'s avatar`}
                                        unoptimized={true}
                                    />
                                </div>
                            )}
                            <span className="ml-2 mc-font hidden md:block text-sm md:text-base lg:text-xl">{player.username}</span>
                            {activeTab === index && (
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-mc-green"></div>
                            )}
                        </button>
                    </li>
                ))}
            </ul>

            <div className="p-4">
                {playersData.map((player, index) => (
                    <div key={index} className={`grid grid-cols-1 lg:grid-cols-3 gap-4 space-y-8 lg:space-y-0 ${index === activeTab ? 'block' : 'hidden'}`}>
                        <ul className="p-4 bg-mc-gray space-y-2">
                            <h4 className="text-base md:text-xl lg:text-2xl text-center font-semibold mb-4">{player.username}</h4>
                            {player.data.general.uuid && (
                                <Image
                                    src={`https://visage.surgeplay.com/full/128/${player.data.general.uuid}`}
                                    width={128}
                                    height={128}
                                    alt={`Head of ${player.username}'s avatar`}
                                    unoptimized={true}
                                    className="mx-auto"
                                />
                            )}
                            <div className="grid grid-cols-4 gap-1">
                                <div className="text-center">
                                    <p>W/L</p>
                                    <p>{calculateRatio(player.data.general.wins, player.data.general.losses)}</p>
                                </div>
                                <div className="text-center">
                                    <p>BB/BL</p>
                                    <p>{calculateRatio(player.data.general.beds_broken, player.data.general.beds_lost)}</p>
                                </div>
                                <div className="text-center">
                                    <p>K/D</p>
                                    <p>{calculateRatio(player.data.general.kills, player.data.general.deaths)}</p>
                                </div>
                                <div className="text-center">
                                    <p>FK/FD</p>
                                    <p>{calculateRatio(player.data.general.final_kills, player.data.general.final_deaths)}</p>
                                </div>
                            </div>
                            <li>Hypixel Level: {player.data.general.experience}</li>
                            <li>Rank: {player.data.general.rank || "N/A"}</li>
                            <li>Karma: {player.data.general.karma || "0"}</li>
                            <li>Coins: {player.data.general.coins || "0"}</li>
                            <li>Achievement Points: {player.data.general.achievement_points || "0"}</li>
                            <li>Total Kills: {player.data.general.kills || "0"}</li>
                            <li>Total Wins: {player.data.general.wins || "0"}</li>
                            <li>Last Login: {player.data.general.last_login || "Not found"}</li>
                            <li>First Login: {player.data.general.first_login || "Not found"}</li>
                        </ul>
                        <div className=" col-span-2">
                            <h5 id="scroll-msg" className="text-right text-sm italic mb-2 block md:hidden">Scroll to view more</h5>
                            <div className="overflow-x-auto">
                                <table id="player-table" className="w-full divide-y divide-gray-400">
                                    <thead className="bg-mc-gray">
                                        <tr>
                                            <th className="px-4 py-2 text-right text-xs font-medium tracking-wider">All Stats</th>
                                            {Object.entries(gameModes).map(([_, modeVal], index) => (
                                                <th key={index} className="px-6 py-3 text-center text-xs font-medium tracking-wider">
                                                    {modeVal}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-300">
                                        {statCategories.map((stat, statIndex) => (
                                            <tr key={statIndex} className={`${statIndex % 2 === 0 ? 'bg-mc-gray/95' : 'bg-mc-gray/85'}`}>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-right tracking-wider capitalize">
                                                    {stat.replace(/_/g, ' ')}
                                                </td>
                                                {Object.entries(gameModes).map(([modeKey, _], modeIndex) => {
                                                    const modeData = player.data[modeKey];
                                                    const statValue = modeData && modeData[stat] ? modeData[stat] : '0';
                                                    return (
                                                        <td key={`${modeIndex}-${statIndex}`} className="px-4 lg:px-8 py-2 lg:py-4 text-sm text-center"> {statValue} </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};