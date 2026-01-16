import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { FaTools, FaMicrochip } from 'react-icons/fa';

export default function EditShipModal({ ship, onClose, onSave }) {
    // Accessibility: Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-zinc-800 text-gray-100 rounded-lg shadow-2xl w-full max-w-md border border-zinc-700 overflow-hidden"
            >
                {/* Header */}
                <div className="bg-zinc-900 p-4 border-b border-zinc-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-purple-400 flex items-center gap-2">
                        <FaTools /> Engineering Bay
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">&times;</button>
                </div>

                <div className="p-6">
                    <h3 className="text-lg font-bold mb-2 text-white">{ship.ship_model.name}</h3>
                    
                    <div className="bg-zinc-900/50 p-4 rounded mb-6 text-sm text-gray-300 space-y-2 border border-zinc-700/50">
                        <p className="flex justify-between">
                            <span>Current Mass:</span> 
                            <span className="text-purple-200 font-mono">{ship.total_mass} T</span>
                        </p>
                        <p className="flex justify-between">
                            <span>Installed FSD:</span> 
                            <span className="text-white font-mono">Class {ship.fsd.class_number}{ship.fsd.rating_character}</span>
                        </p>
                    </div>

                    <p className="text-gray-400 text-sm mb-2 flex gap-3">
                        <FaMicrochip className="text-3xl text-purple-500 shrink-0" />
                        <span>
                            To swap internal modules or upgrade the FSD, you must access the Full Engineering Interface.
                        </span>
                    </p>
                </div>
                
                {/* Footer */}
                <div className="bg-zinc-900 p-4 flex justify-end gap-3 border-t border-zinc-700">
                    <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white transition">
                        Close
                    </button>
                    {/* The Save button triggers the redirect in the parent component */}
                    <button 
                        onClick={() => onSave(ship)} 
                        className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-500 transition font-bold shadow-lg shadow-purple-900/20 text-white"
                    >
                        Open Full Interface
                    </button>
                </div>
            </motion.div>
        </div>
    );
}