'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function TournamentDownload() {
  const [tournamentId, setTournamentId] = useState('');
  const [downloadAll, setDownloadAll] = useState(true);
  const [downloadRound, setDownloadRound] = useState(false);
  const [roundId, setRoundId] = useState<number | ''>('');
  const [downloadGame, setDownloadGame] = useState(false);
  const [gameId, setGameId] = useState<number | ''>('');

  async function handleDownload() {
    if (!tournamentId.trim()) return;

    let url = `/api/${tournamentId}/download`;
    if (downloadAll) {
      url += `/all`;
    } else if (downloadRound) {
      url += `/${roundId}`;
      if (downloadGame) {
        url += `/${gameId}`;
      }
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error();
      }
      const blob = await response.blob();
      let fileName = response.headers.get('Content-Disposition')?.split('=')[1];
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${fileName}.pgn`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      alert('Something wrong');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Download Pgn From view.livechesscloud
      </h2>
      <Image src={'/help.webp'} alt='Help' unoptimized width={500} height={140}/>
      <div className="mt-2 mb-4 w-full max-w-md">
        <label className="block text-gray-700">Tournament ID:</label>
        <input
          type="text"
          value={tournamentId}
          onChange={(e) => setTournamentId(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div className="mb-4 w-full max-w-md">
        <label className="inline-flex items-center text-gray-700">
          <input
            type="checkbox"
            checked={downloadAll}
            onChange={() => {
              setDownloadAll(!downloadAll);
              setDownloadRound(false);
              setDownloadGame(false);
              setRoundId('');
              setGameId('');
            }}
            className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
          />
          <span className="ml-2">Download All</span>
        </label>
      </div>
      <div className="mb-4 w-full max-w-md">
        <label className="inline-flex items-center text-gray-700">
          <input
            type="checkbox"
            checked={downloadRound}
            onChange={() => {
              setDownloadRound(!downloadRound);
              setDownloadAll(false);
              setDownloadGame(false);
              setGameId('');
            }}
            className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
          />
          <span className="ml-2">Download Round</span>
        </label>
        {downloadRound && (
          <div className="mt-2">
            <label className="block text-gray-700">Round ID:</label>
            <input
              type="number"
              value={roundId}
              min={1}
              onChange={(e) => setRoundId(e.target.valueAsNumber)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <div className="mt-4">
              <label className="inline-flex items-center text-gray-700">
                <input
                  type="checkbox"
                  checked={downloadGame}
                  onChange={() => setDownloadGame(!downloadGame)}
                  className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                />
                <span className="ml-2">Include Game</span>
              </label>
              {downloadGame && (
                <div className="mt-2">
                  <label className="block text-gray-700">Game ID:</label>
                  <input
                    type="number"
                    value={gameId}
                    min={1}
                    onChange={(e) => setGameId(e.target.valueAsNumber)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <button
        onClick={handleDownload}
        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Download
      </button>
    </div>
  );
}
