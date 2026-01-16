import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const token = searchParams.get('token');
    const emailParam = searchParams.get('email');

    const [email, setEmail] = useState(emailParam || '');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await api.post('/reset-password', {
                token,
                email,
                password,
                password_confirmation: passwordConfirmation
            });
            setStatus(res.data.status);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Reset failed. Token may be expired.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-gray-100 p-4">
            <div className="bg-zinc-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-zinc-700">
                <h2 className="text-2xl font-bold mb-6 text-center text-purple-400">Set New Credentials</h2>

                {status ? (
                    <div className="bg-green-900/30 text-green-400 p-4 rounded text-center border border-green-900/50">
                        {status} <br/> <span className="text-sm text-gray-400">Redirecting to login...</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded border border-red-900/50">{error}</div>}
                        
                        <div>
                            <label className="block text-xs text-zinc-500 mb-1 uppercase tracking-wider font-bold">Account Email</label>
                            <input 
                                type="email" 
                                value={email} 
                                readOnly 
                                className="w-full bg-zinc-900/50 border border-zinc-700 rounded p-2 text-zinc-500 cursor-not-allowed outline-none" 
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm text-zinc-400 mb-1">New Password</label>
                            <input 
                                type="password" 
                                placeholder="••••••"
                                className="w-full bg-zinc-900 border border-zinc-600 rounded p-2 focus:ring-2 focus:ring-purple-500 outline-none text-white transition placeholder-zinc-600"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-zinc-400 mb-1">Confirm Password</label>
                            <input 
                                type="password" 
                                placeholder="••••••"
                                className="w-full bg-zinc-900 border border-zinc-600 rounded p-2 focus:ring-2 focus:ring-purple-500 outline-none text-white transition placeholder-zinc-600"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-purple-600 hover:bg-purple-500 py-2 rounded font-bold transition shadow-lg shadow-purple-900/20 text-white"
                        >
                            Reset Password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}