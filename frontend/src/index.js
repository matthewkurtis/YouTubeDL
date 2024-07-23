import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastProvider, useToast } from "./Toast";
import './css/index.css';
import './css/toast.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToastProvider toastContainer={(toast) => <ul className="notifications">{toast}</ul>}>
      <App />
    </ToastProvider>
  </React.StrictMode>
);
