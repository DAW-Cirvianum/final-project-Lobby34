import { createContext, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const notifySuccess = (msg) => toast.success(msg);
    const notifyError = (msg) => toast.error(msg);

    return (
        <NotificationContext.Provider value={{ notifySuccess, notifyError }}>
            {children}
            <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
        </NotificationContext.Provider>
    );
};


export const useNotification = () => useContext(NotificationContext);