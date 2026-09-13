import { useState } from 'react';

function Login({ setActiveTab }) {
    // NEW: State to toggle between Login and Sign Up views
    const [isLoginView, setIsLoginView] = useState(true);

    // Form states

    const [name, setName] = useState('');// Added name for signup
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Shared styles for our glowing dark-mode inputs
    const inputStyle = {
        width: '100%',
        padding: '14px 16px',
        borderRadius: '12px',
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#F8FAFC',
        fontSize: '15px',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'all 0.3s ease'
    };

    const handleFocus = (e) => {
        e.target.style.borderColor = '#00E5FF';
        e.target.style.boxShadow = '0 0 12px rgba(0, 229, 255, 0.2)';
    };

    const handleBlur = (e) => {
        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        e.target.style.boxShadow = 'none';
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '20px' }}>
            <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(12px)',
                padding: '50px 40px',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '420px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(0, 229, 255, 0.15)',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(0, 229, 255, 0.1)',
                    border: '1px solid rgba(0, 229, 255, 0.2)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: '#00E5FF', fontSize: '28px', margin: '0 auto 24px auto',
                    boxShadow: '0 0 20px rgba(0, 229, 255, 0.15)'
                }}>
                    {isLoginView ? '🔐' : '✨'}
                </div>

                {/* Dynamic Title based on view */}
                <h2 style={{ fontSize: '28px', color: '#F8FAFC', margin: '0 0 8px 0', fontWeight: '800' }}>
                    {isLoginView ? (
                        <>Welcome <span style={{ color: '#00E5FF' }}>Back</span></>
                    ) : (
                        <>Create an <span style={{ color: '#00E5FF' }}>Account</span></>
                    )}
                </h2>
                <p style={{ color: '#94A3B8', fontSize: '15px', marginBottom: '35px' }}>
                    {isLoginView ? "Sign in to access your dashboard" : "Join InternDost to find your dream role"}
                </p>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (isLoginView) {
                        alert(`Signed in as: ${email}`);
                    } else {
                        alert(`Account created for: ${name}`);
                    }
                    setActiveTab('home');
                }}>

                    {/* Conditionally render the Name input ONLY if it is the Sign Up view */}
                    {!isLoginView && (
                        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#CBD5E1', marginBottom: '8px' }}>
                                Full Name
                            </label>
                            <input
                                type="text" placeholder="John Doe"
                                value={name} onChange={(e) => setName(e.target.value)}
                                style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} required
                            />
                        </div>
                    )}

                    <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#CBD5E1', marginBottom: '8px' }}>
                            Email Address
                        </label>
                        <input
                            type="email" placeholder="you@example.com"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} required
                        />
                    </div>

                    <div style={{ marginBottom: '30px', textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '600', color: '#CBD5E1' }}>
                                Password
                            </label>
                            {/* Only show "Forgot?" on the Login view */}
                            {isLoginView && (
                                <span style={{ fontSize: '13px', color: '#00E5FF', cursor: 'pointer', fontWeight: '500' }}>
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
                            width: '100%', padding: '14px', background: '#00E5FF', color: '#0B1120',
                            border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '16px',
                            cursor: 'pointer', boxShadow: '0 4px 15px rgba(0, 229, 255, 0.3)', transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 229, 255, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 229, 255, 0.3)';
                        }}
                    >
                        {isLoginView ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                {/* Toggler at the bottom */}
                <p style={{ marginTop: '28px', fontSize: '14px', color: '#94A3B8' }}>
                    {isLoginView ? "Don't have an account? " : "Already have an account? "}
                    <span
                        onClick={() => setIsLoginView(!isLoginView)}
                        style={{ color: '#00E5FF', fontWeight: '600', cursor: 'pointer' }}
                    >
                        {isLoginView ? "Sign up" : "Sign in"}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Login;