import React, { createContext, useState, useCallback, useContext, useEffect, useRef } from 'react';
import './css/toast.css'; // Import the CSS for the toast

const toastDetails = {
    timer: 7000,
    success: {
        icon: 'fa-circle-check',
    },
    error: {
        icon: 'fa-circle-xmark',
    },
    warning: {
        icon: 'fa-triangle-exclamation',
    },
    info: {
        icon: 'fa-circle-info',
    }
};

const Toast = ({ id, msg, onClose }) => {
    const { icon } = toastDetails[id];
    const timeoutId = useRef();
    const [isClosing, setIsClosing] = useState(false); // New state variable to control the closing animation

    useEffect(() => {
        timeoutId.current = setTimeout(() => {
            setIsClosing(true); // Start the closing animation when the timer expires
        }, toastDetails.timer);
        return () => clearTimeout(timeoutId.current); // This will clear the timer when the component is unmounted
    }, []);

    const handleClose = () => {
        clearTimeout(timeoutId.current);
        setIsClosing(true); // Start the closing animation when the close button is clicked
    };

    useEffect(() => {
        if (isClosing) {
            setTimeout(onClose, 300); // Remove the toast after the exit animation has completed
        }
    }, [isClosing, onClose]);

    return (
        <li className={`toast ${id}`} style={{ animation: isClosing ? 'hide_toast 0.3s ease forwards' : 'show_toast 0.3s ease forwards' }}>
            <div className="column">
                <i className={`fa-solid ${icon}`}></i>
                <span>{msg}</span>
            </div>
            <i className="fa-solid fa-xmark" onClick={handleClose}></i>
        </li>
    );
};

// Toast context
const ToastContext = createContext();

// Toast provider
const ToastProvider = ({ children, toastContainer }) => {
    const [toast, setToast] = useState(null);
    const [key, setKey] = useState(0);

    const showToast = useCallback((id, msg) => {
        setToast({ id, msg });
        setKey(prevKey => prevKey + 1); // Increment the key to force a re-render of the Toast component
    }, []);

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            {toastContainer(toast && <Toast key={key} id={toast.id} msg={toast.msg} onClose={hideToast} />)}
        </ToastContext.Provider>
    );
};


// Custom hook to use the toast context
const useToast = () => {
  const showToast = useContext(ToastContext);
  return showToast;
};

export { ToastProvider, useToast };