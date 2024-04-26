import { Instrument_Sans } from 'next/font/google'
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';
import NavBar from '../components/NavBar';
import SearchHistory from '../components/SearchHistory';
import About from '../components/About';
import Footer from '../components/Footer';
import Head from 'next/head';

const instrumentSans = Instrument_Sans({ subsets: ['latin'] })

export default function Home() {
  const [usernames, setUsernames] = useState(['', '']);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // update corresponding username textbox
  function handleUsernameChange(index, value) {
    const updatedUsernames = usernames.map((username, i) =>
      i === index ? value : username
    );
    setUsernames(updatedUsernames);
  };

  function addPlayer() {
    if (usernames.length < 4) {
      setUsernames([...usernames, '']);
    }
  };

  function removePlayer(index) {
    toast.success(`Removed username ${usernames[index]}`);
    setUsernames(usernames.filter((_, i) => i !== index));
  };

  async function compare() {
    setIsLoading(true);

    // check if any of the usernames are empty
    if (usernames.some(username => username.trim() === '')) {
      toast(`Please fill in all usernames`, { icon: '✏️' });
      setIsLoading(false);
      return;
    }

    // check if any of the usernames are duplicates
    if (new Set(usernames).size !== usernames.length) {
      toast.error('Please remove any duplicate usernames.');
      setIsLoading(false);
      return;
    }

    const allValidUsernames = await checkUsernames();
    if (!allValidUsernames) {
      setIsLoading(false);
      return;
    }

    const fetchedPlayerData = await fetchPlayerData();
    if (!fetchedPlayerData) {
      setIsLoading(false);
      return;
    }

    goToCompare();
  }

  async function checkUsernames() {
    // check if usernames are valid
    const invalidUsernames = [];

    for (const uname of usernames) {
      const response = await fetch(`/api/mojang?username=${uname}`);
      const data = await response.json();
      if (data.status === 404) {
        invalidUsernames.push(uname);
      }
      else if (data.status === 429) {
        toast.error(`Too many requests to Mojang API. Please try again later.`);
        return false;
      }
      else if (data.status === 500) {
        toast.error(`Failed to check if username ${uname} is valid.`);
        return false;
      }
    }

    // successfully ran every username against mojang api 

    if (invalidUsernames.length > 0) {
      toast.error(`Invalid username(s): ${invalidUsernames.join(', ')} Please check the spelling and try again.`);
      return false;
    }
    return true;
  };

  async function fetchPlayerData() {
    try {
      let results = []
      let repeatUsernames = [];

      for (const uname of usernames) {
        const response = await fetch(`/api/hypixel?username=${uname}`);
        if (!response.ok) {
          repeatUsernames.push(uname);
          break;
        }
        const data = await response.json();
        results.push({ username: uname, data: data });
      }

      if (repeatUsernames.length > 0) {
        toast.error(`${repeatUsernames.join(', ')} have been searched recently. Please try again in a couple minutes.`);
        return false;
      }

      // successfully got data from hypixel api for all usernames

      // save successful search to local storage
      localStorage.setItem('playerData', JSON.stringify(results));

      // save search to search history
      const existingSearches = JSON.parse(localStorage.getItem('searchHistory')) || [];
      existingSearches.unshift(usernames);
      localStorage.setItem('searchHistory', JSON.stringify(existingSearches));

      return true;
    } catch (error) {
      toast.error("A network error occurred. Please try again later.");
      console.error(error);
      return false;
    }
  }

  function goToCompare() {
    router.push('/compare');
    setIsLoading(false);
  }

  return (
    <main className={`${instrumentSans.className} bg-coal space-y-12 min-h-screen`}>
      <Head>
        <title>Bedwars Benchmark</title>
      </Head>
      <NavBar />
      <section className="max-w-screen-xl mx-auto text-center space-y-12">
        <div className="mt-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-mc-green">Bedwars Benchmark</h1>
        </div>
        <div className="mx-auto max-w-6xl w-fit">
          <p className="p-2">Compare 2 to 4 players and settle the debate of who's the best.</p>
          <div className="flex flex-wrap flex-col lg:flex-row justify-center items-center gap-2 lg:gap-4 p-2">
            {usernames.map((username, index) => (
              <React.Fragment key={index}>

                {index > 0 && <h5 className="text-2xl font-medium mx-1 mc-font">vs.</h5>}

                <div className="relative">
                  <input id={`username-${index}`}
                    type="text"
                    value={username}
                    onChange={(e) => handleUsernameChange(index, e.target.value)}
                    placeholder="Username"
                    className="px-3 py-2 bg-mc-gray border border-black rounded outline-none w-44"
                  />
                  <label htmlFor={`username-${index}`} className="sr-only">Username</label>
                  {usernames.length > 2 && (
                    <button
                      onClick={() => removePlayer(index)}
                      className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-mc-red hover:bg-red-800 text-white font-bold p-1 rounded-full text-xs"
                      aria-label={username.trim() ? `Remove username '${username}'` : 'Remove username input'}
                    >
                      {/* SVG from heroicons.com */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                      <span className="sr-only">Remove username {username}</span>
                    </button>
                  )}
                </div>

              </React.Fragment>
            ))}

            {usernames.length < 4 && (
              <button aria-label="Add player input" onClick={addPlayer} className="py-1 px-1 rounded-lg text-mc-green border-2 border-mc-green hover:border-mc-green-dark hover:text-mc-green-dark">
                {/* SVG from heroicons.com */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span className="sr-only">Add player input</span>
              </button>
            )}
          </div>
          {isLoading ? (
            <div role="status" className="flex justify-center items-center my-7">
              <svg aria-hidden="true" className="w-8 h-8 text-mc-green animate-spin fill-mc-green-dark" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>

          ) : (
            <button onClick={compare} className={`mt-4 font-medium py-2 px-4 rounded text-mc-green border-2 border-mc-green hover:border-mc-green-dark hover:text-mc-green-dark`}>
              Compare
            </button>
          )}

          <Toaster
            position="top-center"
            reverseOrder={true}
            toastOptions={{
              style: {
                borderRadius: '12px',
                background: '#404040',
                color: '#FFF5EA',
              },
            }}
          />
        </div>
      </section>

      <div className="max-w-5xl mx-auto">
        <SearchHistory />
      </div>

      <section className="max-w-5xl mx-auto">
        <About />
      </section>

      <Footer />
    </main>
  );
}
