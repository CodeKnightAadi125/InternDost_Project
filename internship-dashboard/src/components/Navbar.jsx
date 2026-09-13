import React, { useState } from 'react';

function Navbar({ activeTab, setActiveTab, setSearchTerm }) {
    const [isLoginHovered, setIsLoginHovered] = useState(false);

    // Updated helper function for a sleek, minimalist dark theme look
    const getLinkStyle = (tabName) => ({
        background: 'transparent',
        border: 'none',
        // Bright white when active, dim slate gray when inactive
        color: activeTab === tabName ? '#F8FAFC' : '#94A3B8',
        fontWeight: activeTab === tabName ? '600' : '500',
        fontSize: '14px',
        cursor: 'pointer',
        padding: '8px 12px',
        borderRadius: '8px',
        transition: 'color 0.2s ease',
    });

    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 32px',
            // Dark frosted glass background replacing the bright blue
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            position: 'sticky',
            top: '15px',
            margin: '15px auto',
            maxWidth: '1200px',
            borderRadius: '16px',
            zIndex: 100,
        }}>
            {/* Logo / Brand Name - Updated to Neon Cyan */}
            <h2
                onClick={() => { setActiveTab('home'); setSearchTerm(''); }}
                style={{
                    margin: 0,
                    color: '#00E5FF', // Signature neon cyan
                    fontSize: '22px',
                    fontWeight: '800',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                <span style={{ fontSize: '24px' }}>⬢</span> InternDost
            </h2>

            {/* Navigation Links */}
            <nav style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <button
                    onClick={() => { setActiveTab('home'); setSearchTerm(''); }}
                    style={getLinkStyle('home')}
                >
                    Find Internships
                </button>
                <button
                    onClick={() => setActiveTab('internships')}
                    style={getLinkStyle('internships')}
                >
                    Companies
                </button>
                <button
                    onClick={() => setActiveTab('contact')}
                    style={getLinkStyle('contact')}
                >
                    Contact
                </button>

                {/* Cyberpunk-style Neon Outline Login Button */}
                <button
                    onClick={() => setActiveTab('login')}
                    onMouseEnter={() => setIsLoginHovered(true)}
                    onMouseLeave={() => setIsLoginHovered(false)}
                    style={{
                        background: isLoginHovered ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                        color: '#00E5FF',
                        border: '1px solid #00E5FF',
                        padding: '10px 24px',
                        marginLeft: '15px',
                        borderRadius: '24px', // Pill shape from the reference image
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: 'pointer',
                        boxShadow: isLoginHovered ? '0 0 15px rgba(0, 229, 255, 0.2)' : 'none',
                        transition: 'all 0.2s ease'
                    }}
                >
                    Login/Register
                </button>
            </nav>
        </header>
    );
}

export default Navbar;