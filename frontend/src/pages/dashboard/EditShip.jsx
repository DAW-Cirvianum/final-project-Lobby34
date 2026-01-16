import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
import { motion } from 'framer-motion';

export default function EditShip() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { notifySuccess, notifyError } = useNotification();

    const [ship, setShip] = useState(null);
    const [availableModules, setAvailableModules] = useState([]);
    const [availableFSDs, setAvailableFSDs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedFsd, setSelectedFsd] = useState('');
    const [selectedModules, setSelectedModules] = useState({}); // { slot_id: module_id }

    useEffect(() => {
        const loadData = async () => {
            try {
                // Get Data
                const [shipRes, modsRes] = await Promise.all([
                    api.get(`/my-ships/${id}`),
                    api.get('/modules')
                ]);

                const shipData = shipRes.data.ship_details;
                setShip(shipData);
                setAvailableModules(modsRes.data.modules);
                setAvailableFSDs(modsRes.data.fsds);

                // Initialize Selection State with CURRENT parts
                setSelectedFsd(shipData.fsd_id);
                
                // Convert array of modules into an Object Map
                const currentModMap = {};
                shipData.modules.forEach(m => {
                    currentModMap[m.pivot.installed_slot_index] = m.id;
                });
                setSelectedModules(currentModMap);

            } catch (err) {
                notifyError("Failed to load ship data.");
                navigate('/dashboard/userships');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id, navigate]);

    // HANDLERS
    const handleModuleChange = (slotType, moduleId) => {
        setSelectedModules(prev => ({
            ...prev,
            [slotType]: parseInt(moduleId)
        }));
    };

    const handleSave = async () => {
        try {
            // 1. Format Payload for Backend
            const modulesPayload = Object.entries(selectedModules).map(([slot, modId]) => ({
                slot: parseInt(slot),
                module_id: modId
            }));

            const payload = {
                fsd_id: selectedFsd,
                modules: modulesPayload
            };

            // 2. Send Request
            await api.put(`/my-ships/${id}`, payload);
            
            notifySuccess("Ship configuration saved & calculated!");
            navigate('/dashboard/userships');
        } catch (err) {
            notifyError("Failed to save configuration.");
            console.error(err);
        }
    };

    if (loading || !ship) return <div className="p-10 text-center text-gray-500">Loading Flight Computers...</div>;

    return (
        <div className="container mx-auto p-6 flex flex-col lg:flex-row gap-6">
            
            {/* LEFT: Ship Overview */}
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-full lg:w-1/3">
                <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700 sticky top-24 shadow-2xl">
                    <h1 className="text-3xl font-bold text-purple-400 mb-2">{ship.ship_model.name}</h1>
                    <p className="text-gray-500 text-xs mb-6 font-mono">ID: {ship.id} // OWNER: {ship.user_id}</p>
                    
                    <div className="bg-zinc-900 p-4 rounded mb-6 border border-zinc-700/50">
                        <div className="flex justify-between mb-2 border-b border-zinc-800 pb-2">
                            <span className="text-gray-500 text-sm">Hull Mass</span>
                            <span className="font-mono text-gray-300">{ship.ship_model.hull_mass} T</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Total Mass</span>
                            <span className="font-mono text-xl font-bold text-white">{ship.total_mass} T</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleSave} 
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded font-bold shadow-lg shadow-purple-900/20 transition mb-3"
                    >
                        CONFIRM & LAUNCH
                    </button>
                    <button 
                        onClick={() => navigate('/dashboard/userships')} 
                        className="w-full bg-transparent border border-zinc-600 text-zinc-400 hover:text-white hover:border-zinc-400 py-2 rounded transition"
                    >
                        Cancel
                    </button>
                </div>
            </motion.div>

            {/* RIGHT: Module Slots */}
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-full lg:w-2/3 space-y-6">
                
                {/* Core Internal: Frame Shift Drive */}
                <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700 shadow-md">
                    <h3 className="text-lg font-bold mb-4 text-gray-100 flex items-center justify-between">
                        <span>Frame Shift Drive (FSD)</span>
                        <span className="text-[10px] uppercase tracking-wider bg-zinc-700 px-2 py-1 rounded text-purple-300 border border-zinc-600">
                            Max Class: {ship.ship_model.max_fsd}
                        </span>
                    </h3>
                    
                    <select 
                        className="w-full bg-zinc-900 border border-zinc-600 rounded p-3 text-white focus:border-purple-500 outline-none transition"
                        value={selectedFsd}
                        onChange={(e) => setSelectedFsd(e.target.value)}
                    >
                        {availableFSDs
                            .filter(fsd => fsd.class_number <= ship.ship_model.max_fsd)
                            .map(fsd => (
                                <option key={fsd.id} value={fsd.id}>
                                    Class {fsd.class_number}{fsd.rating_character} - OptMass: {fsd.optimal_mass} - Mass: {fsd.mass}T
                                </option>
                            ))
                        }
                    </select>
                </div>

                {/* 2. Core Internal Modules Loop */}
                <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700 shadow-md">
                    <h3 className="text-lg font-bold mb-6 text-purple-400 border-b border-zinc-700 pb-2">Core Internal Modules</h3>
                    
                    <div className="space-y-5">
                        {[
                            { name: "Power Plant", type: 2, maxClass: ship.ship_model.max_power_plant },
                            { name: "Thrusters", type: 3, maxClass: ship.ship_model.max_thrusters },
                            { name: "Life Support", type: 4, maxClass: ship.ship_model.max_life_support },
                            { name: "Power Distributor", type: 5, maxClass: ship.ship_model.max_power_distributor },
                            { name: "Sensors", type: 6, maxClass: ship.ship_model.max_sensors },
                            { name: "Fuel Tank", type: 7, maxClass: ship.ship_model.max_fuel_tank },
                        ].map((slot, idx) => (
                            <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                                <label className="text-sm text-gray-400 flex flex-col">
                                    <span className="font-semibold text-gray-300">{slot.name}</span>
                                    <span className="text-xs text-zinc-500">Max Class: {slot.maxClass}</span>
                                </label>
                                
                                <div className="md:col-span-2">
                                    <select 
                                        className="w-full bg-zinc-900 border border-zinc-600 rounded p-2 text-white focus:border-purple-500 outline-none transition text-sm"
                                        value={selectedModules[slot.type] || ''} 
                                        onChange={(e) => handleModuleChange(slot.type, e.target.value)}
                                    >
                                        <option value="" disabled>Select Module...</option>
                                        {availableModules
                                            .filter(m => m.slot_type === slot.type)
                                            .filter(m => m.class_number <= slot.maxClass)
                                            .map(m => (
                                                <option key={m.id} value={m.id}>
                                                    {m.class_number}{m.rating_character} (Mass: {m.mass}T)
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </motion.div>
        </div>
    );
}