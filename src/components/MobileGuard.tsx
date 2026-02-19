'use client';
import { useState, useEffect } from 'react';
import { Monitor } from 'lucide-react';

const MobileGuard = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkViewport = () => {
            setIsMobile(window.innerWidth <= 1024);
        };

        checkViewport();
        window.addEventListener('resize', checkViewport);
        return () => window.removeEventListener('resize', checkViewport);
    }, []);

    if (!isMobile) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'white',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center'
        }}>
            <div style={{
                backgroundColor: 'var(--background)',
                padding: '3rem 2rem',
                borderRadius: '30px',
                boxShadow: 'var(--shadow)',
                maxWidth: '400px'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: 'var(--primary)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 2rem',
                    color: 'white'
                }}>
                    <Monitor size={40} />
                </div>
                <h2 style={{ marginBottom: '1rem' }}>Version Mobile en cours</h2>
                <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
                    Pour une expérience optimale, veuillez consulter Attiéké Express CI sur votre ordinateur.
                </p>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)' }}>
                    Attiéké Express CI
                </div>
            </div>
        </div>
    );
};

export default MobileGuard;
