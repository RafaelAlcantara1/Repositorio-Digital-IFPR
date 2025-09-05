import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import styles from './BackToTop.module.css';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const getScrollTop = () => (
      window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    );

    const toggleVisibility = () => {
      const y = getScrollTop();
      setIsVisible(y > 150);
    };

    // Checagem inicial
    toggleVisibility();

    window.addEventListener('scroll', toggleVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      className={styles.backToTop}
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      title="Voltar ao topo"
    >
      <FaArrowUp />
    </button>
  );
};

export default BackToTop;

