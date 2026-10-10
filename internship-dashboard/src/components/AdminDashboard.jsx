import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

function AdminDashboard({ activeTab, setActiveTab }) {
    const { user } = useAuth();
    const adminView = activeTab ? activeTab.replace('admin_', '') : 'dashboard'; 
    
    const [applications, setApplications] = useState([]);
    const [appsLoading, setAppsLoading] = useState(false);
    
    const [allInternships, setAllInternships] = useState([]);
    const [internshipsLoading, setInternshipsLoading] = useState(false);

    const [contactMessages, setContactMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '', company: '', category: 'Engineering', location: 'Remote',
        duration: '3 Months', stipend: '₹15,000/month', skillsRequired: []
    });
    const [currentSkill, setCurrentSkill] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Admins Tab
    const [admins, setAdmins] = useState([]);
    const [adminsLoading, setAdminsLoading] = useState(false);
    const [adminFormData, setAdminFormData] = useState({ name: '', email: '', password: '' });
    const [adminSuccessMsg, setAdminSuccessMsg] = useState('');
    const [adminErrorMsg, setAdminErrorMsg] = useState('');
    const [isAdminLoading, setIsAdminLoading] = useState(false);

    useEffect(() => {
        // Fetch stats on load
        fetchAllInternships();
        fetchApplications();
        fetchMessages();
        if (user && user.role === 'superadmin') fetchAdmins();
    }, [user]);

    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
        return (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--bg2)' }}>
                <h2 style={{ color: '#ef4444', marginBottom: '10px' }}>Access Denied 🛑</h2>
                <p style={{ color: 'var(--muted)' }}>You do not have permission to view the Admin Portal.</p>
                <button onClick={() => setActiveTab('home')} style={{ marginTop: '20px', padding: '10px 20px', background: '#00E5FF', color: '#0B1120', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Back to Home</button>
            </div>
        );
    }

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleAddSkill = (e) => {
        if (e.key === 'Enter' && currentSkill.trim() !== '') {
            e.preventDefault();
            if (!formData.skillsRequired.includes(currentSkill.trim())) {
                setFormData({ ...formData, skillsRequired: [...formData.skillsRequired, currentSkill.trim()] });
            }
            setCurrentSkill('');
        }
    };
    const removeSkill = (skillToRemove) => {
        setFormData({ ...formData, skillsRequired: formData.skillsRequired.filter(s => s !== skillToRemove) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg(''); setSuccessMsg(''); setIsLoading(true);
        try {
            const token = localStorage.getItem('internDost_token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/internships`, {
                method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(formData)
            });
            if (!response.ok) throw new Error('Failed to publish internship');
            setSuccessMsg('🎉 Internship successfully published to the live portal!');
            setFormData({ title: '', company: '', category: 'Engineering', location: 'Remote', duration: '3 Months', stipend: '₹15,000/month', skillsRequired: [] });
            fetchAllInternships();
        } catch (err) { setErrorMsg(err.message); } 
        finally { setIsLoading(false); }
    };

    const fetchApplications = async () => {
        setAppsLoading(true);
        try {
            const token = localStorage.getItem('internDost_token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/applications`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (response.ok) setApplications(await response.json());
        } catch (err) { console.error("Failed to fetch applications:", err); } 
        finally { setAppsLoading(false); }
    };

    const fetchAllInternships = async () => {
        setInternshipsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/internships`);
            if (response.ok) setAllInternships(await response.json());
        } catch (error) { console.error('Error fetching internships:', error); } 
        finally { setInternshipsLoading(false); }
    };

    const fetchMessages = async () => {
        setMessagesLoading(true);
        try {
            const token = localStorage.getItem('internDost_token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/messages`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (response.ok) setContactMessages(await response.json());
        } catch (error) { console.error('Error fetching messages:', error); } 
        finally { setMessagesLoading(false); }
    };

    const handleDeleteInternship = async (id) => {
        if (!confirm('Are you sure you want to delete this internship?')) return;
        try {
            const token = localStorage.getItem('internDost_token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/internships/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            if (response.ok) fetchAllInternships();
            else alert('Failed to delete internship');
        } catch (error) { console.error('Error deleting internship:', error); alert('Failed to delete internship'); }
    };

    const handleStatusChange = async (appId, newStatus) => {
        try {
            const token = localStorage.getItem('internDost_token');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/applications/${appId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) fetchApplications();
            else alert('Failed to update status');
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status');
        }
    };



    const fetchAdmins = async () => {
        setAdminsLoading(true);
        try {
            const token = localStorage.getItem('internDost_token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/list`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (response.ok) setAdmins(await response.json());
        } catch (error) { console.error('Error fetching admins:', error); } 
        finally { setAdminsLoading(false); }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setAdminErrorMsg(''); setAdminSuccessMsg(''); setIsAdminLoading(true);
        try {
            const token = localStorage.getItem('internDost_token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(adminFormData)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to create admin');
            
            setAdminSuccessMsg('🎉 Admin account created securely!');
            setAdminFormData({ name: '', email: '', password: '' });
            fetchAdmins();
        } catch (err) { 
            let msg = err.message;
            if (Array.isArray(err.errors)) msg = err.errors.map(e => e.message).join(', ');
            setAdminErrorMsg(msg); 
        } 
        finally { setIsAdminLoading(false); }
    };

    const handleDeleteAdmin = async (id) => {
        if (!confirm('Are you sure you want to delete this admin account?')) return;
        try {
            const token = localStorage.getItem('internDost_token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            if (response.ok) fetchAdmins();
            else {
                const data = await response.json();
                alert(data.error || 'Failed to delete admin');
            }
        } catch (error) { 
            console.error('Error deleting admin:', error); 
            alert('Failed to delete admin'); 
        }
    };

    const lightInputStyle = { width: '100%', padding: '12px 16px', background: 'var(--bg2)', border: '1px solid #E2E8F0', color: 'var(--text)', borderRadius: '8px', boxSizing: 'border-box', outline: 'none', marginBottom: '16px', fontSize: '14px', transition: 'all 0.2s' };
    
    const cardStyle = { background: 'var(--base)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow)' };
    const thStyle = { padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: 'var(--muted)', borderBottom: '1px solid #E2E8F0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' };
    const tdStyle = { padding: '16px 20px', color: 'var(--text)', borderBottom: '1px solid #E2E8F0', fontSize: '14px' };

    return (
        <div style={{ padding: '40px', width: '100%', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' }}>
                    {adminView === 'dashboard' && (
                        <div>
                            <div style={{ marginBottom: '32px' }}>
                                <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>
                                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                </div>
                                <h1 style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text)', margin: '0 0 12px 0', letterSpacing: '-1px' }}>
                                    Welcome back, <span style={{ color: 'var(--primary)' }}>Admin</span>
                                </h1>
                                <p style={{ color: 'var(--muted)', maxWidth: '600px', lineHeight: '1.6', fontSize: '15px' }}>
                                    Here is an overview of your platform. Total applications are steadily rising.
                                </p>
                            </div>

                            {/* Metric Cards Row */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                                {[
                                    { title: 'Total Internships', value: allInternships.length, icon: '👁️', color: '#10B981', bg: '#D1FAE5' },
                                    { title: 'Total Applications', value: applications.length, icon: '📄', color: '#EF4444', bg: '#FEE2E2' },
                                    { title: 'Total Messages', value: contactMessages.length, icon: '👤', color: '#8B5CF6', bg: '#EDE9FE' },
                                    { title: 'Pending Applications', value: applications.filter(a => a.status === 'Pending').length, icon: '📊', color: '#3B82F6', bg: '#DBEAFE' }
                                ].map((stat, i) => (
                                    <div key={i} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: stat.color }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{stat.icon}</div>
                                                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--muted)' }}>{stat.title}</span>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text)' }}>{stat.value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Main Content Card Wrapper for Dashboard */}
                            <div style={{ ...cardStyle, padding: '32px' }}>
                                <h3 style={{ margin: '0 0 20px 0', color: 'var(--text)', fontSize: '18px', fontWeight: '700' }}>Platform Overview</h3>
                                <p style={{ color: 'var(--muted)' }}>Select an option from the sidebar to manage your platform data.</p>
                            </div>
                        </div>
                    )}

                    {adminView === 'publish' && (
                        <div style={cardStyle}>
                            <h2 style={{ margin: '0 0 24px 0', color: 'var(--text)', fontSize: '24px', fontWeight: '700' }}>Publish New Internship</h2>
                            
                            {successMsg && <div style={{ background: '#D1FAE5', color: '#065F46', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px' }}>✅ {successMsg}</div>}
                            {errorMsg && <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px' }}>❌ {errorMsg}</div>}

                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: 'var(--muted)' }}>Role Title</label>
                                        <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Frontend Developer" style={lightInputStyle} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: 'var(--muted)' }}>Company Name</label>
                                        <input type="text" name="company" value={formData.company} onChange={handleChange} required placeholder="e.g. TechCorp" style={lightInputStyle} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: 'var(--muted)' }}>Location</label>
                                        <input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. Remote" style={lightInputStyle} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: 'var(--muted)' }}>Category</label>
                                        <select name="category" value={formData.category} onChange={handleChange} style={lightInputStyle}>
                                            <option value="Engineering">Engineering</option>
                                            <option value="Design">Design</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Product">Product</option>
                                            <option value="Finance">Finance</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: 'var(--muted)' }}>Duration</label>
                                        <input type="text" name="duration" value={formData.duration} onChange={handleChange} required style={lightInputStyle} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: 'var(--muted)' }}>Stipend</label>
                                        <input type="text" name="stipend" value={formData.stipend} onChange={handleChange} required style={lightInputStyle} />
                                    </div>
                                </div>

                                <div style={{ marginTop: '10px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: 'var(--muted)' }}>Required Skills (Press Enter to add)</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                                        {formData.skillsRequired.map((skill, index) => (
                                            <span key={index} style={{ background: '#EFF6FF', color: 'var(--primary)', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', display: 'inline-flex', alignItems: 'center' }}>
                                                {skill} <span onClick={() => removeSkill(skill)} style={{ marginLeft: '8px', cursor: 'pointer', color: '#60A5FA' }}>✕</span>
                                            </span>
                                        ))}
                                    </div>
                                    <input type="text" value={currentSkill} onChange={(e) => setCurrentSkill(e.target.value)} onKeyDown={handleAddSkill} placeholder="Type a skill and hit Enter" style={lightInputStyle} />
                                </div>

                                <button type="submit" disabled={isLoading} style={{ marginTop: '20px', padding: '14px 28px', background: 'var(--primary)', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '15px', cursor: 'pointer', transition: 'background 0.2s', width: 'auto' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}>
                                    {isLoading ? 'Publishing...' : 'Publish Internship'}
                                </button>
                            </form>
                        </div>
                    )}

                    {adminView === 'applications' && (
                        <div style={cardStyle}>
                            <h2 style={{ margin: '0 0 24px 0', color: 'var(--text)', fontSize: '24px', fontWeight: '700' }}>Student Applications</h2>
                            
                            {appsLoading ? <p style={{ color: 'var(--muted)' }}>Loading...</p> : applications.length === 0 ? <p style={{ color: 'var(--muted)' }}>No applications found.</p> : (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th style={thStyle}>Student</th>
                                            <th style={thStyle}>Role</th>
                                            <th style={thStyle}>Qualification & Edu</th>
                                            <th style={thStyle}>Why Hire</th>
                                            <th style={thStyle}>Status</th>
                                            <th style={thStyle}>Applied On</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.map((app, idx) => (
                                            <tr key={app.id || idx}>
                                                <td style={tdStyle}>
                                                    <div style={{ fontWeight: '600', color: 'var(--text)' }}>{app.studentName}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{app.studentEmail}</div>
                                                </td>
                                                <td style={tdStyle}>
                                                    <div style={{ fontWeight: '500', color: 'var(--text)' }}>{app.role}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--primary)' }}>{app.company}</div>
                                                </td>
                                                <td style={{ ...tdStyle, maxWidth: '200px' }}>
                                                    <div style={{ fontWeight: '500', color: 'var(--text)' }}>{app.qualification || 'N/A'}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.education || 'N/A'}</div>
                                                </td>
                                                <td style={{ ...tdStyle, maxWidth: '250px' }}>
                                                    <div style={{ fontSize: '13px', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={app.whyHire}>{app.whyHire || 'N/A'}</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                                                        {app.resume && <a href={`${import.meta.env.VITE_BACKEND_URL}${app.resume}`} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>📄 View Resume</a>}
                                                    </div>
                                                </td>
                                                <td style={tdStyle}>
                                                    <select value={app.status || 'Pending'} onChange={(e) => handleStatusChange(app.id, e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: '500', outline: 'none', background: app.status === 'Accepted' ? '#D1FAE5' : app.status === 'Rejected' ? '#FEE2E2' : '#FEF3C7', color: app.status === 'Accepted' ? '#065F46' : app.status === 'Rejected' ? '#991B1B' : '#92400E' }}>
                                                        <option value="Pending">Pending</option>
                                                        <option value="Accepted">Accepted</option>
                                                        <option value="Rejected">Rejected</option>
                                                    </select>
                                                </td>
                                                <td style={{ ...tdStyle, color: 'var(--muted)', fontSize: '13px' }}>{app.appliedOn}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {adminView === 'manage' && (
                        <div style={cardStyle}>
                            <h2 style={{ margin: '0 0 24px 0', color: 'var(--text)', fontSize: '24px', fontWeight: '700' }}>Manage Internships</h2>
                            
                            {internshipsLoading ? <p style={{ color: 'var(--muted)' }}>Loading...</p> : allInternships.length === 0 ? <p style={{ color: 'var(--muted)' }}>No internships found.</p> : (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th style={thStyle}>Role Title</th>
                                            <th style={thStyle}>Company</th>
                                            <th style={thStyle}>Category</th>
                                            <th style={thStyle}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allInternships.map((internship, idx) => (
                                            <tr key={internship.id || idx}>
                                                <td style={{ ...tdStyle, fontWeight: '600', color: 'var(--text)' }}>{internship.title}</td>
                                                <td style={tdStyle}>{internship.company}</td>
                                                <td style={{ ...tdStyle, color: 'var(--muted)' }}>{internship.category}</td>
                                                <td style={tdStyle}>
                                                    <button onClick={() => handleDeleteInternship(internship.id || internship._id)} style={{ padding: '6px 12px', background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {adminView === 'messages' && (
                        <div style={cardStyle}>
                            <h2 style={{ margin: '0 0 24px 0', color: 'var(--text)', fontSize: '24px', fontWeight: '700' }}>Contact Messages</h2>
                            
                            {messagesLoading ? <p style={{ color: 'var(--muted)' }}>Loading...</p> : contactMessages.filter(m => m.category !== 'Request Admin Access').length === 0 ? <p style={{ color: 'var(--muted)' }}>No messages found.</p> : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {contactMessages.filter(m => m.category !== 'Request Admin Access').map((msg, idx) => (
                                        <div key={msg._id || idx} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', background: 'var(--bg2)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                                <div>
                                                    <div style={{ fontWeight: '700', color: 'var(--text)', fontSize: '15px' }}>{msg.name}</div>
                                                    <div style={{ color: 'var(--primary)', fontSize: '13px', fontWeight: '500' }}>{msg.email}</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <span style={{ fontSize: '11px', color: '#047857', background: '#D1FAE5', padding: '4px 10px', borderRadius: '20px', fontWeight: '700', textTransform: 'uppercase' }}>{msg.category}</span>
                                                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px', fontWeight: '500' }}>{new Date(msg.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <div style={{ color: 'var(--text)', fontSize: '14px', lineHeight: '1.6', background: 'var(--base)', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                                                {msg.message}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {adminView === 'employer_requests' && user.role === 'superadmin' && (
                        <div style={cardStyle}>
                            <h2 style={{ margin: '0 0 24px 0', color: 'var(--text)', fontSize: '24px', fontWeight: '700' }}>Employer Requests</h2>
                            <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>Review companies requesting admin access. To approve them, copy their email and add them in the <b>Manage Admins</b> tab.</p>
                            
                            {messagesLoading ? <p style={{ color: 'var(--muted)' }}>Loading...</p> : contactMessages.filter(m => m.category === 'Request Admin Access').length === 0 ? <p style={{ color: 'var(--muted)' }}>No employer requests right now.</p> : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {contactMessages.filter(m => m.category === 'Request Admin Access').map((msg, idx) => (
                                        <div key={msg._id || idx} style={{ border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px', padding: '20px', background: 'var(--bg2)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                                <div>
                                                    <div style={{ fontWeight: '700', color: 'var(--text)', fontSize: '15px' }}>{msg.name}</div>
                                                    <div style={{ color: 'var(--primary)', fontSize: '13px', fontWeight: '500' }}>{msg.email}</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <span style={{ fontSize: '11px', color: '#92400E', background: '#FEF3C7', padding: '4px 10px', borderRadius: '20px', fontWeight: '700', textTransform: 'uppercase' }}>Employer Request</span>
                                                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px', fontWeight: '500' }}>{new Date(msg.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <div style={{ color: 'var(--text)', fontSize: '14px', lineHeight: '1.6', background: 'var(--base)', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                                                {msg.message}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {adminView === 'admins' && user.role === 'superadmin' && (
                        <div style={cardStyle}>
                            <h2 style={{ margin: '0 0 24px 0', color: 'var(--text)', fontSize: '24px', fontWeight: '700' }}>Manage Admins</h2>
                            
                            {adminSuccessMsg && <div style={{ background: '#D1FAE5', color: '#065F46', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px' }}>✅ {adminSuccessMsg}</div>}
                            {adminErrorMsg && <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px' }}>❌ {adminErrorMsg}</div>}

                            <div style={{ marginBottom: '40px' }}>
                                <h3 style={{ fontSize: '18px', color: 'var(--text)', marginBottom: '16px' }}>Create New Admin</h3>
                                <form onSubmit={handleCreateAdmin}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: 'var(--muted)' }}>Name</label>
                                            <input type="text" value={adminFormData.name} onChange={(e) => setAdminFormData({...adminFormData, name: e.target.value})} required placeholder="e.g. John Doe" style={lightInputStyle} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: 'var(--muted)' }}>Email</label>
                                            <input type="email" value={adminFormData.email} onChange={(e) => setAdminFormData({...adminFormData, email: e.target.value})} required placeholder="admin@example.com" style={lightInputStyle} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: 'var(--muted)' }}>Password</label>
                                            <input type="password" value={adminFormData.password} onChange={(e) => setAdminFormData({...adminFormData, password: e.target.value})} required placeholder="Strong password" style={lightInputStyle} minLength={8} />
                                        </div>
                                    </div>
                                    <button type="submit" disabled={isAdminLoading} style={{ padding: '12px 24px', background: 'var(--primary)', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                                        {isAdminLoading ? 'Creating...' : 'Create Admin'}
                                    </button>
                                </form>
                            </div>

                            <div>
                                <h3 style={{ fontSize: '18px', color: 'var(--text)', marginBottom: '16px' }}>Existing Admins</h3>
                                {adminsLoading ? <p style={{ color: 'var(--muted)' }}>Loading admins...</p> : (
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th style={thStyle}>Name</th>
                                                <th style={thStyle}>Email</th>
                                                <th style={thStyle}>Role</th>
                                                <th style={thStyle}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {admins.map((admin, idx) => (
                                                <tr key={admin._id || idx}>
                                                    <td style={{ ...tdStyle, fontWeight: '600', color: 'var(--text)' }}>{admin.name}</td>
                                                    <td style={tdStyle}>{admin.email}</td>
                                                    <td style={{ ...tdStyle, color: 'var(--muted)' }}>
                                                        <span style={{ background: '#FEF3C7', color: '#92400E', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Admin</span>
                                                    </td>
                                                    <td style={tdStyle}>
                                                        <button onClick={() => handleDeleteAdmin(admin._id)} style={{ padding: '6px 12px', background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}

                </div>
    );
}
export default AdminDashboard;