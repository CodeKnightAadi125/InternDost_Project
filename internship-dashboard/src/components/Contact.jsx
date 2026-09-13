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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
        setIsSubmitted(true);
    };

    // Shared styles for our glowing dark-mode inputs
    const inputStyle = {
        width: '100%',
        boxSizing: 'border-box',
        padding: '14px 16px',
        borderRadius: '12px',
        background: 'rgba(15, 23, 42, 0.6)', /* Dark transparent glass */
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#F8FAFC', /* Crisp white text */
        outline: 'none',
        fontSize: '15px',
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
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 20px', marginTop: '20px' }}>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                background: 'rgba(15, 23, 42, 0.6)', /* Dark glass container */
                backdropFilter: 'blur(12px)',
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
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
                    color: '#F8FAFC',
                    padding: '50px 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderRight: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <div>
                        <h2 style={{ fontSize: '36px', margin: '0 0 16px 0', fontWeight: '800', color: '#F8FAFC' }}>
                            Get in <span style={{ color: '#00E5FF' }}>Touch</span>
                        </h2>
                        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#94A3B8' }}>
                            Whether you're a student looking for guidance or an employer wanting to post an internship, we'd love to hear from you.
                        </p>
                    </div>

                    <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ fontSize: '24px', background: 'rgba(0,229,255,0.1)', padding: '12px', borderRadius: '12px' }}>📧</span>
                            <span style={{ fontSize: '16px', fontWeight: '500', color: '#E2E8F0' }}>support@interndost.com</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ fontSize: '24px', background: 'rgba(0,229,255,0.1)', padding: '12px', borderRadius: '12px' }}>📍</span>
                            <span style={{ fontSize: '16px', fontWeight: '500', color: '#E2E8F0' }}>Global Remote HQ</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: The Form (or Success Message) */}
                <div style={{ flex: '2 1 400px', padding: '50px 40px' }}>
                    {isSubmitted ? (
                        // SUCCESS UI
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🚀</div>
                            <h3 style={{ fontSize: '28px', color: '#F8FAFC', marginBottom: '10px' }}>Message Sent!</h3>
                            <p style={{ color: '#94A3B8', fontSize: '16px', marginBottom: '30px', lineHeight: '1.6' }}>
                                Thanks for reaching out, <span style={{ color: '#00E5FF' }}>{formData.name}</span>. Our team will get back to your email within 24 hours.
                            </p>
                            <button
                                onClick={() => setIsSubmitted(false)}
                                style={{
                                    padding: '12px 24px',
                                    background: 'transparent',
                                    border: '1px solid #00E5FF',
                                    color: '#00E5FF',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0, 229, 255, 0.1)' }}
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
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#CBD5E1', marginBottom: '8px' }}>Full Name</label>
                                <input
                                    type="text" name="name" required placeholder="John Doe"
                                    value={formData.name} onChange={handleChange}
                                    style={inputStyle}
                                    onFocus={handleFocus} onBlur={handleBlur}
                                />
                            </div>

                            {/* Email Input */}
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#CBD5E1', marginBottom: '8px' }}>Email Address</label>
                                <input
                                    type="email" name="email" required placeholder="you@example.com"
                                    value={formData.email} onChange={handleChange}
                                    style={inputStyle}
                                    onFocus={handleFocus} onBlur={handleBlur}
                                />
                            </div>

                            {/* Dropdown Select */}
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#CBD5E1', marginBottom: '8px' }}>How can we help?</label>
                                <select
                                    name="category"
                                    value={formData.category} onChange={handleChange}
                                    style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                                    onFocus={handleFocus} onBlur={handleBlur}
                                >
                                    <option value="General Inquiry" style={{ background: '#0B1120', color: '#F8FAFC' }}>General Inquiry</option>
                                    <option value="Post an Internship" style={{ background: '#0B1120', color: '#F8FAFC' }}>Post an Internship</option>
                                    <option value="Report a Bug" style={{ background: '#0B1120', color: '#F8FAFC' }}>Report a Bug</option>
                                    <option value="Partnership" style={{ background: '#0B1120', color: '#F8FAFC' }}>Partnership</option>
                                </select>
                            </div>

                            {/* Message Textarea */}
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#CBD5E1', marginBottom: '8px' }}>Your Message</label>
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
                                background: '#00E5FF',
                                color: '#0B1120', /* Deep navy text for contrast */
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: '800',
                                fontSize: '16px',
                                cursor: 'pointer',
                                marginTop: '10px',
                                boxShadow: '0 4px 15px rgba(0, 229, 255, 0.3)',
                                transition: 'all 0.2s ease'
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