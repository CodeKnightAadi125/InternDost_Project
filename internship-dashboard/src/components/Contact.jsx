import React, { useState } from 'react';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: 'General Inquiry',
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
                setFormData({ name: '', email: '', category: 'General Inquiry', message: '' });
            } else {
                alert('Failed to send message.');
            }
        } catch (err) {
            console.error('Error sending message:', err);
            alert('Failed to send message.');
        }
    };

    // Shared styles for our glowing dark-mode inputs
    const inputStyle = {
        width: '100%',
        boxSizing: 'border-box',
        padding: '14px 16px',
        borderRadius: '12px',
        background: 'var(--bg2)', /* Solid dark background */
        border: '1px solid #E2E8F0',
        color: 'var(--text)', /* Crisp white text */
        outline: 'none',
        fontSize: '15px',
        transition: 'all 0.3s ease'
    };

    const handleFocus = (e) => {
        e.target.style.borderColor = 'var(--primary)';
        e.target.style.boxShadow = '0 0 12px rgba(37, 99, 235, 0.2)';
    };

    const handleBlur = (e) => {
        e.target.style.borderColor = 'rgba(37, 99, 235, 0.2)';
        e.target.style.boxShadow = 'none';
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 20px', marginTop: '20px' }}>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                background: 'var(--base)', /* Solid opaque container */
                borderRadius: '24px',
                boxShadow: 'var(--shadow)',
                border: '1px solid rgba(0, 229, 255, 0.15)', /* Subtle cyan border */
                width: '100%',
                maxWidth: '900px',
                overflow: 'hidden'
            }}>

                {/* LEFT PANEL: Contact Info */}
                <div style={{
                    flex: '1 1 300px',
                    /* Cyan tinted dark gradient */
                    background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
                    color: 'var(--text)',
                    padding: '50px 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderRight: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <div>
                        <h2 style={{ fontSize: '36px', margin: '0 0 16px 0', fontWeight: '800', color: 'var(--text)' }}>
                            Get in <span style={{ color: 'var(--primary)' }}>Touch</span>
                        </h2>
                        <p style={{ fontSize: '16px', lineHeight: '1.6', color: 'var(--muted)' }}>
                            Whether you're a student looking for guidance or an employer wanting to post an internship, we'd love to hear from you.
                        </p>
                    </div>

                    <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ fontSize: '24px', background: 'rgba(37, 99, 235, 0.1)', padding: '12px', borderRadius: '12px' }}>📧</span>
                            <span style={{ fontSize: '16px', fontWeight: '500', color: 'var(--border)' }}>support@interndost.com</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ fontSize: '24px', background: 'rgba(37, 99, 235, 0.1)', padding: '12px', borderRadius: '12px' }}>📍</span>
                            <span style={{ fontSize: '16px', fontWeight: '500', color: 'var(--border)' }}>Global Remote HQ</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: The Form (or Success Message) */}
                <div style={{ flex: '2 1 400px', padding: '50px 40px' }}>
                    {isSubmitted ? (
                        // SUCCESS UI
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🚀</div>
                            <h3 style={{ fontSize: '28px', color: 'var(--text)', marginBottom: '10px' }}>Message Sent!</h3>
                            <p style={{ color: 'var(--muted)', fontSize: '16px', marginBottom: '30px', lineHeight: '1.6' }}>
                                Thanks for reaching out, <span style={{ color: 'var(--primary)' }}>{formData.name}</span>. Our team will get back to your email within 24 hours.
                            </p>
                            <button
                                onClick={() => setIsSubmitted(false)}
                                style={{
                                    padding: '12px 24px',
                                    background: 'transparent',
                                    border: '1px solid #00E5FF',
                                    color: 'var(--primary)',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(37, 99, 235, 0.1)' }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                            >
                                Send Another Message
                            </button>
                        </div>
                    ) : (
                        // FORM UI
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

                            {/* Name Input */}
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--muted)', marginBottom: '8px' }}>Full Name</label>
                                <input
                                    type="text" name="name" required placeholder="John Doe"
                                    value={formData.name} onChange={handleChange}
                                    style={inputStyle}
                                    onFocus={handleFocus} onBlur={handleBlur}
                                />
                            </div>

                            {/* Email Input */}
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--muted)', marginBottom: '8px' }}>Email Address</label>
                                <input
                                    type="email" name="email" required placeholder="you@example.com"
                                    value={formData.email} onChange={handleChange}
                                    style={inputStyle}
                                    onFocus={handleFocus} onBlur={handleBlur}
                                />
                            </div>

                            {/* Dropdown Select */}
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--muted)', marginBottom: '8px' }}>How can we help?</label>
                                <select
                                    name="category"
                                    value={formData.category} onChange={handleChange}
                                    style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                                    onFocus={handleFocus} onBlur={handleBlur}
                                >
                                    <option value="General Inquiry" style={{ background: 'var(--bg)', color: 'var(--text)' }}>General Inquiry</option>

                                    <option value="Report a Bug" style={{ background: 'var(--bg)', color: 'var(--text)' }}>Report a Bug</option>
                                    <option value="Partnership" style={{ background: 'var(--bg)', color: 'var(--text)' }}>Partnership</option>
                                    <option value="Others" style={{ background: 'var(--bg)', color: 'var(--text)' }}>Others</option>
                                </select>
                            </div>

                            {/* Message Textarea */}
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--muted)', marginBottom: '8px' }}>Your Message</label>
                                <textarea
                                    name="message" required placeholder="Tell us more..."
                                    value={formData.message} onChange={handleChange}
                                    style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                                    onFocus={handleFocus} onBlur={handleBlur}
                                />
                            </div>

                            {/* Submit Button */}
                            <button type="submit" style={{
                                width: '100%',
                                padding: '14px',
                                background: 'var(--primary)',
                                color: 'var(--base)', /* Deep navy text for contrast */
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: '800',
                                fontSize: '16px',
                                cursor: 'pointer',
                                marginTop: '10px',
                                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                                transition: 'all 0.2s ease'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow)';
                                }}
                            >
                                Send Message
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Contact;