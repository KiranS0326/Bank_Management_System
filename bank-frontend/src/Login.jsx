import { useState } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';

function Login() {
    // We keep 'email' in the state so the Java backend doesn't break, 
    // even though the UI label says "Account no".
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

	const handleSubmit = async (e) => {
	        e.preventDefault();
	        try {
	            const response = await api.post('/users/login', credentials);
	            setMessage('Login successful!');
	            
	            // Save the user data
	            const loggedInUser = response.data;
	            localStorage.setItem('user', JSON.stringify(loggedInUser));
	            
	            // Check the role and route them to the correct page!
	            if (loggedInUser.role === 'ADMIN') {
	                navigate('/admin-dashboard'); 
	            } else {
	                navigate('/customer-dashboard'); 
	            }
	            
	        } catch (error) {
	            setMessage(error.response?.data || 'Login failed. Check your credentials.');
	        }
	    };

    // Navigation and Reset handlers
    const handleSignup = () => navigate('/register');
    const handleReset = () => {
        setCredentials({ email: '', password: '' });
        setMessage('');
    };

    return (
        <div style={styles.container}>
            
            {/* LEFT SIDE - Form & Logos */}
            <div style={styles.leftPane}>
                
                {/* Top Header */}
                <div style={styles.header}>
                    {/* Replace this emoji with: <img src="/path-to-bank-icon.png" alt="bank" style={{width: '50px'}} /> */}
                    <span style={{ fontSize: '50px', marginRight: '15px' }}>🏦</span>
                    <h2 style={{ margin: 0, fontSize: '24px',color: '#b3b3b3' }}>WELCOME TO THE BANK</h2>
                </div>

                {/* Login Form Area */}
                <div style={styles.formContainer}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        {/* Replace this emoji with your user icon */}
                        <div style={{ fontSize: '60px', marginBottom: '10px' }}>👤</div>
                        <h3 style={{ margin: 0 }}>LOGIN</h3>
                    </div>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Register Email</label>
                            <input 
                                type="text" 
                                name="email" // Kept as email for the backend
                                value={credentials.email}
                                onChange={handleChange} 
                                style={styles.input} 
                                required 
                            />
                        </div>
                        
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                value={credentials.password}
                                onChange={handleChange} 
                                style={styles.input} 
                                required 
                            />
                        </div>

                        {/* Buttons */}
                        <div style={styles.buttonRow}>
                            <button type="submit" style={styles.blackButton}>LOGIN</button>
                            <button type="button" onClick={handleSignup} style={styles.blackButton}>SIGNUP</button>
                        </div>
                        <button type="button" onClick={handleReset} style={styles.resetButton}>RESET</button>

                        {message && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{message}</p>}
                    </form>
                </div>

                {/* Bottom Left Handshake Illustration */}
                <div style={styles.handshakeContainer}>
                    {/* Replace this emoji with your handshake image */}
                    <span style={{ fontSize: '100px' }}>🤝</span>
                </div>
            </div>

            {/* RIGHT SIDE - Large Illustration */}
            <div style={styles.rightPane}>
                <div style={styles.whiteCard}>
                    {/* Replace this emoji with your large mobile phone illustration */}
                    <span style={{ fontSize: '200px' }}>📱👨‍💻</span>
                </div>
            </div>
            
        </div>
    );
}

// --- INLINE STYLES TO MATCH YOUR IMAGE ---
const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#0f3460', // Deep navy background matching the hero section
        fontFamily: 'sans-serif',
        overflow: 'hidden'
    },
    leftPane: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '30px',
        backgroundColor: '#1a1a2e', // Dark navy matching header
        color: 'white'
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        color: 'white'
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '400px',
    },
    inputGroup: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
    },
    label: {
        fontWeight: 'bold',
        fontSize: '15px',
        width: '120px',
        color: 'white'
    },
    input: {
        flex: 1,
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        outline: 'none',
        backgroundColor: '#fff',
        color: '#333'
    },
    buttonRow: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '10px',
        marginTop: '10px',
    },
    blackButton: {
        backgroundColor: '#ff7f00', // Striking Orange matching the Login button from your home page
        color: 'white',
        border: 'none',
        padding: '10px 30px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '12px',
        borderRadius: '4px'
    },
    resetButton: {
        backgroundColor: '#0f3460', // Accent blue
        color: 'white',
        border: 'none',
        padding: '10px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '12px',
        width: '100%',
        maxWidth: '220px',
        margin: '0 auto',
        borderRadius: '4px'
    },
    handshakeContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        paddingLeft: '20px'
    },
    rightPane: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '30px',
    },
    whiteCard: {
        backgroundColor: 'white', // Clean white card layout matching the feature cards
        width: '100%',
        height: '90%',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        borderTop: '4px solid #ff7f00' // Orange top border accent
    }
};

export default Login;