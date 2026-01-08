import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TypewriterEffect = ({ text, className = '', speed = 50, delay = 0, hideCursorOnComplete = false }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [started, setStarted] = useState(false);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            setStarted(true);
        }, delay);

        return () => clearTimeout(startTimeout);
    }, [delay]);

    useEffect(() => {
        if (!started) return;

        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex < text.length) {
                setDisplayedText((prev) => prev + text[currentIndex]);
                currentIndex++;
            } else {
                clearInterval(interval);
                setCompleted(true);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed, started]);

    return (
        <span className={className}>
            {displayedText}
            {(!completed || !hideCursorOnComplete) && (
                <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-[2px] h-[1em] bg-neon-cyan ml-1 align-middle"
                />
            )}
        </span>
    );
};

export default TypewriterEffect;
