import Image from 'next/image';
import React from 'react';

export default function RatioViews({ playersData, avatars }) {

    function calculateRatio(numerator, denominator) {
        if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
            return "0";
        } else {
            return (numerator / denominator).toFixed(2);
        }
    };

    return (
        <div className="text-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl my-6 lg:my-12">Don't be shy, the stats don't lie.</h1>
            <div className="flex flex-col lg:flex-row justify-around items-center mb-8 w-fit mx-auto">
                {playersData.map((player, index) => (
                    <React.Fragment key={player.username}>
                        <div className="flex flex-col items-center flex-1 mb-4 md:mb-0 space-y-2">
                            {avatars[player.data.general.uuid] && (
                                <div className="inline-flex flex-col items-center">
                                    <Image
                                        src={avatars[player.data.general.uuid]}
                                        width={64}
                                        height={64}
                                        alt={`Head of ${player.username}'s avatar`}
                                        unoptimized={true}
                                        className="mx-auto"
                                    />
                                </div>
                            )}
                            <h3 className="font-semibold text-2xl lg:text-3xl">{player.username}</h3>
                            <div className="grid grid-cols-4 gap-1 text-base pt-4">
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
                        </div>
                        {index < playersData.length - 1 && (
                            <span className="text-2xl font-medium mx-6 my-4 mc-font">vs.</span>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}