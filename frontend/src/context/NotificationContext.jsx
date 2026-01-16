import { createContext, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 1. Create the Context
const NotificationContext = createContext();

// 2. Export the Provider (This is what main.jsx needs)
export const NotificationProvider = ({ children }) => {
    const notifySuccess = (msg) => toast.success(msg);
    const notifyError = (msg) => toast.error(msg);

    return (
        <NotificationContext.Provider value={{ notifySuccess, notifyError }}>
            {children}
            {/* The actual popup container */}
            <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
        </NotificationContext.Provider>
    );
};

// 3. Export the Hook (This is what UserShips.jsx needs)
export const useNotification = () => useContext(NotificationContext);