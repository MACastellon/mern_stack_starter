import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import {AuthProvider} from "./contexts/AuthContext/AuthContext";

ReactDOM.render(
        <AuthProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AuthProvider>
    ,document.getElementById('root'));
