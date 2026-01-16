export default function ErrorFallback({ error, resetErrorBoundary }) {
    return (
        <div role="alert" className="p-6 bg-zinc-800 border border-red-900/50 rounded-xl text-center my-8 mx-auto max-w-lg shadow-2xl">
            <h2 className="text-xl font-bold text-red-400 mb-2">System Failure</h2>
            
            <div className="bg-black/30 p-4 rounded mb-6 text-left overflow-auto border border-zinc-700">
                <pre className="text-sm text-red-300 whitespace-pre-wrap font-mono">
                    {error.message || "Unknown error occurred"}
                </pre>
            </div>

            <button 
                onClick={resetErrorBoundary} 
                className="px-6 py-2 bg-red-900/80 text-red-100 border border-red-700 rounded hover:bg-red-800 transition font-bold shadow-lg"
            >
                Reboot System (Try Again)
            </button>
        </div>
    );
}