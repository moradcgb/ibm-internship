import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom'; // For navigation
import './navstyle.css';

const Navbar = () => {
    const location = useLocation();
    const [activeLink, setActiveLink] = useState(location.pathname);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // Handle active link selection
    const handleLinkClick = (path) => {
        setActiveLink(path);
    };

    // Check if user is logged in by checking localStorage
    useEffect(() => {
        const token = localStorage.getItem('userId'); // Check for 'userId' in localStorage
        if (token) {
            setIsLoggedIn(true);  // User is logged in
        } else {
            setIsLoggedIn(false); // User is not logged in
        }
    }, []);

    // Handle logout
   const handleLogout = () => {
        localStorage.removeItem('userId'); 
        setIsLoggedIn(false);  
        navigate('/login');    
    }; 

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="navbar-logo">
                    {/* SVG Logo */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="176" height="40" fill="none" viewBox="0 0 176 40">
                        <path fill="#283841" fillRule="evenodd" d="M15 28a5 5 0 0 1-5-5V0H0v23c0 8.284 6.716 15 15 15h11V28H15ZM45 10a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-19 9C26 8.507 34.507 0 45 0s19 8.507 19 19-8.507 19-19 19-19-8.507-19-19ZM153 10a9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9 9 9 0 0 0-9-9Zm-19 9c0-10.493 8.507-19 19-19s19 8.507 19 19-8.507 19-19 19-19-8.507-19-19ZM85 0C74.507 0 66 8.507 66 19s8.507 19 19 19h28c1.969 0 3.868-.3 5.654-.856L124 40l5.768-10.804A19.007 19.007 0 0 0 132 20.261V19c0-10.493-8.507-19-19-19H85Zm37 19a9 9 0 0 0-9-9H85a9 9 0 1 0 0 18h28a9 9 0 0 0 9-8.93V19Z" clipRule="evenodd"></path>
                        <path fill="#283841" d="M176 2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"></path>
                    </svg>
                </Link>
                <div className="nav-menu">
                    <ul>
                        <li className="navbar-item">
                            <Link
                                to="/explore"
                                className={activeLink === "/explore" ? "active" : ""}
                                onClick={() => handleLinkClick("/explore")}
                            >
                                Explore
                            </Link>
                        </li>
                        <li className="navbar-item">
                            <Link
                                to="/how"
                                className={activeLink === "/how" ? "active" : ""}
                                onClick={() => handleLinkClick("/how")}
                            >
                                How it works
                            </Link>
                        </li>
                        <li className="navbar-item">
                            <Link
                                to="/community"
                                className={activeLink === "/community" ? "active" : ""}
                                onClick={() => handleLinkClick("/community")}
                            >
                                Community
                            </Link>
                        </li>
                        <li className="navbar-item">
                            <Link
                                to="/about"
                                className={activeLink === "/about" ? "active" : ""}
                                onClick={() => handleLinkClick("/about")}
                            >
                                About Us
                            </Link>
                        </li>
                        {/* Conditionally render login/logout based on login state */}
                        {isLoggedIn ? (
                            <li className="navbar-item">
                                <button className="logout-btn" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        ) : (
                            <li className="navbar-item">
                                <Link
                                    to="/login"
                                    className={activeLink === "/login" ? "active" : ""}
                                    onClick={() => handleLinkClick("/login")}
                                >
                                    Login
                                </Link>
                            </li>
                        )}
                        {!isLoggedIn && (
                            <li className="navbar-item signup">
                                <Link
                                    to="/api/register"
                                    className={activeLink === "/api/register" ? "active" : ""}
                                    onClick={() => handleLinkClick("/api/register")}
                                >
                                    Sign Up
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
