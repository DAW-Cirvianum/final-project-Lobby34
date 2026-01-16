import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaTimes } from 'react-icons/fa';
import api from '../api/axios';

export default function BuyShipModal({ onClose, onPurchase }) {
    const [models, setModels] = useState([]);
    const [fsds, setFsds] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [selectedModelId, setSelectedModelId] = useState('');
    const [selectedFsdId, setSelectedFsdId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [modelsRes, modulesRes] = await Promise.all([
                    api.get('/ship-models'), // Public endpoint
                    api.get('/modules')      // Protected endpoint
                ]);
                setModels(modelsRes.data);
                setFsds(modulesRes.data.fsds);
            } catch (error) {
                console.error("Failed to load shipyard data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Helper to find currently selected model object
    const selectedModel = models.find(m => m.id === parseInt(selectedModelId));

    const handleSubmit = () => {
        if (!selectedModelId || !selectedFsdId) return;
        onPurchase({
            ship_model_id: selectedModelId,
            fsd_id: selectedFsdId
        });
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-zinc-800 text-gray-100 rounded-xl shadow-2xl w-full max-w-lg border border-zinc-700 overflow-hidden"
            >
                {/* Header */}
                <div className="bg-zinc-900 p-4 border-b border-zinc-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-purple-400">
                        <FaRocket /> Acquire New Ship
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <FaTimes />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {loading ? (
                        <p className="text-center text-gray-400">Contacting Shipyard...</p>
                    ) : (
                        <>
                            {/* 1. Select Chassis */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Select Ship Model</label>
                                <select 
                                    className="w-full bg-zinc-900 border border-zinc-600 rounded p-3 focus:ring-2 focus:ring-purple-500 outline-none text-white"
                                    value={selectedModelId}
                                    onChange={(e) => {
                                        setSelectedModelId(e.target.value);
                                        setSelectedFsdId(''); // Reset FSD when ship changes
                                    }}
                                >
                                    <option value="" disabled>-- Choose a Chassis --</option>
                                    {models.map(m => (
                                        <option key={m.id} value={m.id}>{m.name} (Hull: {m.hull_mass}T)</option>
                                    ))}
                                </select>
                            </div>

                            {/* 2. Select FSD (Only shows if model selected) */}
                            {selectedModel && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                    <label className="block text-sm text-gray-400 mb-2">
                                        Select Frame Shift Drive 
                                        <span className="ml-2 text-xs bg-zinc-700 px-2 py-0.5 rounded text-purple-300">
                                            Max Class: {selectedModel.max_fsd}
                                        </span>
                                    </label>
                                    <select 
                                        className="w-full bg-zinc-900 border border-zinc-600 rounded p-3 focus:ring-2 focus:ring-purple-500 outline-none text-white"
                                        value={selectedFsdId}
                                        onChange={(e) => setSelectedFsdId(e.target.value)}
                                    >
                                        <option value="" disabled>-- Install FSD --</option>
                                        {fsds
                                            .filter(fsd => fsd.class_number <= selectedModel.max_fsd) // Filter valid sizes
                                            .map(fsd => (
                                                <option key={fsd.id} value={fsd.id}>
                                                    Class {fsd.class_number}{fsd.rating_character} (Range Opt: {fsd.optimal_mass})
                                                </option>
                                            ))
                                        }
                                    </select>
                                </motion.div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="bg-zinc-900 p-4 flex justify-end gap-3 border-t border-zinc-700">
                    <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white transition">Cancel</button>
                    <button 
                        onClick={handleSubmit}
                        disabled={!selectedModelId || !selectedFsdId}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-purple-900/20"
                    >
                        Purchase & Add to Hangar
                    </button>
                </div>
            </motion.div>
        </div>
    );
}