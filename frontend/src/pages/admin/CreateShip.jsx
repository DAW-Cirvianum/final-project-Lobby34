import { useState } from 'react';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function CreateShip() {
    const { notifySuccess, notifyError } = useNotification();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '',
        hull_mass: '',
        max_power_plant: 1,
        max_thrusters: 1,
        max_fsd: 1,
        max_life_support: 1,
        max_power_distributor: 1,
        max_sensors: 1,
        max_fuel_tank: 1
    });

    // Handle standard inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await api.post('/ship-models', formData);
            notifySuccess(`Prototype ${formData.name} registered successfully!`);
            navigate('/dashboard/buy-ship'); // Go to showroom to see it
        } catch (err) {
            console.error(err);
            notifyError(err.response?.data?.message || "Failed to create ship model.");
        }
    };

    return (
        <div className="min-h-screen bg-zinc-900 text-gray-100 p-6 flex justify-center">
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-3xl bg-zinc-800 p-8 rounded-lg border border-zinc-700 shadow-2xl"
            >
                <div className="border-b border-zinc-700 pb-4 mb-6">
                    <h1 className="text-3xl font-bold text-purple-400">Admin Console: Ship Prototyping</h1>
                    <p className="text-gray-400">Register a new chassis configuration into the database.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-1">Model Name</label>
                            <input 
                                name="name"
                                type="text" 
                                placeholder="e.g. Krait MkII"
                                className="w-full bg-zinc-900 border border-zinc-600 rounded p-2 focus:border-purple-500 outline-none text-white placeholder-zinc-500"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-1">Hull Mass (T)</label>
                            <input 
                                name="hull_mass"
                                type="number" 
                                placeholder="e.g. 320"
                                className="w-full bg-zinc-900 border border-zinc-600 rounded p-2 focus:border-purple-500 outline-none text-white placeholder-zinc-500"
                                value={formData.hull_mass}
                                onChange={handleChange}
                                required
                                min="1"
                            />
                        </div>
                    </div>

                    {/* Slot Configuration */}
                    <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-700 shadow-inner">
                        <h3 className="font-bold text-lg text-purple-400 mb-4">Core Internal Slot Sizes</h3>
                        <p className="text-xs text-gray-500 mb-4">Define the maximum class size (1-8) for each component slot.</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Power Plant', name: 'max_power_plant' },
                                { label: 'Thrusters', name: 'max_thrusters' },
                                { label: 'Frame Shift Drive', name: 'max_fsd' },
                                { label: 'Life Support', name: 'max_life_support' },
                                { label: 'Power Distributor', name: 'max_power_distributor' },
                                { label: 'Sensors', name: 'max_sensors' },
                                { label: 'Fuel Tank', name: 'max_fuel_tank' },
                            ].map((slot) => (
                                <div key={slot.name}>
                                    <label className="block text-xs uppercase text-gray-400 font-semibold mb-1">
                                        {slot.label}
                                    </label>
                                    <select 
                                        name={slot.name}
                                        className="w-full bg-zinc-800 border border-zinc-600 rounded p-1 text-sm text-center focus:border-purple-500 outline-none text-white"
                                        value={formData[slot.name]}
                                        onChange={handleChange}
                                    >
                                        {[1,2,3,4,5,6,7,8].map(n => (
                                            <option key={n} value={n}>Class {n}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end pt-4">
                        <button 
                            type="submit" 
                            className="bg-purple-600 text-white px-8 py-3 rounded font-bold hover:bg-purple-500 transition shadow-lg shadow-purple-900/20 flex items-center gap-2"
                        >
                            <span>Launch Prototype</span>
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}