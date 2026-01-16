import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { motion } from 'framer-motion';
import { FaBolt, FaShieldAlt } from 'react-icons/fa';

export default function ShipList() {
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/ship-models')
            .then(res => setModels(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const getShipImage = (name) => {
        if (!name) return 'https://static.wikia.nocookie.net/elite-dangerous/images/8/8d/Elite-Dangerous-Ship-Squadron.png';
        if (name.includes('Anaconda')) return 'https://static.wikia.nocookie.net/elite-dangerous/images/a/a4/Anaconda.png';
        if (name.includes('Mandalay')) return 'https://static.wikia.nocookie.net/elite-dangerous/images/8/8e/Mandalay_in_space_ED.jpg';
        if (name.includes('Diamondback')) return 'https://static.wikia.nocookie.net/elite-dangerous/images/a/ae/Diamondback_Explorer_new_default.png';
        if (name.includes('Python MKII'))  return 'https://static.wikia.nocookie.net/elite-dangerous/images/6/6b/Python_MkII_space.jpg';
        return 'https://static.wikia.nocookie.net/elite-dangerous/images/8/8d/Elite-Dangerous-Ship-Squadron.png'
    };

    if (loading) return <div className="text-gray-400 text-center p-10">Accessing Database...</div>;

    return (
        <div className="min-h-screen bg-zinc-900 text-gray-100 p-8">
            <h1 className="text-4xl font-bold mb-2 text-center text-purple-400">Ship Database</h1>
            <p className="text-center text-zinc-400 mb-10">Available chassis configurations</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 container mx-auto">
                {models.map((ship) => (
                    <motion.div 
                        key={ship.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-zinc-800 rounded-xl overflow-hidden shadow-lg border border-zinc-700 hover:border-purple-500 hover:shadow-purple-500/20 transition duration-300"
                    >
                        {/* Ship Image */}
                        <div className="h-48 bg-zinc-950 flex items-center justify-center overflow-hidden relative">
                            <img src={getShipImage(ship.name)} alt={ship.name} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition duration-500" />
                            <div className="absolute bottom-0 left-0 bg-gradient-to-t from-zinc-900 to-transparent w-full p-4 pt-10">
                                <h2 className="text-xl font-bold text-white drop-shadow-md">{ship.name}</h2>
                            </div>
                        </div>

                        {/* Specs Grid */}
                        <div className="p-5">
                            {/* Primary Stats */}
                            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                <div className="bg-zinc-700/30 p-2 rounded flex items-center gap-2 border border-zinc-700/50">
                                    <FaShieldAlt className="text-zinc-500"/>
                                    <div>
                                        <p className="text-zinc-500 text-[10px] font-bold tracking-wider">HULL MASS</p>
                                        <p className="font-mono text-gray-200">{ship.hull_mass} T</p>
                                    </div>
                                </div>
                                <div className="bg-zinc-700/30 p-2 rounded flex items-center gap-2 border border-zinc-700/50">
                                    <FaBolt className="text-purple-500"/>
                                    <div>
                                        <p className="text-zinc-500 text-[10px] font-bold tracking-wider">MAX FSD</p>
                                        <p className="font-mono text-purple-300">Class {ship.max_fsd}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Core Internal Max Classes - Full List */}
                            <div className="pt-3 border-t border-zinc-700">
                                <p className="text-[10px] uppercase text-zinc-500 font-bold mb-2 tracking-widest">Max Core Internals</p>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-400 font-mono">
                                    <div className="flex justify-between"><span>P.Plant:</span> <span className="text-gray-300">Class {ship.max_power_plant}</span></div>
                                    <div className="flex justify-between"><span>Thrusters:</span> <span className="text-gray-300">Class {ship.max_thrusters}</span></div>
                                    <div className="flex justify-between"><span>L.Support:</span> <span className="text-gray-300">Class {ship.max_life_support}</span></div>
                                    <div className="flex justify-between"><span>P.Dist:</span> <span className="text-gray-300">Class {ship.max_power_distributor}</span></div>
                                    <div className="flex justify-between"><span>Sensors:</span> <span className="text-gray-300">Class {ship.max_sensors}</span></div>
                                    <div className="flex justify-between"><span>Fuel:</span> <span className="text-gray-300">Class {ship.max_fuel_tank}</span></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}