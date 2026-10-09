import React from 'react';
import { useAuth } from './AuthContext';

function SidebarLayout({ activeTab, setActiveTab, user, children }) {
    const { logout } = useAuth();
    const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

    const NavItem = ({ id, label, icon }) => {
        const isActive = activeTab === id;
        return (
            <div onClick={() => setActiveTab(id)} style={{ padding: '12px 20px', margin: '4px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', color: isActive ? 'var(--primary)' : 'var(--muted)', background: isActive ? '#EFF6FF' : 'transparent', fontWeight: isActive ? '600' : '500', transition: 'all 0.2s' }} onMouseEnter={(e) => { if(!isActive) e.currentTarget.style.background = 'var(--bg2)'; }} onMouseLeave={(e) => { if(!isActive) e.currentTarget.style.background = 'transparent'; }}>
                <span style={{ fontSize: '18px' }}>{icon}</span> {label}
            </div>
        );
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'var(--bg)', color: 'var(--text)', display: 'flex', zIndex: 9999, fontFamily: '"Inter", "Segoe UI", sans-serif' }}>
            
            {/* SIDEBAR */}
            <div style={{ width: '280px', backgroundColor: 'var(--base)', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #F1F5F9' }}>
                    <img src="/logo.png" alt="InternDost Logo" style={{ height: '36px', objectFit: 'contain' }} />
                </div>

                <div style={{ padding: '24px 0', flex: 1, overflowY: 'auto' }}>
                    <div style={{ padding: '0 24px', fontSize: '11px', fontWeight: '700', color: 'var(--muted)', letterSpacing: '1px', marginBottom: '8px', textTransform: 'uppercase' }}>Discover</div>
                    <NavItem id="home" label="Find Internships" icon="🏠" />
                    <NavItem id="internships" label="Companies" icon="🏢" />
                    <NavItem id="employer_request" label="Employer Request" icon="🤝" />
                    <NavItem id="contact" label="Support" icon="✉️" />
                    
                    <div style={{ padding: '0 24px', fontSize: '11px', fontWeight: '700', color: 'var(--muted)', letterSpacing: '1px', margin: '24px 0 8px 0', textTransform: 'uppercase' }}>Account</div>
                    {!user ? (
                        <NavItem id="login" label="Login / Register" icon="🔑" />
                    ) : (
                        <NavItem id="profile" label="My Profile" icon="👤" />
                    )}
                    
                    {/* Admin Section (Only if admin) */}
                    {isAdmin && (
                        <>
                            <div style={{ padding: '0 24px', fontSize: '11px', fontWeight: '700', color: 'var(--muted)', letterSpacing: '1px', margin: '24px 0 8px 0', textTransform: 'uppercase' }}>Admin Portal</div>
                            <NavItem id="admin_dashboard" label="Overview" icon="📊" />
                            <NavItem id="admin_publish" label="Publish Role" icon="➕" />
                            <NavItem id="admin_manage" label="Manage Listings" icon="⚙️" />
                            <NavItem id="admin_applications" label="Applications" icon="📄" />
                            <NavItem id="admin_messages" label="Contact Messages" icon="💬" />
                            {user.role === 'superadmin' && (
                                <>
                                    <NavItem id="admin_employer_requests" label="Employer Requests" icon="🏢" />
                                    <NavItem id="admin_admins" label="Manage Admins" icon="🛡️" />
                                </>
                            )}
                        </>
                    )}
                </div>

                {user && (
                    <div style={{ padding: '24px', borderTop: '1px solid #E2E8F0' }}>
                        <button onClick={() => { logout(); setActiveTab('login'); }} style={{ width: '100%', padding: '12px', background: '#FEE2E2', border: '1px solid #FECACA', color: '#EF4444', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#FECACA'; }} onMouseLeave={(e) => { e.currentTarget.style.background = '#FEE2E2'; }}>
                            Log Out
                        </button>
                    </div>
                )}
            </div>

            {/* MAIN CONTENT AREA */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                
                {/* TOP HEADER */}
                <div style={{ height: '70px', backgroundColor: 'var(--base)', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
                    <div style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: '500' }}>
                        Platform &gt; <span style={{ fontWeight: '600', color: 'var(--text)', textTransform: 'capitalize' }}>{activeTab.replace('admin_', '')}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        {/* Removed search bar and duplicate profile icons for a cleaner look */}
                        {!user && activeTab !== 'login' && (
                            <button 
                                onClick={() => setActiveTab('login')} 
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow)';
                                    e.currentTarget.style.backgroundColor = 'var(--primary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.backgroundColor = 'var(--primary)';
                                }}
                                style={{ background: 'var(--primary)', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease' }}
                            >
                                Sign In / Join
                            </button>
                        )}
                    </div>
                </div>

                {/* SCROLLABLE VIEW */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default SidebarLayout;
