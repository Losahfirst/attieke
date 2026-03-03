'use client';
import { useState, useEffect } from 'react';
import { ChevronRight, Utensils, ArrowRight } from 'lucide-react';
import Image from 'next/image';
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
        document.body.classList.add('no-scroll');

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, []);

    const handleContinue = () => {
        setFadeOut(true);
        setTimeout(() => {
            setVisible(false);
            document.body.classList.remove('no-scroll');
            sessionStorage.setItem('splashShown', 'true');
        }, 500);
    };

    if (!visible) return null;

    return (
        <div className={`splash ${fadeOut ? 'splash--out' : ''}`}>
            {/* Header / Logo */}
            <div className="splash__header">
                <div className="splash__logo_wrap">
                    <div className="splash__logo_icon">
                        <Utensils size={18} />
                    </div>
                    <span className="splash__logo_text">Attiéké Express</span>
                </div>
                <span className="splash__logo_sub">Authentique de Bouaké</span>
            </div>

            {/* Illustration */}
            <div className="splash__illustration">
                <img
                    src="/images/onboarding.png"
                    alt="Livraison Attiéké"
                />
            </div>

            {/* Content Section */}
            <div className="splash__content">
                <h2 className="splash__title">
                    Rapide, Frais, et <span>Toujours</span> à Temps.
                </h2>
                <p className="splash__desc">
                    Recevez votre attiéké préféré de Molonoublé directement à votre porte, n'importe où à Bouaké.
                </p>

                {/* Pagination Dots */}
                <div className="splash__pagination">
                    <div className="splash__dot" />
                    <div className="splash__dot" />
                    <div className="splash__dot splash__dot--active" />
                </div>

                {/* Footer Buttons */}
                <div className="splash__footer">
                    <button className="splash__btn_skip" onClick={handleContinue}>
                        Passer <ChevronRight size={16} />
                    </button>
                    <button className="splash__btn_continue" onClick={handleContinue}>
                        Continuer <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
