import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(username, password);
        if (success) {
            navigate('/dashboard/userships');
        } else {
            setError('Invalid credentials. Try Lobby / 1234');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-gray-100 p-4">
            <div className="bg-zinc-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-zinc-700">
                <h2 className="text-2xl font-bold mb-6 text-center text-purple-400">Elite Manager Login</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-1 text-sm">Username</label>
                        <input
                            type="text"
                            className="w-full bg-zinc-900 border border-zinc-600 p-2 rounded focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder-zinc-500 transition"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="e.g. Lobby"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1 text-sm">Password</label>
                        <input
                            type="password"
                            className="w-full bg-zinc-900 border border-zinc-600 p-2 rounded focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder-zinc-500 transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="e.g. 1234"
                        />
                    </div>
                    
                    {error && <p className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded border border-red-900/50">{error}</p>}
                    
                    <button 
                        type="submit" 
                        className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-500 transition font-bold shadow-lg shadow-purple-900/20"
                    >
                        Login
                    </button>
                    
                    <div className="text-right mt-2">
                        <Link to="/forgot-password" className="text-sm text-zinc-400 hover:text-purple-400 transition">Forgot Password?</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}