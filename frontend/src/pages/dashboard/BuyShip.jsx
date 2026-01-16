import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaRocket } from 'react-icons/fa';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';

export default function BuyShip() {
    const navigate = useNavigate();
    const { notifySuccess, notifyError } = useNotification();
    
    const [models, setModels] = useState([]);
    const [fsds, setFsds] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedModel, setSelectedModel] = useState(null);
    const [selectedFsdId, setSelectedFsdId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [modelsRes, modulesRes] = await Promise.all([
                    api.get('/ship-models'),
                    api.get('/modules')
                ]);
                setModels(modelsRes.data);
                setFsds(modulesRes.data.fsds);
            } catch (error) {
                notifyError("Connection to Shipyard failed.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handlePurchase = async () => {
        if (!selectedModel || !selectedFsdId) return;

        try {
            await api.post('/my-ships', {
                ship_model_id: selectedModel.id,
                fsd_id: selectedFsdId
            });
            notifySuccess(`Purchased ${selectedModel.name}! Delivering to Hangar...`);
            navigate('/dashboard/userships');
        } catch (err) {
            notifyError("Purchase failed. Server error.");
        }
    };

    // Image helper
    const getShipImage = (name) => {
        if (name.includes('Anaconda')) return 'https://static.wikia.nocookie.net/elite-dangerous/images/7/7b/Anaconda_-_Front_Right.png';
        if (name.includes('Mandalay')) return 'https://static.wikia.nocookie.net/elite-dangerous/images/2/23/Mandalay_Render_2.jpg';
        if (name.includes('Diamondback')) return 'https://static.wikia.nocookie.net/elite-dangerous/images/a/a2/Diamondback_Explorer_-_Front.png';
        return 'https://static.wikia.nocookie.net/elite-dangerous/images/5/50/Python_-_Front_Right.png';
    };

    if (loading) return <div className="p-10 text-center text-gray-400">Loading Catalog...</div>;

    return (
        <div className="container mx-auto p-6 flex flex-col lg:flex-row gap-6">
            
            {/* LEFT: Ship Grid */}
            <div className="w-full lg:w-2/3">
                <h1 className="text-3xl font-bold mb-6 text-purple-400 flex items-center gap-2">
                    <FaRocket /> Acquire New Vessel
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {models.map((ship) => (
                        <motion.div 
                            key={ship.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => { setSelectedModel(ship); setSelectedFsdId(''); }}
                            className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all bg-zinc-800 ${
                                selectedModel?.id === ship.id 
                                    ? 'border-purple-500 shadow-lg shadow-purple-900/50' 
                                    : 'border-zinc-700 hover:border-zinc-500'
                            }`}
                        >
                            <div className="h-48 bg-black/40 flex items-center justify-center overflow-hidden">
                                <img src={getShipImage(ship.name)} alt={ship.name} className="w-full h-full object-cover opacity-90" />
                            </div>
                            <div className="p-4">
                                <h2 className="font-bold text-lg text-gray-100">{ship.name}</h2>
                                <p className="text-sm text-gray-400">Hull Mass: {ship.hull_mass}T</p>
                            </div>
                            {selectedModel?.id === ship.id && (
                                <div className="absolute top-3 right-3 text-purple-400 bg-zinc-900/80 rounded-full p-1 backdrop-blur-sm">
                                    <FaCheckCircle size={24} />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* RIGHT: Config Panel */}
            <div className="w-full lg:w-1/3">
                <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700 sticky top-24 shadow-2xl">
                    <h2 className="text-xl font-bold mb-4 text-gray-100">Order Summary</h2>

                    {selectedModel ? (
                        <div className="space-y-6">
                            <div className="bg-zinc-900 p-4 rounded border border-zinc-600">
                                <p className="text-gray-500 text-xs uppercase font-bold">Selected Chassis</p>
                                <p className="text-2xl font-bold text-purple-400">{selectedModel.name}</p>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Required: Frame Shift Drive</label>
                                <select 
                                    className="w-full bg-zinc-900 border border-zinc-600 rounded p-3 focus:ring-2 focus:ring-purple-500 outline-none text-white"
                                    value={selectedFsdId}
                                    onChange={(e) => setSelectedFsdId(e.target.value)}
                                >
                                    <option value="" disabled>-- Select FSD --</option>
                                    {fsds
                                        .filter(fsd => fsd.class_number <= selectedModel.max_fsd)
                                        .map(fsd => (
                                            <option key={fsd.id} value={fsd.id}>
                                                Class {fsd.class_number}{fsd.rating_character} (Mass: {fsd.mass}T)
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>

                            <button 
                                onClick={handlePurchase}
                                disabled={!selectedFsdId}
                                className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded font-bold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20"
                            >
                                CONFIRM PURCHASE
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed border-zinc-700 rounded-lg">
                            <p className="text-gray-500">Select a ship model from the catalog to begin configuration.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}