import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: 'rgba(15,17,21,0.92)',
                        backdropFilter: 'blur(16px)',
                        color: '#F5F7FA',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '14px',
                        fontSize: '13px',
                    },
                }}
            />
        </BrowserRouter>
    </React.StrictMode>,
);
