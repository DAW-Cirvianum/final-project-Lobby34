import { Link } from "react-router-dom";

export default function ErrorPage({ title, message }) {
    // Default to a 404 "Not Found" state if no props are passed
    const displayTitle = title || "404";
    const displayMessage = message || "We couldn't locate that sector in our star charts.";

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-zinc-950 text-gray-100 text-center p-4">
            <h1 className="text-6xl font-bold text-purple-500 mb-4">{displayTitle}</h1>
            <p className="text-xl mb-4 text-zinc-300">System Alert</p>
            <p className="text-zinc-500 italic mb-8 font-mono bg-zinc-900 px-4 py-2 rounded border border-zinc-800">
                {displayMessage}
            </p>
            <Link 
                to="/ships" 
                className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded font-bold transition shadow-lg shadow-purple-900/20"
            >
                Return to Base
            </Link>
        </div>
    );
}