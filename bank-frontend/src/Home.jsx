import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [showLoginDropdown, setShowLoginDropdown] = useState(false);
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            {/* TOP HEADER BAR */}
            <header style={styles.header}>
                <div style={styles.logoSection}>
                    <span style={styles.bankIcon}>🏦</span>
                    <div>
                        <h1 style={styles.portalTitle}>MY BANK MANAGEMENT SYSTEM</h1>
                        <p style={styles.portalSub}>Secure Digital Banking & Administration Portal</p>
                    </div>
                </div>

                {/* NAVIGATION ACTION BUTTONS */}
                <div style={styles.navActions}>
                    {/* LOGIN DROPDOWN CONTAINER */}
                    <div style={{ position: 'relative' }}>
                        <button 
                            onClick={() => setShowLoginDropdown(!showLoginDropdown)} 
                            style={styles.loginBtn}
                        >
                            Login ▾
                        </button>

                        {/* DROPDOWN MENU */}
                        {showLoginDropdown && (
                            <div style={styles.dropdownMenu}>
                                <div 
                                    style={styles.dropdownItem} 
                                    onClick={() => navigate('/login')}
                                >
                                    👤 Customer Login
                                </div>
                                <div 
                                    style={styles.dropdownItem} 
                                    onClick={() => navigate('/login')}
                                >
                                    🛡️ Admin / Staff Login
                                </div>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={() => navigate('/register')} 
                        style={styles.registerBtn}
                    >
                        Register
                    </button>
                </div>
            </header>

            {/* HERO BANNER SECTION */}
            <div style={styles.heroSection}>
                <div style={styles.heroOverlay}>
                    <h2 style={styles.heroHeading}>Welcome to Secure Online Banking</h2>
                    <p style={styles.heroText}>
                        Manage your accounts, check real-time balances, pay utility bills, and submit loan requests safely from one unified platform.
                    </p>
                </div>
            </div>

            {/* FEATURE CARDS GRID (Simulating portal modules) */}
            <div style={styles.gridContainer}>
                <div style={styles.card}>
                    <h3>💳 Balance & Accounts</h3>
                    <p>Monitor your savings and checking account status instantly with live updates.</p>
                </div>
                <div style={styles.card}>
                    <h3>📄 Statements & History</h3>
                    <p>Track your past transactions, downloads, and deposits securely.</p>
                </div>
                <div style={styles.card}>
                    <h3>📃 Loans & Credit</h3>
                    <p>Apply for personal loans, mortgages, and auto financing with ease.</p>
                </div>
            </div>
        </div>
    );
}

// --- STYLES ---
const styles = {
    container: { fontFamily: 'sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    header: { backgroundColor: '#1a1a2e', color: 'white', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' },
    logoSection: { display: 'flex', alignItems: 'center', gap: '15px' },
    bankIcon: { fontSize: '35px' },
    portalTitle: { margin: 0, fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px',color: '#b3b3b3' },
    portalSub: { margin: '3px 0 0 0', fontSize: '11px', color: '#b3b3b3' },
    navActions: { display: 'flex', gap: '15px', alignItems: 'center' },
    loginBtn: { backgroundColor: '#ff7f00', color: 'white', border: 'none', padding: '10px 20px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' },
    registerBtn: { backgroundColor: '#0f3460', color: 'white', border: 'none', padding: '10px 20px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' },
    dropdownMenu: { position: 'absolute', top: '45px', right: 0, backgroundColor: 'white', color: '#333', boxShadow: '0 4px 8px rgba(0,0,0,0.15)', borderRadius: '4px', width: '200px', zIndex: 100, overflow: 'hidden' },
    dropdownItem: { padding: '12px 15px', cursor: 'pointer', borderBottom: '1px solid #eee', fontSize: '13px', fontWeight: 'bold', transition: 'background 0.2s' },
    heroSection: { backgroundColor: '#0f3460', color: 'white', padding: '60px 20px', textAlign: 'center', backgroundImage: 'linear-gradient(rgba(15, 52, 96, 0.9), rgba(26, 26, 46, 0.9))' },
    heroOverlay: { maxWidth: '700px', margin: '0 auto' },
    heroHeading: { fontSize: '32px', margin: '0 0 15px 0' },
    heroText: { fontSize: '16px', color: '#ccc', lineHeight: '1.5', margin: 0 },
    gridContainer: { display: 'flex', justifyContent: 'center', gap: '25px', padding: '40px 20px', flexWrap: 'wrap' },
    card: { backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '280px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderTop: '4px solid #ff7f00' }
};

export default Home;