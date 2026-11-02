import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

function Dashboard() {
    const [activeTab, setActiveTab] = useState('accountCreation');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Security Check: Ensure the user is actually logged in before showing the dashboard
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    // --- ADMIN COMPONENT VIEWS ---
    
    const UserAccountCreation = () => {
        const [accountData, setAccountData] = useState({
            userEmail: '',
            accountType: 'SAVINGS',
            initialBalance: ''
        });
        const [message, setMessage] = useState('');

        const handleChange = (e) => {
            setAccountData({ ...accountData, [e.target.name]: e.target.value });
        };

        const handleCreateAccount = async (e) => {
            e.preventDefault();
            try {
                const response = await api.post('/accounts/create', accountData);
                setMessage('Bank Account created successfully!');
                setAccountData({ userEmail: '', accountType: 'SAVINGS', initialBalance: '' });
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                console.error(error);
                setMessage('Failed to create account. Ensure the user email exists.');
            }
        };

        return (
            <div style={styles.card}>
                <h3 style={{ borderBottom: '2px solid #f4f7f6', paddingBottom: '10px' }}>User Account Creation</h3>
                <p style={{ color: '#555', fontSize: '14px' }}>Create a new financial account (Savings/Current) for an existing registered user.</p>
                
                <form onSubmit={handleCreateAccount} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px', marginTop: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Customer Email</label>
                        <input type="email" name="userEmail" value={accountData.userEmail} onChange={handleChange} style={styles.input} placeholder="e.g., customer@bank.com" required />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Account Type</label>
                        <select name="accountType" value={accountData.accountType} onChange={handleChange} style={{ ...styles.input, cursor: 'pointer' }}>
                            <option value="SAVINGS">Savings Account</option>
                            <option value="CURRENT">Current Account</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Initial Deposit (₹)</label>
                        <input type="number" name="initialBalance" value={accountData.initialBalance} onChange={handleChange} style={styles.input} placeholder="0.00" min="0" step="0.01" required />
                    </div>

                    <button type="submit" style={{ ...styles.actionButton, marginTop: '10px' }}>+ Create New Account</button>
                    
                    {message && (
                        <p style={{ color: message.includes('successfully') ? 'green' : 'red', fontWeight: 'bold', textAlign: 'center' }}>
                            {message}
                        </p>
                    )}
                </form>
            </div>
        );
    };

    // --- NEW: LOAN MANAGEMENT COMPONENT ---
    const LoanManagement = () => {
        const [loans, setLoans] = useState([]);

        const fetchAllLoans = async () => {
            try {
                const response = await api.get('/loans/all');
                setLoans(response.data);
            } catch (error) {
                console.error("Failed to fetch loans", error);
            }
        };

        useEffect(() => {
            fetchAllLoans();
        }, []);

        const updateStatus = async (id, newStatus) => {
            try {
                await api.put(`/loans/${id}/status`, { status: newStatus });
                fetchAllLoans(); // Refresh the list automatically
            } catch (error) {
                alert("Failed to update status");
            }
        };

        return (
            <div style={styles.card}>
                <h3 style={{ borderBottom: '2px solid #f4f7f6', paddingBottom: '10px' }}>Review Loan Applications</h3>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Customer Email</th>
                            <th style={styles.th}>Loan Type</th>
                            <th style={styles.th}>Amount</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.length === 0 ? (
                            <tr><td colSpan="5" style={{...styles.td, textAlign: 'center', color: '#888'}}>No pending applications.</td></tr>
                        ) : (
                            loans.map((loan) => (
                                <tr key={loan.id}>
                                    <td style={styles.td}>{loan.userEmail}</td>
                                    <td style={styles.td}>{loan.loanType}</td>
                                    <td style={styles.td}>₹ {loan.amount.toFixed(2)}</td>
                                    <td style={{
                                        ...styles.td, 
                                        fontWeight: 'bold', 
                                        color: loan.status === 'APPROVED' ? 'green' : loan.status === 'REJECTED' ? 'red' : 'orange'
                                    }}>
                                        {loan.status}
                                    </td>
                                    <td style={styles.td}>
                                        {loan.status === 'PENDING' ? (
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button onClick={() => updateStatus(loan.id, 'APPROVED')} style={{backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>Approve</button>
                                                <button onClick={() => updateStatus(loan.id, 'REJECTED')} style={{backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>Reject</button>
                                            </div>
                                        ) : (
                                            <span style={{ color: '#888', fontStyle: 'italic' }}>Processed</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

	const CustomerAccountManagement = () => {
	        const [accounts, setAccounts] = useState([]);
	        const [loading, setLoading] = useState(true);

	        const fetchAllAccounts = async () => {
	            try {
	                const response = await api.get('/accounts/all');
	                setAccounts(response.data);
	            } catch (error) {
	                console.error("Failed to fetch all accounts", error);
	            } finally {
	                setLoading(false);
	            }
	        };

	        useEffect(() => {
	            fetchAllAccounts();
	        }, []);

	        const toggleAccountStatus = async (accountNumber, currentStatus) => {
	            // Swap the status depending on what it currently is
	            const newStatus = currentStatus === 'ACTIVE' ? 'FROZEN' : 'ACTIVE';
	            
	            try {
	                await api.put(`/accounts/${accountNumber}/status`, { status: newStatus });
	                fetchAllAccounts(); // Refresh the table immediately to show the new status
	            } catch (error) {
	                alert("Failed to update account status.");
	            }
	        };

	        return (
	            <div style={styles.card}>
	                <h3 style={{ borderBottom: '2px solid #f4f7f6', paddingBottom: '10px' }}>Customer Account Management</h3>
	                <p style={{ color: '#555', fontSize: '14px' }}>View, edit, or freeze existing customer accounts.</p>
	                
	                <table style={styles.table}>
	                    <thead>
	                        <tr>
	                            <th style={styles.th}>Account ID</th>
	                            <th style={styles.th}>Customer Email</th>
	                            <th style={styles.th}>Type</th>
	                            <th style={styles.th}>Balance</th>
	                            <th style={styles.th}>Status</th>
	                            <th style={styles.th}>Action</th>
	                        </tr>
	                    </thead>
	                    <tbody>
	                        {loading ? (
	                            <tr><td colSpan="6" style={{...styles.td, textAlign: 'center'}}>Loading accounts...</td></tr>
	                        ) : accounts.length === 0 ? (
	                            <tr><td colSpan="6" style={{...styles.td, textAlign: 'center', color: '#888'}}>No accounts found in the system.</td></tr>
	                        ) : (
	                            accounts.map((acc, index) => (
	                                <tr key={index}>
	                                    <td style={styles.td}>{acc.accountNumber}</td>
	                                    <td style={styles.td}>{acc.user ? acc.user.email : 'N/A'}</td>
	                                    <td style={styles.td}>{acc.accountType}</td>
	                                    <td style={styles.td}>₹ {acc.balance.toFixed(2)}</td>
	                                    <td style={{
	                                        ...styles.td, 
	                                        fontWeight: 'bold', 
	                                        color: acc.status === 'FROZEN' ? '#e74c3c' : '#2ecc71'
	                                    }}>
	                                        {acc.status || 'ACTIVE'}
	                                    </td>
	                                    <td style={styles.td}>
	                                        <button 
	                                            onClick={() => toggleAccountStatus(acc.accountNumber, acc.status || 'ACTIVE')}
	                                            style={{
	                                                ...styles.editButton,
	                                                backgroundColor: acc.status === 'FROZEN' ? '#2ecc71' : '#e74c3c',
	                                                padding: '8px 12px',
	                                                fontWeight: 'bold'
	                                            }}
	                                        >
	                                            {acc.status === 'FROZEN' ? 'Unfreeze' : 'Freeze'}
	                                        </button>
	                                    </td>
	                                </tr>
	                            ))
	                        )}
	                    </tbody>
	                </table>
	            </div>
	        );
	    };

    const CustomerSupport = () => (
        <div style={styles.card}>
            <h3>Customer Support</h3>
            <p>View active tickets and respond to customer inquiries.</p>
            <div style={{ border: '1px solid #ddd', padding: '15px', marginTop: '10px' }}>
                <strong>Ticket #8842:</strong> "I forgot my transaction PIN."
                <br/>
                <button style={{...styles.actionButton, marginTop: '10px'}}>Reply to Ticket</button>
            </div>
        </div>
    );

    const AuditSupport = () => (
        <div style={styles.card}>
            <h3>Audit Support</h3>
            <p>System logs and transaction history for compliance audits.</p>
            <div style={{ backgroundColor: '#1e1e1e', color: '#00ff00', padding: '15px', fontFamily: 'monospace', height: '150px', overflowY: 'scroll' }}>
                [2026-08-02 14:02:11] ADMIN login successful from IP 192.168.1.5<br/>
                [2026-08-02 14:15:22] ACC_10024 Balance updated by SYSTEM<br/>
                [2026-08-02 14:30:05] ADMIN initiated Account Creation...<br/>
            </div>
        </div>
    );

    // --- MAIN RENDER ---
    if (!user) return <div style={{textAlign: 'center', marginTop: '50px'}}>Loading...</div>;

    return (
        <div style={styles.container}>
            
            {/* SIDEBAR */}
            <div style={styles.sidebar}>
                <div>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <span style={{ fontSize: '40px' }}>🏦</span>
                        <h3 style={{ color: 'white', margin: '10px 0 0 0' }}>Admin Panel</h3>
                        <p style={{ color: '#aaa', fontSize: '12px', marginTop: '5px' }}>Welcome, {user.name}</p>
                    </div>

                    <button style={activeTab === 'accountCreation' ? styles.activeNavBtn : styles.navBtn} onClick={() => setActiveTab('accountCreation')}>
                        User Account Creation
                    </button>
                    
                    {/* NEW LOAN BUTTON */}
                    <button style={activeTab === 'loans' ? styles.activeNavBtn : styles.navBtn} onClick={() => setActiveTab('loans')}>
                        Loan Applications
                    </button>

                    <button style={activeTab === 'management' ? styles.activeNavBtn : styles.navBtn} onClick={() => setActiveTab('management')}>
                        Customer Management
                    </button>
                    <button style={activeTab === 'support' ? styles.activeNavBtn : styles.navBtn} onClick={() => setActiveTab('support')}>
                        Customer Support
                    </button>
                    <button style={activeTab === 'audit' ? styles.activeNavBtn : styles.navBtn} onClick={() => setActiveTab('audit')}>
                        Audit Support
                    </button>
                </div>

                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </div>

            {/* MAIN CONTENT AREA */}
            <div style={styles.mainContent}>
                <div style={styles.header}>
                    <h2>Dashboard Overview</h2>
                    <span style={styles.roleBadge}>{user.role}</span>
                </div>

                <div style={styles.contentArea}>
                    {activeTab === 'accountCreation' && <UserAccountCreation />}
                    {activeTab === 'loans' && <LoanManagement />}
                    {activeTab === 'management' && <CustomerAccountManagement />}
                    {activeTab === 'support' && <CustomerSupport />}
                    {activeTab === 'audit' && <AuditSupport />}
                </div>
            </div>
        </div>
    );
}

// --- STYLES ---
const styles = {
    container: { 
        display: 'flex', 
        minHeight: '100vh', 
        backgroundColor: '#0f3460', // Deep navy background matching the login/home theme
        fontFamily: 'sans-serif' 
    },
    sidebar: { 
        width: '260px', 
        backgroundColor: '#1a1a2e', // Dark navy sidebar matching header theme
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        padding: '20px 0',
        boxShadow: '4px 0 10px rgba(0,0,0,0.1)'
    },
    navBtn: { 
        width: '100%', 
        padding: '15px 20px', 
        backgroundColor: 'transparent', 
        color: '#b3b3b3', 
        border: 'none', 
        textAlign: 'left', 
        cursor: 'pointer', 
        fontSize: '14px', 
        borderLeft: '4px solid transparent',
        transition: 'all 0.2s'
    },
    activeNavBtn: { 
        width: '100%', 
        padding: '15px 20px', 
        backgroundColor: '#16213e', 
        color: 'white', 
        border: 'none', 
        textAlign: 'left', 
        cursor: 'pointer', 
        fontSize: '14px', 
        borderLeft: '4px solid #ff7f00', // Orange accent matching the Home login button style
        fontWeight: 'bold' 
    },
    logoutBtn: { 
        margin: '0 20px', 
        padding: '10px', 
        backgroundColor: '#ff7f00', // Striking Orange matching home accents
        color: 'white', 
        border: 'none', 
        cursor: 'pointer', 
        fontWeight: 'bold', 
        borderRadius: '4px' 
    },
    mainContent: { 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        overflowY: 'auto',
        backgroundColor: '#f4f7f6' // Light content surface background to keep data readable inside white cards
    },
    header: { 
        backgroundColor: 'white', 
        padding: '20px 30px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
    },
    roleBadge: { 
        backgroundColor: '#0f3460', // Deep blue badge matching theme
        color: 'white', 
        padding: '6px 16px', 
        borderRadius: '15px', 
        fontSize: '12px', 
        fontWeight: 'bold' 
    },
    contentArea: { 
        padding: '30px' 
    },
    card: { 
        backgroundColor: 'white', 
        padding: '25px', 
        borderRadius: '8px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        borderTop: '4px solid #0f3460' // Top accent border matching features cards on Home page
    },
    balanceCard: { 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)', 
        flex: '1', 
        minWidth: '220px', 
        borderTop: '4px solid #ff7f00' // Orange accent for financial metric highlights
    },
    accountNumber: { 
        color: '#888', 
        margin: '5px 0', 
        fontSize: '14px' 
    },
    sectionTitle: { 
        borderBottom: '2px solid #f4f7f6', 
        paddingBottom: '10px', 
        margin: '0 0 10px 0',
        color: '#1a1a2e'
    },
    sectionDesc: { 
        color: '#555', 
        fontSize: '14px', 
        marginBottom: '20px' 
    },
    formContainer: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '15px', 
        maxWidth: '500px' 
    },
    inputGroup: { 
        display: 'flex', 
        flexDirection: 'column' 
    },
    label: { 
        fontWeight: 'bold', 
        marginBottom: '5px', 
        fontSize: '14px',
        color: '#1a1a2e'
    },
    input: { 
        padding: '10px', 
        border: '1px solid #ccc', 
        borderRadius: '4px', 
        outline: 'none', 
        fontSize: '14px', 
        width: '100%', 
        boxSizing: 'border-box' 
    },
    actionButton: { 
        backgroundColor: '#0f3460', // Consistent deep blue action button
        color: 'white', 
        border: 'none', 
        padding: '10px 20px', 
        cursor: 'pointer', 
        borderRadius: '4px', 
        fontWeight: 'bold', 
        width: 'max-content' 
    },
    editButton: { 
        backgroundColor: '#ff7f00', 
        color: 'white', 
        border: 'none', 
        padding: '6px 12px', 
        cursor: 'pointer', 
        borderRadius: '4px',
        fontWeight: 'bold'
    },
    downloadBtn: { 
        backgroundColor: '#f1f3f4', 
        color: '#333', 
        border: '1px solid #ccc', 
        padding: '6px 12px', 
        cursor: 'pointer', 
        borderRadius: '4px', 
        fontSize: '12px', 
        fontWeight: 'bold' 
    },
    table: { 
        width: '100%', 
        borderCollapse: 'collapse', 
        marginTop: '20px' 
    },
    th: { 
        textAlign: 'left', 
        padding: '12px', 
        borderBottom: '2px solid #ddd', 
        backgroundColor: '#f9f9f9', 
        fontSize: '14px',
        color: '#1a1a2e'
    },
    td: { 
        padding: '12px', 
        borderBottom: '1px solid #eee', 
        fontSize: '14px' 
    }
};

export default Dashboard;