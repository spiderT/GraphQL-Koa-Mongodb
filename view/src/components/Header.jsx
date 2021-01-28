import React from 'react';
import './Header.css';
import logo from './logo.png';

const Header = () => {
    return <div className="header">
        <span className="logo">
            <img src={logo} alt="logo" />
        </span>
    </div>
}

export default Header;