'use client';
import { useState, useEffect } from 'react';
import { Utensils } from 'lucide-react';
import './SplashScreen.css';

export default function SplashScreen() {
    const [visible, setVisible] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Only on mobile
        if (window.innerWidth > 768) return;

        const splashShown = sessionStorage.getItem('splashShown');
        if (splashShown) return;

        setVisible(true);

        const timer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
                setVisible(false);
                sessionStorage.setItem('splashShown', 'true');
            }, 500);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div className={`splash ${fadeOut ? 'splash--out' : ''}`}>
            {/* Background image with overlay */}
            <div className="splash__bg" />

            {/* Center content */}
            <div className="splash__body">
                <div className="splash__icon">
                    <Utensils size={36} color="#D4AF37" strokeWidth={1.5} />
                </div>
                <h1 className="splash__name">Attiéké Express</h1>
                <p className="splash__tagline">Côte d'Ivoire</p>
            </div>

            {/* Bottom */}
            <div className="splash__footer">
                <div className="splash__bar">
                    <div className="splash__bar-fill" />
                </div>
                <span className="splash__origin">Molonoublé · Bouaké</span>
            </div>
        </div>
    );
}
