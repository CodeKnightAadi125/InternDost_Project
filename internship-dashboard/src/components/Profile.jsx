import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

function Profile({ setActiveTab }) {
    const { user: authUser } = useAuth();
    const user = authUser || { name: 'Guest', email: 'guest@example.com' };
    const [appliedInternships, setAppliedInternships] = useState([]);

    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        title: "Design Student",
        phone: "+01 923 456 78",
        location: "7839 Williams Dr.\nColumbus, GA 31904",
        degree: "B.Tech",
        university: "University",
        year: "2024"
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('internDost_token');
            if (!token) return;
            try {
                const appRes = await fetch('http://localhost:5000/api/applications/user', { headers: { 'Authorization': `Bearer ${token}` } });
                if (appRes.ok) setAppliedInternships(await appRes.json());
            } catch (err) { console.error('Failed to load apps'); }

            try {
                const profRes = await fetch('http://localhost:5000/api/profile', { headers: { 'Authorization': `Bearer ${token}` } });
                if (profRes.ok) {
                    const data = await profRes.json();
                    setProfileData({ ...profileData, ...data });
                }
            } catch (err) { console.error('Failed to load profile'); }
        };
        fetchUserData();
    }, []);

    const handleChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });

    const handleSave = async () => {
        setIsEditing(false);
        const token = localStorage.getItem('internDost_token');
        if (!token) return;
        try {
            await fetch('http://localhost:5000/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(profileData)
            });
        } catch (err) { console.error('Failed to save profile'); }
    };

    const cardStyle = { background: 'var(--base)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow)', border: '1px solid #F1F5F9' };
    const labelStyle = { display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' };
    const valueStyle = { fontSize: '14px', color: 'var(--text)', fontWeight: '600', marginBottom: '20px' };
    const inputStyle = { width: '100%', padding: '8px 12px', background: 'var(--bg2)', border: '1px solid #E2E8F0', color: 'var(--text)', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' };

    return (
        <div style={{ padding: '40px', background: 'var(--bg2)', minHeight: '100vh', fontFamily: '"Inter", sans-serif', color: 'var(--text)' }}>
            
            {/* Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ margin: '0 0 4px 0', color: 'var(--text)', fontSize: '24px', fontWeight: '800' }}>Public Profile</h1>
                    <p style={{ margin: 0, color: 'var(--muted)', fontSize: '13px', fontWeight: '500' }}>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} at {new Date().toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '8px', color: 'var(--muted)' }}>🔍</span>
                        <input placeholder="search..." style={{ background: 'var(--base)', border: '1px solid #E2E8F0', padding: '8px 16px 8px 36px', borderRadius: '8px', outline: 'none', width: '200px', fontSize: '13px' }} />
                    </div>
                    <button style={{ background: 'var(--bg)', border: '1px solid #E2E8F0', padding: '8px 16px', borderRadius: '8px', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>All time <span>˅</span></button>
                    <button style={{ background: 'var(--base)', border: '1px solid #E2E8F0', width: '38px', height: '38px', borderRadius: '8px', color: 'var(--muted)', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔔</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px', alignItems: 'start' }}>
                
                {/* LEFT SIDEBAR (Profile Details) */}
                <div style={{ ...cardStyle, position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text)' }}>Public Profile</h3>
                        <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '18px', cursor: 'pointer' }}>{isEditing ? '💾' : '•••'}</button>
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#FF8A65', margin: '0 auto 12px', position: 'relative', overflow: 'visible' }}>
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                            <div style={{ position: 'absolute', bottom: '0px', right: '0px', width: '14px', height: '14px', background: '#10B981', border: '2px solid #FFF', borderRadius: '50%' }}></div>
                        </div>
                        <h2 style={{ margin: '0 0 4px 0', color: 'var(--text)', fontSize: '18px', fontWeight: '700' }}>{user.name}</h2>
                        {isEditing ? (
                            <input name="title" value={profileData.title} onChange={handleChange} style={{...inputStyle, textAlign: 'center', marginBottom: 0}} />
                        ) : (
                            <p style={{ margin: 0, color: '#6366F1', fontSize: '13px', fontWeight: '600' }}>{profileData.title}</p>
                        )}
                    </div>

                    <div style={{ marginTop: '24px' }}>
                        <span style={labelStyle}>Email</span>
                        <div style={valueStyle}>{user.email}</div>

                        <span style={labelStyle}>Phone</span>
                        {isEditing ? <input name="phone" value={profileData.phone} onChange={handleChange} style={inputStyle} /> : <div style={valueStyle}>{profileData.phone}</div>}

                        <span style={labelStyle}>Location</span>
                        {isEditing ? <textarea name="location" value={profileData.location} onChange={handleChange} style={{...inputStyle, height: '60px', resize: 'none'}} /> : <div style={{...valueStyle, whiteSpace: 'pre-line'}}>{profileData.location}</div>}
                    </div>

                </div>

                {/* RIGHT MAIN CONTENT */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    
                    {/* Metrics Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px' }}>
                        {[
                            { icon: '📄', val: appliedInternships.length.toString(), label: 'Total Applications', bg: '#EFF6FF', clr: 'var(--primary)' },
                            { icon: '⏳', val: appliedInternships.filter(app => app.status === 'Pending').length.toString(), label: 'Pending Reviews', bg: '#FEF3C7', clr: '#D97706' },
                            { icon: '🎉', val: appliedInternships.filter(app => app.status === 'Accepted').length.toString(), label: 'Accepted Offers', bg: '#D1FAE5', clr: '#10B981' },
                        ].map((stat, i) => (
                            <div key={i} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '20px', padding: '24px' }}>
                                <div style={{ fontSize: '24px', background: stat.bg, color: stat.clr, width: '55px', height: '55px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', fontWeight: 'bold' }}>{stat.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text)' }}>{stat.val}</div>
                                    <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: '600' }}>{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Row: Customer Analytics / Recent Applications */}
                    <div style={cardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text)' }}>Recent Applications</h3>
                            <div style={{ display: 'flex', gap: '12px', fontSize: '11px', fontWeight: '600', color: 'var(--muted)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width:'8px', height:'8px', background:'var(--primary)', borderRadius:'2px' }}></div> Accepted</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width:'8px', height:'8px', background:'#38BDF8', borderRadius:'2px' }}></div> Pending</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width:'8px', height:'8px', background:'var(--muted)', borderRadius:'2px' }}></div> Rejected</div>
                            </div>
                        </div>

                        {appliedInternships.length === 0 ? (
                            <p style={{ color: 'var(--muted)', fontSize: '14px', textAlign: 'center', padding: '20px' }}>No applications yet. Go apply for an internship!</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {appliedInternships.slice(0, 4).map((app, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '16px' }}>
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)' }}>{app.title}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{app.company} • Applied on {app.appliedOn}</div>
                                        </div>
                                        <div style={{ fontSize: '12px', fontWeight: '700', color: app.status === 'Accepted' ? '#10B981' : app.status === 'Rejected' ? '#EF4444' : '#F59E0B', background: app.status === 'Accepted' ? '#D1FAE5' : app.status === 'Rejected' ? '#FEE2E2' : '#FEF3C7', padding: '4px 10px', borderRadius: '12px' }}>
                                            {app.status}
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => setActiveTab('internships')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '13px', fontWeight: '700', cursor: 'pointer', textAlign: 'left', padding: 0 }}>View all opportunities →</button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Profile;