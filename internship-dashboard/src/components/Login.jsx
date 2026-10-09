import React, { useState } from 'react';
import { useAuth } from './AuthContext';

function Login({ setActiveTab }) {
    // Role state: 'user' or 'admin'
    const [activeRole, setActiveRole] = useState('user');
    const [isLoginView, setIsLoginView] = useState(true);

    // Form states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useAuth();

    const inputStyle = {
        width: '100%',
        padding: '14px 16px',
        borderRadius: '12px',
        background: 'var(--base)',
        border: '1px solid #E2E8F0',
        color: 'var(--text)',
        fontSize: '15px',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'all 0.3s ease'
    };

    const handleFocus = (e) => {
        e.target.style.borderColor = activeRole === 'admin' ? '#F59E0B' : 'var(--primary)';
        e.target.style.boxShadow = activeRole === 'admin' 
            ? '0 0 12px rgba(245, 158, 11, 0.3)' 
            : '0 0 12px rgba(37, 99, 235, 0.2)';
    };

    const handleBlur = (e) => {
        e.target.style.borderColor = 'var(--border)';
        e.target.style.boxShadow = 'none';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (activeRole === 'admin') {
                // --- ADMIN LOGIN REQUEST ---
                const response = await fetch('http://localhost:5000/api/admin/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Admin login failed');

                login(data.user, data.token);
                alert(`Welcome Administrator, ${data.user.name}!`);
                setActiveTab('admin');

            } else {
                // --- USER LOGIN / REGISTER REQUEST ---
                if (isLoginView) {
                    const response = await fetch('http://localhost:5000/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });

                    const data = await response.json();
                    if (!response.ok) throw new Error(data.error || 'Login failed');

                    login(data.user, data.token);
                    alert(`Welcome back, ${data.user.name}!`);
                    setActiveTab('home');

                } else {
                    const response = await fetch('http://localhost:5000/api/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, email, password })
                    });

                    const data = await response.json();
                    if (!response.ok) throw new Error(data.error || 'Registration failed');

                    alert('User account created successfully! You can now log in.');
                    setIsLoginView(true);
                    setPassword('');
                }
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh', padding: '20px' }}>
            <div style={{
                background: 'var(--base)',
                padding: '45px 40px',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '430px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                border: '1px solid #E2E8F0',
                borderTop: activeRole === 'admin' ? '6px solid #F59E0B' : '6px solid var(--primary)',
                textAlign: 'center',
                transition: 'border 0.3s ease'
            }}>

                {/* --- ROLE SELECTOR TOGGLE SWITCH --- */}
                <div style={{
                    display: 'flex',
                    background: 'var(--bg)',
                    padding: '4px',
                    borderRadius: '12px',
                    marginBottom: '25px',
                    border: '1px solid #E2E8F0'
                }}>
                    <button
                        type="button"
                        onClick={() => {
                            setActiveRole('user');
                            setError('');
                        }}
                        style={{
                            flex: 1,
                            padding: '10px',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '700',
                            fontSize: '14px',
                            cursor: 'pointer',
                            background: activeRole === 'user' ? 'var(--primary)' : 'transparent',
                            color: activeRole === 'user' ? 'var(--base)' : 'var(--muted)',
                            transition: 'all 0.2s ease',
                            boxShadow: activeRole === 'user' ? '0 0 12px rgba(37, 99, 235, 0.1)' : 'none'
                        }}
                    >
                        👤 User Portal
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setActiveRole('admin');
                            setIsLoginView(true);
                            setError('');
                        }}
                        style={{
                            flex: 1,
                            padding: '10px',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '700',
                            fontSize: '14px',
                            cursor: 'pointer',
                            background: activeRole === 'admin' ? '#F59E0B' : 'transparent',
                            color: activeRole === 'admin' ? 'var(--base)' : 'var(--muted)',
                            transition: 'all 0.2s ease',
                            boxShadow: activeRole === 'admin' ? '0 0 12px rgba(245, 158, 11, 0.3)' : 'none'
                        }}
                    >
                        🛡️ Admin Portal
                    </button>
                </div>

                {/* Icon Header */}
                <div style={{
                    width: '64px', height: '64px', borderRadius: '16px',
                    background: activeRole === 'admin' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                    border: activeRole === 'admin' ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(37, 99, 235, 0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: activeRole === 'admin' ? '#F59E0B' : 'var(--primary)',
                    fontSize: '28px', margin: '0 auto 20px auto',
                    boxShadow: activeRole === 'admin' ? '0 0 20px rgba(245, 158, 11, 0.15)' : '0 0 20px rgba(0, 229, 255, 0.15)'
                }}>
                    {activeRole === 'admin' ? '🛡️' : (isLoginView ? '🔐' : '✨')}
                </div>

                <h2 style={{ fontSize: '26px', color: 'var(--text)', margin: '0 0 8px 0', fontWeight: '800' }}>
                    {activeRole === 'admin' ? (
                        <>Admin <span style={{ color: '#F59E0B' }}>Portal</span></>
                    ) : isLoginView ? (
                        <>User <span style={{ color: 'var(--primary)' }}>Sign In</span></>
                    ) : (
                        <>Create <span style={{ color: 'var(--primary)' }}>Account</span></>
                    )}
                </h2>

                <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '25px' }}>
                    {activeRole === 'admin'
                        ? "Restricted access for system administrators"
                        : isLoginView
                            ? "Sign in to access your student dashboard"
                            : "Join InternDost to find your dream role"}
                </p>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        marginBottom: '20px',
                        fontSize: '14px',
                        border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {activeRole === 'user' && !isLoginView && (
                        <div style={{ marginBottom: '18px', textAlign: 'left' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--muted)', marginBottom: '6px' }}>
                                Full Name
                            </label>
                            <input
                                type="text" placeholder="John Doe"
                                value={name} onChange={(e) => setName(e.target.value)}
                                style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} required
                            />
                        </div>
                    )}

                    <div style={{ marginBottom: '18px', textAlign: 'left' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--muted)', marginBottom: '6px' }}>
                            {activeRole === 'admin' ? 'Admin Email Address' : 'Email Address'}
                        </label>
                        <input
                            type="email"
                            placeholder={activeRole === 'admin' ? "admin@example.com" : "you@example.com"}
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} required
                        />
                    </div>

                    <div style={{ marginBottom: '25px', textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--muted)' }}>
                                Password
                            </label>
                            {isLoginView && (
                                <span style={{ fontSize: '12px', color: activeRole === 'admin' ? '#F59E0B' : 'var(--primary)', cursor: 'pointer', fontWeight: '500' }}>
                                    Forgot?
                                </span>
                            )}
                        </div>
                        <input
                            type="password" placeholder="••••••••"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} required
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: activeRole === 'admin' ? '#F59E0B' : 'var(--primary)',
                            color: 'var(--base)',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: '800',
                            fontSize: '15px',
                            cursor: 'pointer',
                            boxShadow: activeRole === 'admin'
                                ? '0 4px 15px rgba(245, 158, 11, 0.3)'
                                : 'var(--shadow)',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = activeRole === 'admin'
                                ? '0 6px 20px rgba(245, 158, 11, 0.5)'
                                : '0 6px 20px rgba(37, 99, 235, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = activeRole === 'admin'
                                ? '0 4px 15px rgba(245, 158, 11, 0.3)'
                                : 'var(--shadow)';
                        }}
                    >
                        {activeRole === 'admin'
                            ? 'Login to Admin Dashboard'
                            : isLoginView ? 'Sign In' : 'Create Account'}
                    </button>
                </form>



                {/* USER SIGN-IN / SIGN-UP TOGGLE */}
                {activeRole === 'user' && (
                    <p style={{ marginTop: '22px', fontSize: '14px', color: 'var(--muted)' }}>
                        {isLoginView ? "Don't have an account? " : "Already have an account? "}
                        <span
                            onClick={() => {
                                setIsLoginView(!isLoginView);
                                setError('');
                            }}
                            style={{ color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}
                        >
                            {isLoginView ? "Sign up" : "Sign in"}
                        </span>
                    </p>
                )}

                {/* ADMIN REQUEST LINK */}
                {activeRole === 'admin' && (
                    <p style={{ marginTop: '22px', fontSize: '14px', color: 'var(--muted)' }}>
                        Are you an employer?
                        <span
                            onClick={() => setActiveTab('employer_request')}
                            style={{ color: '#F59E0B', fontWeight: '600', cursor: 'pointer', marginLeft: '6px' }}
                        >
                            Request Admin Access
                        </span>
                    </p>
                )}
            </div>
        </div>
    );
}

export default Login;