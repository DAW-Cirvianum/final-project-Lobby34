import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSpaceShuttle, FaUserCircle, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const { token, user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-zinc-900 border-b border-zinc-800 text-white sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter hover:text-purple-400 transition">
                    <FaSpaceShuttle className="text-purple-500" />
                    <span>EliteManager</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    <Link to="/ships" className="text-gray-300 hover:text-white transition font-medium">Database</Link>
                    
                    {token ? (
                        <>
                            <Link to="/dashboard/userships" className="text-gray-300 hover:text-white transition font-medium">Hangar</Link>
                            {user?.role_id === 1 && (
                                <Link to="/admin/create-ship" className="text-purple-400 hover:text-purple-300 transition font-medium">Admin</Link>
                            )}
                            
                            <div className="h-6 w-px bg-zinc-700 mx-2"></div>
                            
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-gray-400">CMDR {user?.name}</span>
                                <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition" title="Logout">
                                    <FaSignOutAlt size={18} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* --- UPDATED LINKS HERE (White Text) --- */}
                            <Link to="/login" className="text-gray-300 hover:text-white transition font-medium">
                                Login
                            </Link>
                            <Link 
                                to="/register" 
                                className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-full font-bold transition shadow-lg shadow-purple-900/20"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-gray-300 hover:text-white" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-zinc-800 border-t border-zinc-700 overflow-hidden"
                    >
                        <div className="flex flex-col p-4 space-y-4">
                            <Link to="/ships" className="text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Database</Link>
                            
                            {token ? (
                                <>
                                    <Link to="/dashboard/userships" className="text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Hangar</Link>
                                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-red-400 text-left">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Login</Link>
                                    <Link to="/register" className="text-purple-400 font-bold" onClick={() => setIsOpen(false)}>Register</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}