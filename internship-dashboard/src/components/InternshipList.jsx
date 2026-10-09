import React, { useState, useEffect } from 'react';

function InternshipList({ searchTerm, setSearchTerm }) {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Advanced Filter State
    const [filterCategory, setFilterCategory] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    const [filterDuration, setFilterDuration] = useState('');

    // Modal state
    const [selectedInternshipId, setSelectedInternshipId] = useState(null);
    const [formData, setFormData] = useState({
        qualification: '',
        education: '',
        resume: '',
        whyHire: ''
    });

    const [error, setError] = useState(false);

    // Fetch data from your Node server
    const fetchInternships = () => {
        setLoading(true);
        setError(false);
        fetch('http://localhost:5000/api/internships')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then((data) => {
                setInternships(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(true);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchInternships();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, resume: file }));
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const submitApplication = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('internDost_token');
        if (!token) {
            alert("Please log in to apply for internships!");
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('internshipId', selectedInternshipId);
            formDataToSend.append('qualification', formData.qualification);
            formDataToSend.append('education', formData.education);
            formDataToSend.append('whyHire', formData.whyHire);
            if (formData.resume) {
                formDataToSend.append('resume', formData.resume);
            }

            const response = await fetch('http://localhost:5000/api/applications', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            const data = await response.json();
            if (response.ok) {
                alert("Successfully applied! You can view this in your Profile.");
                setSelectedInternshipId(null);
                setFormData({ qualification: '', education: '', resume: '', whyHire: '' });
            } else {
                alert(`Failed to apply: ${data.error}`);
            }
        } catch (error) {
            console.error("Error applying:", error);
            alert("An error occurred while applying.");
        }
    };

    // Filter internships based on search input and advanced filters
    const filteredInternships = internships.filter((item) => {
        const matchesSearch = (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                              (item.company && item.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
                              (item.skillsRequired && item.skillsRequired.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())));
                              
        const matchesCategory = filterCategory === '' || item.category === filterCategory;
        const matchesLocation = filterLocation === '' || item.location === filterLocation;
        const matchesDuration = filterDuration === '' || item.duration === filterDuration;

        return matchesSearch && matchesCategory && matchesLocation && matchesDuration;
    });

    // Extract unique values for filters
    const uniqueCategories = [...new Set(internships.map(i => i.category).filter(Boolean))];
    const uniqueLocations = [...new Set(internships.map(i => i.location).filter(Boolean))];
    const uniqueDurations = [...new Set(internships.map(i => i.duration).filter(Boolean))];

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '60px' }}>
                <p style={{ color: 'var(--primary)', fontSize: '18px', fontWeight: '500', letterSpacing: '1px' }}>Loading opportunities...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', marginTop: '60px' }}>
                <p style={{ color: '#EF4444', fontSize: '18px', fontWeight: '500' }}>Failed to load internships.</p>
                <button onClick={fetchInternships} style={{ background: 'var(--primary)', color: '#FFF', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Retry</button>
            </div>
        );
    }

    return (
        <div style={{ padding: '40px 20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>

            {/* Header & Search Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <h2 style={{ margin: 0, color: 'var(--text)', fontSize: '28px', fontWeight: '800' }}>
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
                            background: 'var(--base)',
                            border: '1px solid #E2E8F0',
                            color: 'var(--text)',
                            outline: 'none',
                            transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--primary)';
                            e.target.style.boxShadow = '0 0 10px rgba(37, 99, 235, 0.2)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>
                </div>
                
                {/* Advanced Filters */}
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', background: 'var(--bg2)', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--muted)' }}>Category:</span>
                        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'var(--base)', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}>
                            <option value="">All Categories</option>
                            {uniqueCategories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--muted)' }}>Location:</span>
                        <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'var(--base)', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}>
                            <option value="">All Locations</option>
                            {uniqueLocations.map((loc, idx) => <option key={idx} value={loc}>{loc}</option>)}
                        </select>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--muted)' }}>Duration:</span>
                        <select value={filterDuration} onChange={(e) => setFilterDuration(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'var(--base)', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}>
                            <option value="">Any Duration</option>
                            {uniqueDurations.map((dur, idx) => <option key={idx} value={dur}>{dur}</option>)}
                        </select>
                    </div>

                    {(filterCategory || filterLocation || filterDuration) && (
                        <button onClick={() => { setFilterCategory(''); setFilterLocation(''); setFilterDuration(''); }} style={{ padding: '8px 16px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Internship Cards Grid */}
            <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                {filteredInternships.length > 0 ? (
                    filteredInternships.map((item, index) => (
                        <div key={item.id || index} style={{
                            background: 'var(--base)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid #E2E8F0',
                            padding: '24px',
                            borderRadius: '16px',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 229, 255, 0.15)';
                                e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.3)';
                                e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.1)';
                            }}
                        >
                            <div>
                                {/* Category Badge */}
                                <span style={{
                                    display: 'inline-block',
                                    fontSize: '12px',
                                    background: 'rgba(37, 99, 235, 0.1)',
                                    color: 'var(--primary)',
                                    border: '1px solid #E2E8F0',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    fontWeight: '700',
                                    marginBottom: '16px',
                                    letterSpacing: '0.5px'
                                }}>
                                    {item.category || 'General'}
                                </span>

                                <h3 style={{ margin: '0 0 8px 0', color: 'var(--text)', fontSize: '20px', fontWeight: '700' }}>{item.title}</h3>
                                <p style={{ margin: '0 0 16px 0', color: 'var(--muted)', fontSize: '15px', fontWeight: '500' }}>🏢 {item.company}</p>

                                {/* Details Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                                    <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>📍 {item.location || 'Remote'}</p>
                                    <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>⏳ {item.duration || 'Flexible'}</p>
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
                                                border: '1px solid #E2E8F0',
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                color: 'var(--muted)',
                                                fontWeight: '500'
                                            }}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Apply Now Button - Cyan Outline to Solid */}
                            <button 
                                onClick={() => setSelectedInternshipId(item.id || item._id)}
                                style={{
                                    padding: '12px 16px',
                                    background: 'transparent',
                                    color: 'var(--primary)',
                                    border: '1px solid #00E5FF',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    width: '100%',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--primary)';
                                    e.currentTarget.style.color = '#0B1120';
                                    e.currentTarget.style.boxShadow = '0 0 15px rgba(37, 99, 235, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = 'var(--primary)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                Apply Now
                            </button>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <p style={{ fontSize: '18px', color: 'var(--muted)', margin: 0 }}>No internships found matching "{searchTerm}".</p>
                        <button
                            onClick={() => setSearchTerm('')}
                            style={{ marginTop: '15px', padding: '8px 16px', background: 'transparent', border: '1px solid #00E5FF', borderRadius: '6px', cursor: 'pointer', color: 'var(--primary)', fontWeight: '500', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(37, 99, 235, 0.1)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                        >
                            Clear Search
                        </button>
                    </div>
                )}
            </div>

            {/* APPLICATION MODAL */}
            {selectedInternshipId && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'var(--base)', border: '1px solid #E2E8F0',
                        borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '500px',
                        boxShadow: 'var(--shadow)',
                        maxHeight: '90vh', overflowY: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h2 style={{ margin: 0, color: 'var(--primary)', fontSize: '24px' }}>Complete Application</h2>
                            <button onClick={() => setSelectedInternshipId(null)} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: '20px', cursor: 'pointer' }}>✖</button>
                        </div>
                        
                        <form onSubmit={submitApplication} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Highest Qualification</label>
                                <select name="qualification" required value={formData.qualification} onChange={handleFormChange} style={{ width: '100%', padding: '12px', background: 'var(--bg2)', border: '1px solid #E2E8F0', color: 'var(--text)', borderRadius: '10px', outline: 'none' }}>
                                    <option value="" disabled>Select Qualification</option>
                                    <option value="High School">High School</option>
                                    <option value="Diploma">Diploma</option>
                                    <option value="Bachelors">Bachelors Degree</option>
                                    <option value="Masters">Masters Degree</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Education / University Details</label>
                                <input name="education" required value={formData.education} onChange={handleFormChange} placeholder="e.g. B.Tech from MIT..." style={{ width: '100%', padding: '12px', background: 'var(--bg2)', border: '1px solid #E2E8F0', color: 'var(--text)', borderRadius: '10px', boxSizing: 'border-box', outline: 'none' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Upload Resume (PDF/DOC)</label>
                                <input type="file" required accept=".pdf,.doc,.docx" onChange={handleFileChange} style={{ width: '100%', padding: '12px', background: 'var(--bg2)', border: '1px solid #E2E8F0', color: 'var(--text)', borderRadius: '10px', boxSizing: 'border-box', outline: 'none' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Why should we hire you?</label>
                                <textarea name="whyHire" required value={formData.whyHire} onChange={handleFormChange} placeholder="Tell us what makes you a great fit..." rows="4" style={{ width: '100%', padding: '12px', background: 'var(--bg2)', border: '1px solid #E2E8F0', color: 'var(--text)', borderRadius: '10px', boxSizing: 'border-box', outline: 'none', resize: 'vertical' }}></textarea>
                            </div>

                            <button type="submit" style={{ width: '100%', padding: '14px', background: 'var(--primary)', color: 'var(--base)', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '10px', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }}>
                                Submit Application 🚀
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}

export default InternshipList;