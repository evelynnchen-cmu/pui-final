import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function SearchHistory() {
    const [searchHistory, setSearchHistory] = useState([]);

    function clearHistory() {
        localStorage.removeItem('searchHistory');
        setSearchHistory([]);
        toast.success("Cleared search history");
    }

    useEffect(() => {
        const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        setSearchHistory(history);
    }, []);

    return (
        <div className="max-w-screen-xl mx-4">
            <div className="flex flex-row items-center mb-2">
                <h3 className="text-left font-medium text-xl">Recent Searches</h3>
                <span onClick={clearHistory} className="ml-2 text-underline cursor-pointer text-mc-green hover:text-mc-green-dark text-sm">
                    Clear History
                </span>
            </div>
            <ul className="flex flex-row flex-wrap gap-2 justify-start text-xs">
                {searchHistory.map((searchGroup, index) => (
                    <li className="border border-black bg-mc-gray rounded-md px-4 py-2" key={index}>
                        {searchGroup.join(', ')}
                    </li>
                ))}
            </ul>
        </div>
    );
}
