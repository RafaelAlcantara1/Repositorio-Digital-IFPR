import React from 'react';
import Header from './Header';
import NavBar from './NavBar';
import Footer from './Footer';
import BackToTop from './BackToTop';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <NavBar />
      <main className="main-content">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Layout; 