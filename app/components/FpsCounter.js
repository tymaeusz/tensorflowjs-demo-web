import { useState } from "react";
import { useAnimationFrame } from "../lib/hooks/useAnimationFrame";
import styles from "../styles/FpsCounter.module.css"; // Assuming you're using CSS Modules

export default function FpsCounter() {
    const [fps, setFps] = useState(0);
    const [count, setCount] = useState(0);
    const [animate, setAnimate] = useState(false); // Controls FPS counting
    const [isVisible, setIsVisible] = useState(false); // Controls visibility of the counts

    // Function to update FPS and count only if animation is active
    useAnimationFrame(delta => {
        if (animate) {
            setFps(() => Math.floor(1000 / delta));  // Update FPS based on the frame delta
            setCount(prev => prev + 1); // Increment the count
        }
    }, animate);

    // Function to determine FPS text color based on the value
    const getFpsColor = (fps) => {
        if (fps < 30) return styles.fpsLow; // Red for below 30 FPS
        if (fps >= 30 && fps <= 60) return styles.fpsMedium; // Blue for 30-60 FPS
        return styles.fpsHigh; // Green for above 60 FPS
    };

    const toggleVisibility = () => {
        if (isVisible) {
            setAnimate(false);  // Stop FPS counting if hiding the counter
        } else {
            setAnimate(true);   // Start FPS counting if showing the counter
        }
        setIsVisible(!isVisible);  // Toggle visibility
    };

    return (
        <div className={styles.counterContainer}>
{isVisible && (
                <span className={styles.fpsText}>
                    FPS: <span className={getFpsColor(fps)}>{fps}</span>, Contagem de Quadros Processados: {count}
                </span>
            )}

<button 
    className={`${styles.toggleButton} ${isVisible ? styles.esconder : styles.mostrar}`} 
    onClick={toggleVisibility}
>
    {isVisible ? 'Esconder' : 'Mostrar'} FPS
</button>
            
            
        </div>
    );
}
