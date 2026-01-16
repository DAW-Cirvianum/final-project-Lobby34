import { useState } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(null);
        setError(null);
        try {
            // Laravel expects { email: "..." }
            const res = await api.post('/forgot-password', { email });
            setStatus(res.data.status);
        } catch (err) {
            setError(err.response?.data?.email || "Failed to send link.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-gray-100 p-4">
            <div className="bg-zinc-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-zinc-700">
                <h2 className="text-2xl font-bold mb-4 text-center text-purple-400">Recover Access</h2>
                <p className="text-sm text-zinc-400 mb-6 text-center">Enter your comms frequency (email) to receive a reset code.</p>
                
                {status && <div className="bg-green-900/30 text-green-400 p-3 rounded mb-4 text-sm border border-green-900/50">{status}</div>}
                {error && <div className="bg-red-900/20 text-red-400 p-3 rounded mb-4 text-sm border border-red-900/50">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="commander@example.com"
                        className="w-full bg-zinc-900 border border-zinc-600 rounded p-2 focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder-zinc-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 py-2 rounded font-bold transition shadow-lg shadow-purple-900/20 text-white">
                        Send Link
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Link to="/login" className="text-sm text-zinc-400 hover:text-white transition">Back to Login</Link>
                </div>
            </div>
        </div>
    );
}