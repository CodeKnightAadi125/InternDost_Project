import { useState } from 'react';

function InternshipCard({ intern }) {
    // State to track if the mouse is hovering over the card
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                background: 'rgba(15, 23, 42, 0.6)', /* Dark transparent navy */
                backdropFilter: 'blur(10px)',
                /* Neon cyan border that glows brighter on hover */
                border: isHovered ? '1px solid rgba(0, 229, 255, 0.4)' : '1px solid rgba(0, 229, 255, 0.1)',
                padding: '24px',
                borderRadius: '16px',
                // Deeper shadow that gets a cyan tint when hovered
                boxShadow: isHovered
                    ? '0 15px 30px rgba(0, 229, 255, 0.15)'
                    : '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease',
                transform: isHovered ? 'translateY(-6px)' : 'translateY(0)'
            }}
        >
            <div>
                {/* Header row with auto-generated Company Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>

                    {/* Cyberpunk Logo Avatar */}
                    <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: 'rgba(0, 229, 255, 0.1)',
                        border: '1px solid rgba(0, 229, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#00E5FF',
                        fontWeight: 'bold',
                        fontSize: '20px'
                    }}>
                        {intern.company.charAt(0)}
                    </div>

                    <div>
                        <h3 style={{ margin: '0 0 4px 0', color: '#F8FAFC', fontSize: '18px', fontWeight: '700', lineHeight: '1.2' }}>
                            {intern.title}
                        </h3>
                        <h4 style={{ margin: 0, color: '#94A3B8', fontSize: '14px', fontWeight: '500' }}>
                            {intern.company}
                        </h4>
                    </div>
                </div>

                {/* Neon Green Stipend Pill */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '6px 12px',
                    background: 'rgba(52, 211, 153, 0.1)',
                    color: '#34D399',
                    border: '1px solid rgba(52, 211, 153, 0.2)',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '13px',
                    marginBottom: '24px'
                }}>
                    💰 Stipend: {intern.stipend}
                </div>
            </div>

            {/* Apply Button - Transitions from outline to solid when card is hovered! */}
            <button
                style={{
                    padding: '12px 16px',
                    background: isHovered ? '#00E5FF' : 'transparent',
                    color: isHovered ? '#0B1120' : '#00E5FF',
                    border: '1px solid #00E5FF',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '15px',
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'all 0.3s ease',
                    boxShadow: isHovered ? '0 0 15px rgba(0, 229, 255, 0.4)' : 'none'
                }}
            >
                Apply Now
            </button>
        </div>
    );
}

export default InternshipCard;