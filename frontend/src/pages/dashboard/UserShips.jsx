import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit, FaSearch } from 'react-icons/fa';

// Animation Variants
const slideVariants = {
    enter: (direction) => ({
        x: direction > 0 ? 500 : -500,
        opacity: 0
    }),
    center: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: (direction) => ({
        x: direction < 0 ? 500 : -500,
        opacity: 0,
        transition: { duration: 0.3, ease: "easeIn" }
    })
};

export default function UserShips() {
    const [ships, setShips] = useState([]);
    const [filteredShips, setFilteredShips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { notifySuccess, notifyError } = useNotification();
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [direction, setDirection] = useState(0); 
    const itemsPerPage = 5;

    const getShipImage = (name) => {
        if (!name) return 'https://static.wikia.nocookie.net/elite-dangerous/images/8/8d/Elite-Dangerous-Ship-Squadron.png';
        if (name.includes('Anaconda')) return 'https://static.wikia.nocookie.net/elite-dangerous/images/a/a4/Anaconda.png';
        if (name.includes('Mandalay')) return 'https://static.wikia.nocookie.net/elite-dangerous/images/8/8e/Mandalay_in_space_ED.jpg';
        if (name.includes('Diamondback')) return 'https://static.wikia.nocookie.net/elite-dangerous/images/a/ae/Diamondback_Explorer_new_default.png';
        return 'https://static.wikia.nocookie.net/elite-dangerous/images/6/6b/Python_MkII_space.jpg';
    };

    const fetchShips = async () => {
        try {
            setLoading(true);
            const res = await api.get('/my-ships');
            setShips(res.data);
            setFilteredShips(res.data);
        } catch (err) {
            notifyError("Failed to load hangar data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchShips(); }, []);

    useEffect(() => {
        const results = ships.filter(ship =>
            ship.ship_model.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredShips(results);
        setCurrentPage(1);
        setDirection(0); 
    }, [searchTerm, ships]);

    const handleDelete = async (shipId, shipName) => {
        if (!window.confirm(`Are you sure you want to sell the ${shipName}?`)) return;
        try {
            await api.delete(`/my-ships/${shipId}`);
            const updatedShips = ships.filter(s => s.id !== shipId);
            setShips(updatedShips);
            setFilteredShips(updatedShips);
            notifySuccess(`${shipName} sold.`);
        } catch (err) { notifyError("Sale failed."); }
    };

    const paginate = (newDirection) => {
        setDirection(newDirection);
        setCurrentPage(prev => prev + newDirection);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentShips = filteredShips.slice(indexOfFirstItem, indexOfLastItem);

    if (loading) return <div className="p-10 text-center text-zinc-500">Scanning Hangar...</div>;

    return (
        <div className="container mx-auto p-6 overflow-hidden">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-100">My Hangar</h1>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <FaSearch className="absolute left-3 top-3 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search ships..."
                            className="w-full bg-zinc-800 border border-zinc-700 text-white pl-10 p-2 rounded focus:ring-2 focus:ring-purple-500 outline-none placeholder-zinc-500 transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => navigate('/dashboard/buy-ship')}
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition font-semibold whitespace-nowrap shadow-lg shadow-purple-900/20"
                    >
                        + Acquire Ship
                    </button>
                </div>
            </div>

            {filteredShips.length === 0 ? (
                <div className="text-center py-12 bg-zinc-800/50 border-2 border-dashed border-zinc-700 rounded-lg">
                    <p className="text-zinc-400 mb-4">No ships found in hangar.</p>
                    <button onClick={() => navigate('/dashboard/buy-ship')} className="text-purple-400 font-semibold hover:underline">
                        Visit Shipyard
                    </button>
                </div>
            ) : (
                <div className="relative min-h-[400px]">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentPage} 
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
                        >
                            {currentShips.map(ship => (
                                <div
                                    key={ship.id}
                                    className="bg-zinc-800 rounded-xl shadow-lg border border-zinc-700 hover:border-purple-500/50 transition relative group flex flex-col overflow-hidden"
                                >
                                    <div className="h-32 bg-black/50 relative">
                                        <img 
                                            src={getShipImage(ship.ship_model.name)} 
                                            alt={ship.ship_model.name} 
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-800 via-transparent to-transparent"></div>
                                        
                                        {/* Sell Button*/}
                                        <button
                                            onClick={() => handleDelete(ship.id, ship.ship_model.name)}
                                            className="absolute top-2 right-2 text-zinc-400 hover:text-red-500 bg-black/50 rounded-full p-2 backdrop-blur-sm transition"
                                            title="Sell Ship"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>

                                    <div className="p-5 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-3">
                                            <h2 className="text-lg font-bold text-gray-100 truncate w-full" title={ship.ship_model.name}>
                                                {ship.ship_model.name}
                                            </h2>
                                        </div>

                                        <div className="space-y-1 text-sm text-gray-400 mb-4 flex-grow">
                                            <p className="flex justify-between border-b border-zinc-700 pb-1 mb-1">
                                                <span>Total Mass:</span> 
                                                <span className="font-mono text-purple-300">{ship.total_mass}T</span>
                                            </p>
                                            
                                            {/* ADDED: Jump Range Display */}
                                            <p className="flex justify-between border-b border-zinc-700 pb-1 mb-1">
                                                <span>Jump Range:</span> 
                                                <span className="font-mono text-cyan-400">
                                                    {ship.jump_range ? parseFloat(ship.jump_range).toFixed(2) : 0} Ly
                                                </span>
                                            </p>

                                            <p className="flex justify-between">
                                                <span>FSD:</span> 
                                                <span className="font-mono text-gray-300">{ship.fsd.class_number}{ship.fsd.rating_character}</span>
                                            </p>
                                        </div>

                                        <div className="mt-auto">
                                            <button
                                                onClick={() => navigate(`/dashboard/edit-ship/${ship.id}`)}
                                                className="w-full bg-zinc-700 text-white py-2 rounded hover:bg-zinc-600 transition text-sm font-medium border border-zinc-600 flex items-center justify-center gap-2"
                                            >
                                                <FaEdit /> Configure
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}

            {/* Pagination */}
            {filteredShips.length > itemsPerPage && (
                <div className="flex justify-center mt-10 gap-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => paginate(-1)}
                        className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-gray-300 rounded hover:bg-zinc-700 disabled:opacity-50 transition"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 font-mono text-purple-400 bg-zinc-900 rounded border border-zinc-800">
                        {currentPage}
                    </span>
                    <button
                        disabled={indexOfLastItem >= filteredShips.length}
                        onClick={() => paginate(1)}
                        className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-gray-300 rounded hover:bg-zinc-700 disabled:opacity-50 transition"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}