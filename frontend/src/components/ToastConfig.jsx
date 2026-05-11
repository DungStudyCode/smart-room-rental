import { Toaster } from 'react-hot-toast';

const ToastConfig = () => {
    return (
        <Toaster 
            position="top-right" 
            reverseOrder={false} 
            toastOptions={{
                duration: 3000, 
                style: {
                    borderRadius: '12px',
                    background: '#7c3aed', 
                    color: '#fff',
                    fontWeight: '500',
                    padding: '12px 24px',
                    fontSize: '14px',
                    boxShadow: '0 10px 15px -3px rgba(124, 58, 237, 0.3)',
                },
                success: {
                    iconTheme: {
                        primary: '#fff',
                        secondary: '#7c3aed',
                    },
                },
                error: {
                    style: {
                        background: '#ef4444',
                    },
                    iconTheme: {
                        primary: '#fff',
                        secondary: '#ef4444',
                    },
                },
            }}
        />
    );
};

export default ToastConfig;