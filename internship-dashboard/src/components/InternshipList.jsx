import React, { useState, useEffect } from 'react';

function InternshipList({ searchTerm, setSearchTerm }) {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data from your Node server
    useEffect(() => {
        const result = fetch('http://localhost:5000/api/internships')
            .then((res) => res.json())
            .then((data) => {
                console.log("Data received from backend:", data);
                setInternships(data);
                setLoading(false);
            })

        console.log(result)
    }, []);

    // Filter internships based on search input
    const filteredInternships = internships.filter((item) =>
        (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.company && item.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.skillsRequired && item.skillsRequired.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '60px' }}>
                <p style={{ color: '#00E5FF', fontSize: '18px', fontWeight: '500', letterSpacing: '1px' }}>Loading opportunities...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '40px 20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>

            {/* Header & Search Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '15px' }}>
                <h2 style={{ margin: 0, color: '#F8FAFC', fontSize: '28px', fontWeight: '800' }}>
                    Trending Opportunities
                </h2>

                <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
                    <input
                        type="text"
                        placeholder="Search roles, skills, companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: '12px 16px',
                            width: '100%',
                            boxSizing: 'border-box',
                            fontSize: '15px',
                            borderRadius: '10px',
                            background: 'rgba(15, 23, 42, 0.6)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#F8FAFC',
                            outline: 'none',
                            transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#00E5FF';
                            e.target.style.boxShadow = '0 0 10px rgba(0, 229, 255, 0.2)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>
            </div>

            {/* Internship Cards Grid */}
            <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                {filteredInternships.length > 0 ? (
                    filteredInternships.map((item, index) => (
                        <div key={item.id || index} style={{
                            background: 'rgba(15, 23, 42, 0.6)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(0, 229, 255, 0.1)',
                            padding: '24px',
                            borderRadius: '16px',
                            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 229, 255, 0.15)';
                                e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.3)';
                                e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.1)';
                            }}
                        >
                            <div>
                                {/* Category Badge */}
                                <span style={{
                                    display: 'inline-block',
                                    fontSize: '12px',
                                    background: 'rgba(0, 229, 255, 0.1)',
                                    color: '#00E5FF',
                                    border: '1px solid rgba(0, 229, 255, 0.2)',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    fontWeight: '700',
                                    marginBottom: '16px',
                                    letterSpacing: '0.5px'
                                }}>
                                    {item.category || 'General'}
                                </span>

                                <h3 style={{ margin: '0 0 8px 0', color: '#F8FAFC', fontSize: '20px', fontWeight: '700' }}>{item.title}</h3>
                                <p style={{ margin: '0 0 16px 0', color: '#94A3B8', fontSize: '15px', fontWeight: '500' }}>🏢 {item.company}</p>

                                {/* Details Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                                    <p style={{ margin: 0, color: '#94A3B8', fontSize: '14px' }}>📍 {item.location || 'Remote'}</p>
                                    <p style={{ margin: 0, color: '#94A3B8', fontSize: '14px' }}>⏳ {item.duration || 'Flexible'}</p>
                                </div>

                                <div style={{
                                    display: 'inline-block',
                                    padding: '6px 12px',
                                    background: 'rgba(52, 211, 153, 0.1)',
                                    color: '#34D399',
                                    border: '1px solid rgba(52, 211, 153, 0.2)',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    marginBottom: '20px'
                                }}>
                                    💰 {item.stipend || 'Unpaid'}
                                </div>

                                {/* Skills Container */}
                                <div style={{ marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {item.skillsRequired?.map((skill, idx) => (
                                            <span key={idx} style={{
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                color: '#CBD5E1',
                                                fontWeight: '500'
                                            }}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Apply Now Button - Cyan Outline to Solid */}
                            <button style={{
                                padding: '12px 16px',
                                background: 'transparent',
                                color: '#00E5FF',
                                border: '1px solid #00E5FF',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                width: '100%',
                                transition: 'all 0.2s ease'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#00E5FF';
                                    e.currentTarget.style.color = '#0B1120';
                                    e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 229, 255, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#00E5FF';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                Apply Now
                            </button>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <p style={{ fontSize: '18px', color: '#94A3B8', margin: 0 }}>No internships found matching "{searchTerm}".</p>
                        <button
                            onClick={() => setSearchTerm('')}
                            style={{ marginTop: '15px', padding: '8px 16px', background: 'transparent', border: '1px solid #00E5FF', borderRadius: '6px', cursor: 'pointer', color: '#00E5FF', fontWeight: '500', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0, 229, 255, 0.1)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                        >
                            Clear Search
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default InternshipList;