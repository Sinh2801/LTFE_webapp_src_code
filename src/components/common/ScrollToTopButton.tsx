import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        function toggleVisibility() {
            if (window.scrollY > 200) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        }

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        toggleVisibility();

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    function handleClick() {
        if (location.pathname !== '/') {
            navigate('/');
        }
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    if (!isVisible) return null;

    return (
        <button
            type="button"
            className="scroll-to-top-btn"
            onClick={handleClick}
            aria-label="Về đầu trang chủ"
            title="Về đầu trang chủ"
        >
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
        </button>
    );
}

export default ScrollToTopButton;
