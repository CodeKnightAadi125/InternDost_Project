import { useState } from 'react';

function InternshipCard({ intern, onApply }) {
    // State to track if the mouse is hovering over the card
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                background: 'var(--base)',
                border: isHovered ? '1px solid #2563EB' : '1px solid #E2E8F0',
                padding: '24px',
                borderRadius: '16px',
                boxShadow: isHovered
                    ? '0 10px 25px -5px rgba(37, 99, 235, 0.15), 0 8px 10px -6px rgba(37, 99, 235, 0.1)'
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
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

                    {/* Logo Avatar */}
                    <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: 'rgba(37, 99, 235, 0.1)',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)',
                        fontWeight: 'bold',
                        fontSize: '20px'
                    }}>
                        {intern.company.charAt(0)}
                    </div>

                    <div>
                        <h3 style={{ margin: '0 0 4px 0', color: 'var(--text)', fontSize: '18px', fontWeight: '700', lineHeight: '1.2' }}>
                            {intern.title}
                        </h3>
                        <h4 style={{ margin: 0, color: 'var(--muted)', fontSize: '14px', fontWeight: '500' }}>
                            {intern.company}
                        </h4>
                    </div>
                </div>

                {/* Stipend Pill */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '6px 12px',
                    background: '#D1FAE5',
                    color: '#059669',
                    border: '1px solid #A7F3D0',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '13px',
                    marginBottom: '24px'
                }}>
                    💰 Stipend: {intern.stipend}
                </div>
            </div>

            {/* Apply Button */}
            <button
                onClick={() => onApply && onApply(intern.id || intern._id)}
                style={{
                    padding: '12px 16px',
                    background: isHovered ? 'var(--primary)' : 'transparent',
                    color: isHovered ? 'var(--base)' : 'var(--primary)',
                    border: '1px solid #2563EB',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '15px',
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'all 0.3s ease',
                    boxShadow: isHovered ? 'var(--shadow)' : 'none'
                }}
            >
                Apply Now
            </button>
        </div>
    );
}

export default InternshipCard;