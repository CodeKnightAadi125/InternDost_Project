import React, { useState, useEffect, useRef } from 'react';

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hi there! 👋 I am your InternDost guide. Ask me how to apply, where to find your profile, or anything else!' }
    ]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);

    // Autscroll to the bottom when a new message appears
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Simple smart-reply logic
    const getBotResponse = (text) => {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('apply') || lowerText.includes('where') || lowerText.includes('how')) {
            return "To apply, click on 'Find Internships' or 'Companies' in the sidebar. Find a role that fits your skills, and click the 'Apply Now' button!";
        } else if (lowerText.includes('profile') || lowerText.includes('resume') || lowerText.includes('about')) {
            return "You can view and edit your details by clicking 'My Profile' in the sidebar (make sure you are logged in first!).";
        } else if (/\b(hi|hello|hey)\b/.test(lowerText)) {
            return "Hello! Ready to find your dream internship today?";
        } else {
            return "That's a great question! For now, I'm a simple guide. Try asking me 'how to apply' or 'where is my profile'.";
        }
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        // 1. Add user message
        const userMsg = { sender: 'user', text: inputText };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');

        // 2. Simulate bot "thinking" delay, then reply
        setTimeout(() => {
            const botMsg = { sender: 'bot', text: getBotResponse(userMsg.text) };
            setMessages(prev => [...prev, botMsg]);
        }, 600);
    };

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 999, fontFamily: 'sans-serif' }}>

            {/* The Chat Window */}
            {isOpen && (
                <div style={{ background: 'var(--base)', borderRadius: "16px", border: '1px solid #E2E8F0', boxShadow: 'var(--shadow)', 
                    width: '320px', height: '400px',
                    display: 'flex', flexDirection: 'column', marginBottom: '15px', overflow: 'hidden'
                }}>
                    {/* Header */}
                    <div style={{ background: 'var(--primary-hover)', padding: '15px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            🤖 InternDost Guide
                        </h3>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '16px' }}>✖</button>
                    </div>

                    {/* Messages Area */}
                    <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                background: msg.sender === 'user' ? 'var(--primary)' : 'var(--border)',
                                color: msg.sender === 'user' ? 'var(--bg)' : 'var(--text)',
                                padding: '10px 14px', borderRadius: '12px', maxWidth: '80%', fontSize: '14px', lineHeight: '1.4'
                            }}>
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} style={{ display: 'flex', padding: '12px', borderTop: '1px solid #E2E8F0', background: 'var(--bg2)' }}>
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Ask me anything..."
                            style={{ flex: 1, padding: '10px 14px', border: '1px solid #CBD5E1', borderRadius: '8px', color: 'var(--text)', outline: 'none' }}
                        />
                        <button type="submit" style={{ background: 'var(--primary)', color: 'var(--base)', border: 'none', marginLeft: '8px', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            ➔
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)',
                    border: 'none', cursor: 'pointer', boxShadow: 'var(--shadow)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
                    transition: 'transform 0.2s', float: 'right'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                {isOpen ? '💬' : '🤖'}
            </button>
        </div>
    );
}

export default Chatbot;