import { useState } from 'react';
import api from '../../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // We auto-login after register

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/register', formData);
            // Auto login after success
            await login(formData.name, formData.password);
            navigate('/dashboard/userships');
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-gray-100 p-4">
            <div className="bg-zinc-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-zinc-700">
                <h2 className="text-3xl font-bold mb-6 text-center text-purple-400">Join the Galaxy</h2>
                
                {error && <div className="bg-red-900/20 text-red-400 p-3 rounded mb-4 text-sm border border-red-900/50">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-zinc-400 mb-1">Commander Name</label>
                        <input 
                            type="text" 
                            required 
                            className="w-full bg-zinc-900 border border-zinc-600 rounded p-2 focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder-zinc-500 transition"
                            onChange={e => setFormData({...formData, name: e.target.value})} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-zinc-400 mb-1">Email Frequency</label>
                        <input 
                            type="email" 
                            required 
                            className="w-full bg-zinc-900 border border-zinc-600 rounded p-2 focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder-zinc-500 transition"
                            onChange={e => setFormData({...formData, email: e.target.value})} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-zinc-400 mb-1">Security Code (Password)</label>
                        <input 
                            type="password" 
                            required 
                            className="w-full bg-zinc-900 border border-zinc-600 rounded p-2 focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder-zinc-500 transition"
                            onChange={e => setFormData({...formData, password: e.target.value})} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-zinc-400 mb-1">Confirm Code</label>
                        <input 
                            type="password" 
                            required 
                            className="w-full bg-zinc-900 border border-zinc-600 rounded p-2 focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder-zinc-500 transition"
                            onChange={e => setFormData({...formData, password_confirmation: e.target.value})} 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full bg-purple-600 hover:bg-purple-500 py-2 rounded font-bold transition shadow-lg shadow-purple-900/20 text-white"
                    >
                        Register
                    </button>
                </form>
                
                <div className="mt-4 text-center text-sm text-zinc-500">
                    Already a Commander? <Link to="/login" className="text-purple-400 hover:text-purple-300 transition">Login here</Link>
                </div>
            </div>
        </div>
    );
}