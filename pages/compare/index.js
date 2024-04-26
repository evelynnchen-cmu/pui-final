import React, { useState, useEffect } from 'react';
import RatioViews from '@/components/RatioViews';
import ComparisonTable from '@/components/ComparisonTable';
import PlayerTabs from '@/components/PlayerTabs';
import Footer from '@/components/Footer';
import Head from 'next/head';

export default function Compare() {
  const [playersData, setPlayersData] = useState([]);
  const [avatars, setAvatars] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDataAndAvatars() {

      // retrieve player data from localStrorage 
      const data = localStorage.getItem('playerData');
      let players = [];
      if (data) {
        players = JSON.parse(data);
        setPlayersData(players);
      }

      // grab player avatar heads
      const newAvatars = {};
      if (players.length > 0) {
        await Promise.all(players.map(async (player) => {
          const uuid = player.data.general.uuid;
          const avatarURL = `https://visage.surgeplay.com/face/128/${uuid}`;
          newAvatars[uuid] = avatarURL;
        }));
        setAvatars(newAvatars);
      }

      setLoading(false);
    }

    fetchDataAndAvatars();
  }, []);

  if (loading || playersData.length === 0 || Object.keys(avatars).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-coal">
      <Head>
        <title>Bedwars Benchmark - Compare Players</title>
      </Head>
      <a href="/" className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
        </svg>
        <span className="sr-only">back to home</span>
      </a>
      
      <div className="mx-8 space-y-8">
        <RatioViews playersData={playersData} avatars={avatars} />
        <ComparisonTable playersData={playersData} avatars={avatars} />
        <PlayerTabs playersData={playersData} avatars={avatars} />
        <Footer />
      </div>
    </div>
  );
}