import React, { useState } from 'react';

function EmployerRequest() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: 'Request Admin Access',
        message: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setIsSubmitted(true);
            } else {
                alert('Failed to send request.');
            }
        } catch (err) {
            console.error('Error sending request:', err);
            alert('Failed to send request.');
        }
    };

    const inputStyle = {
        width: '100%', boxSizing: 'border-box', padding: '14px 16px', borderRadius: '12px',
        background: 'var(--bg2)', border: '1px solid rgba(245, 158, 11, 0.2)', color: 'var(--text)',
        outline: 'none', fontSize: '15px', transition: 'all 0.3s ease'
    };

    const handleFocus = (e) => {
        e.target.style.borderColor = '#F59E0B';
        e.target.style.boxShadow = '0 0 12px rgba(245, 158, 11, 0.2)';
    };

    const handleBlur = (e) => {
        e.target.style.borderColor = 'rgba(245, 158, 11, 0.2)';
        e.target.style.boxShadow = 'none';
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 20px', marginTop: '20px' }}>
            <div style={{
                display: 'flex', flexWrap: 'wrap', background: 'var(--base)', borderRadius: '24px',
                boxShadow: 'var(--shadow)', border: '1px solid rgba(245, 158, 11, 0.15)', width: '100%',
                maxWidth: '900px', overflow: 'hidden'
            }}>
                <div style={{
                    flex: '1 1 300px', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
                    color: 'var(--text)', padding: '50px 40px', display: 'flex', flexDirection: 'column',
                    justifyContent: 'space-between', borderRight: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <div>
                        <h2 style={{ fontSize: '32px', margin: '0 0 16px 0', fontWeight: '800', color: 'var(--text)' }}>
                            Join as an <span style={{ color: '#F59E0B' }}>Employer</span>
                        </h2>
                        <p style={{ fontSize: '16px', lineHeight: '1.6', color: 'var(--muted)' }}>
                            Want to hire top talent? Submit a request to get verified as an Employer. Once our Super Admin approves you, you will receive login credentials to start posting internships immediately.
                        </p>
                    </div>
                </div>

                <div style={{ flex: '2 1 400px', padding: '50px 40px' }}>
                    {isSubmitted ? (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🤝</div>
                            <h3 style={{ fontSize: '28px', color: 'var(--text)', marginBottom: '10px' }}>Request Received!</h3>
                            <p style={{ color: 'var(--muted)', fontSize: '16px', marginBottom: '30px', lineHeight: '1.6' }}>
                                Thank you, <span style={{ color: '#F59E0B' }}>{formData.name}</span>! Our Super Admin is reviewing your company details and will email your Admin Portal login credentials within 24 hours.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--muted)', marginBottom: '8px' }}>Your Name & Role</label>
                                <input type="text" name="name" required placeholder="e.g. John Doe, HR Manager" value={formData.name} onChange={handleChange} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--muted)', marginBottom: '8px' }}>Company Email</label>
                                <input type="email" name="email" required placeholder="john@company.com" value={formData.email} onChange={handleChange} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--muted)', marginBottom: '8px' }}>Company Details</label>
                                <textarea name="message" required placeholder="Tell us about your company and the types of internships you want to post..." value={formData.message} onChange={handleChange} style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} onFocus={handleFocus} onBlur={handleBlur} />
                            </div>
                            <button type="submit" style={{ width: '100%', padding: '14px', background: '#F59E0B', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', marginTop: '10px', transition: 'all 0.2s ease' }}>
                                Submit Employer Request
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EmployerRequest;
