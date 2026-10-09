import heroImage from '../assets/internship.png';

function HeroSection({ searchTerm, setSearchTerm, setActiveTab }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap', // Ensures it stacks nicely on small screens
            padding: '80px 30px',
            background: 'transparent',
            marginTop: '20px',
            position: 'relative',
            gap: '40px'
        }}>

            {/* LEFT COLUMN: Text and Search */}
            <div style={{ flex: '1 1 500px', position: 'relative', zIndex: 2, textAlign: 'left' }}>

                <span style={{
                    display: 'inline-block',
                    padding: '6px 16px',
                    background: 'rgba(37, 99, 235, 0.1)',
                    color: 'var(--primary)',
                    border: '1px solid #E2E8F0',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '20px',
                    letterSpacing: '0.5px'
                }}>
                    ✨ Your Gateway to Career Success
                </span>

                <h1 style={{
                    fontSize: '52px',
                    fontWeight: '800',
                    color: 'var(--text)',
                    marginBottom: '16px',
                    letterSpacing: '-0.025em',
                    lineHeight: '1.2'
                }}>
                    Find the Perfect Internship with <br />
                    <span style={{ color: 'var(--primary)' }}>InternDost</span>
                </h1>

                <p style={{
                    fontSize: '18px',
                    color: 'var(--muted)',
                    marginBottom: '45px',
                    maxWidth: '550px',
                    lineHeight: '1.6'
                }}>
                    We help you match with the best internship opportunities tailored for your career growth and skill level.
                </p>

                {/* Dark Glassmorphic Search Container (Left Aligned Now) */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setActiveTab('internships');
                    }}
                    style={{
                        display: 'flex',
                        gap: '10px',
                        maxWidth: '550px',
                        background: 'var(--base)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid #E2E8F0',
                        padding: '8px',
                        borderRadius: '16px',
                        boxShadow: 'var(--shadow)'
                    }}
                >
                    <input
                        type="text"
                        placeholder="Role / Company / Location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: '12px 18px',
                            flex: 1,
                            border: 'none',
                            fontSize: '16px',
                            outline: 'none',
                            background: 'transparent',
                            color: 'var(--text)',
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: '12px 32px',
                            background: '#FFD700',
                            color: 'var(--base)',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: '700',
                            fontSize: '15px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(255, 215, 0, 0.25)',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.25)';
                        }}
                    >
                        Explore
                    </button>
                </form>
            </div>

            {/* RIGHT COLUMN: The Cartoon/3D Graphic & Cyan Blob */}
            <div style={{ flex: '1 1 400px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                {/* The Cyan Background Glow */}
                <div style={{
                    position: 'absolute',
                    width: '450px',
                    height: '450px',
                    background: 'radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, rgba(0, 229, 255, 0) 70%)',
                    borderRadius: '50%',
                    zIndex: 0,
                    pointerEvents: 'none'
                }} />


                {/* Internship Image */}
                <img
                    src={heroImage}
                    alt="Internship Illustration"
                    className="floating-graphic"
                    style={{
                        width: '100%',
                        maxWidth: '350px',
                        position: 'relative',
                        zIndex: 1,
                    }}
                />
            </div>
        </div>
    );
}

export default HeroSection;