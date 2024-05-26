import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <span className="text-lg font-semibold text-gray-700 mb-4">Nothing to see here... yet</span>
      <span>Go to <Link className='text-blue-500 hover:text-blue-700' href={'/download'}>/download</Link></span>
    </div>
  );
}