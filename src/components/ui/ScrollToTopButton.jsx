import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTopButton = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 200) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!visible) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3 bg-neon-cyan/10 border border-neon-cyan rounded-full shadow-[0_0_10px_#00f3ff] hover:bg-neon-cyan hover:text-military-900 transition-all"
            aria-label="Scroll to top"
        >
            <ArrowUp className="w-5 h-5 text-neon-cyan" />
        </button>
    );
};

export default ScrollToTopButton;
