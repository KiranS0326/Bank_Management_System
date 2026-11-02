import { useState } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'CUSTOMER'
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users/register', user);
            setMessage('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000); 
        } catch (error) {
            console.error(error);
            setMessage('Registration failed. Check your connection.');
        }
    };

    // Navigation and Reset handlers
    const handleLogin = () => navigate('/login');
    const handleReset = () => {
        setUser({ name: '', email: '', password: '', role: 'CUSTOMER' });
        setMessage('');
    };
	<select 
	    name="role" 
	    value={user.role} 
	    onChange={handleChange} 
	    style={{ ...styles.input, cursor: 'pointer' }}
	>
	    <option value="CUSTOMER">CUSTOMER</option>
	    <option value="ADMIN">ADMIN</option>
	</select>

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

                {/* Register Form Area */}
                <div style={styles.formContainer}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        {/* Replace this emoji with your user icon */}
                        <div style={{ fontSize: '60px', marginBottom: '10px' }}>📝</div>
                        <h3 style={{ margin: 0 }}>SIGNUP</h3>
                    </div>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Full Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={user.name}
                                onChange={handleChange} 
                                style={styles.input} 
                                required 
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email Address</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={user.email}
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
                                value={user.password}
                                onChange={handleChange} 
                                style={styles.input} 
                                required 
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Account Role</label>
                            <select 
                                name="role" 
                                value={user.role} 
                                onChange={handleChange} 
                                style={{ ...styles.input, cursor: 'pointer' }}
                            >
                                <option value="CUSTOMER">Customer</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>

                        {/* Buttons */}
                        <div style={styles.buttonRow}>
                            <button type="submit" style={styles.blackButton}>REGISTER</button>
                            <button type="button" onClick={handleLogin} style={styles.blackButton}>LOGIN</button>
                        </div>
                        <button type="button" onClick={handleReset} style={styles.resetButton}>RESET</button>

                        {message && (
                            <p style={{ color: message.includes('successful') ? 'green' : 'red', textAlign: 'center', marginTop: '10px', fontWeight: 'bold' }}>
                                {message}
                            </p>
                        )}
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
                    <span style={{ fontSize: '200px' }}>📱👩‍💻</span>
                </div>
            </div>
            
        </div>
    );
}

// --- INLINE STYLES MATCHING THE LOGIN PAGE ---
const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#0f3460', // Deep navy background
        fontFamily: 'sans-serif',
        overflow: 'hidden'
    },
    leftPane: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '30px',
        backgroundColor: '#1a1a2e',
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
        maxWidth: '450px',
    },
    inputGroup: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '15px',
    },
    label: {
        fontWeight: 'bold',
        fontSize: '15px',
        width: '130px',
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
        backgroundColor: '#163172', // Dark blue matching the Register button from your home page
        color: 'white',
        border: 'none',
        padding: '10px 30px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '12px',
        borderRadius: '4px'
    },
    resetButton: {
        backgroundColor: '#ff7f00', // Orange accent for reset
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
        backgroundColor: 'white',
        width: '100%',
        height: '90%',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        borderTop: '4px solid #163172' // Dark blue top border accent
    }
};

export default Register;