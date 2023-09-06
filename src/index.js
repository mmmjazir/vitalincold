import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { ShopContextProvider } from './context/ShopContext';
import { MedicineContextProvider } from './context/MedicineContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
   < ShopContextProvider>
   <MedicineContextProvider>
   
    <App />

  </MedicineContextProvider>
 </ShopContextProvider>
 </AuthContextProvider>
  </React.StrictMode>
);
