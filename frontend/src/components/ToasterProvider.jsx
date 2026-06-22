'use client';
import { Toaster } from 'react-hot-toast';

export default function ToasterProvider() {
  return (
    <Toaster position="bottom-right" toastOptions={{
      style: {
        background: '#28251d',
        color: '#f9f8f5',
        borderRadius: '10px',
        fontSize: '0.875rem',
      }
    }} />
  );
}