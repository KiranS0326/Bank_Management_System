import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

function CustomerDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Security Check
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

    // --- CUSTOMER COMPONENT VIEWS ---

    const BalanceOverview = () => {
        const [accounts, setAccounts] = useState([]);
        const [loading, setLoading] = useState(true);
        const [showDetails, setShowDetails] = useState(false);

        useEffect(() => {
            const fetchAccounts = async () => {
                try {
                    const response = await api.get(`/accounts/user/${user.email}`);
                    setAccounts(response.data);
                } catch (error) {
                    console.error("Failed to fetch accounts", error);
                } finally {
                    setLoading(false);
                }
            };
            if (user?.email) {
                fetchAccounts();
            }
        }, [user.email]);

        if (loading) return <div style={{ padding: '20px' }}>Loading real-time balances...</div>;

        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f4f7f6', paddingBottom: '10px', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0 }}>Account Balances</h3>
                    <button 
                        onClick={() => setShowDetails(!showDetails)}
                        style={{ ...styles.actionButton, backgroundColor: showDetails ? '#e74c3c' : '#0f3460', fontSize: '12px', padding: '5px 15px' }}
                    >
                        {showDetails ? 'Hide Details' : 'View Account Details'}
                    </button>
                </div>
                <p style={styles.sectionDesc}>Check your real-time available balances across all accounts.</p>

                {showDetails && (
                    <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '5px', marginBottom: '20px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#0f3460' }}>My Profile & Details</h4>
                        
                        <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Email Address:</strong> {user?.email}</p>
                        
                        <div style={{ margin: '5px 0', fontSize: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                            <strong>Registered Phone:</strong> {user?.phone || '+91 Not Provided'}
                            <button 
                                onClick={() => setActiveTab('profile')} 
                                style={{ backgroundColor: '#f1f3f4', border: '1px solid #ccc', borderRadius: '4px', padding: '2px 8px', color: '#333', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                            >
                                {user?.phone ? 'Edit' : 'Add Phone'}
                            </button>
                        </div>

                        {accounts.length > 0 && (
                            <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Primary Account No:</strong> {accounts[0].accountNumber}</p>
                        )}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    {accounts.length === 0 ? (
                        <div style={{ ...styles.card, width: '100%' }}>
                            <p style={{ color: '#888' }}>You currently have no active accounts.</p>
                        </div>
                    ) : (
                        accounts.map((acc, index) => (
                            <div key={index} style={styles.balanceCard}>
                                <h4>{acc.accountType} Account</h4>
                                <p style={styles.accountNumber}>
                                    **** {acc.accountNumber ? acc.accountNumber.slice(-4) : 'XXXX'}
                                </p>
                                <h2 style={{ margin: '10px 0', color: '#0f3460' }}>
                                    ₹ {acc.balance.toFixed(2)}
                               </h2>
                                <p style={{ color: 'green', fontSize: '12px' }}>Available Balance</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    const TransactionHistory = () => {
        const [transactions, setTransactions] = useState([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const fetchTransactions = async () => {
                try {
                    const response = await api.get(`/transactions/user/${user.email}`);
                    const sortedTxs = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    setTransactions(sortedTxs);
                } catch (error) {
                    console.error("Failed to fetch transactions", error);
                } finally {
                    setLoading(false);
                }
            };
            if (user?.email) fetchTransactions();
        }, [user.email]);

        return (
            <div style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f4f7f6', paddingBottom: '10px' }}>
                    <h3>Transaction History & Statements</h3>
                    <div>
                        <button style={styles.downloadBtn}>📄 PDF Statement</button>
                    </div>
                </div>
                
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>Description</th>
                            <th style={styles.th}>Type</th>
                            <th style={styles.th}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{...styles.td, textAlign: 'center'}}>Loading...</td></tr>
                        ) : transactions.length === 0 ? (
                            <tr><td colSpan="4" style={{...styles.td, textAlign: 'center', color: '#888'}}>No transactions found.</td></tr>
                        ) : (
                            transactions.map((tx, index) => {
                                const isBillPayment = tx.toAccountNumber === 'BILLER';
                                const typeText = isBillPayment ? 'Withdrawal' : 'Transfer';
                                const description = isBillPayment ? 'Bill Payment' : `To: ${tx.toAccountNumber}`;
                                
                                return (
                                    <tr key={index}>
                                        <td style={styles.td}>
                                            {tx.timestamp ? new Date(tx.timestamp).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td style={styles.td}>{description}</td>
                                        <td style={styles.td}>{typeText}</td>
                                        <td style={{...styles.td, color: isBillPayment ? 'red' : 'green'}}>
                                            {isBillPayment ? '-' : '+'} ₹ {tx.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    const BillPayment = () => {
        const [amount, setAmount] = useState('');
        const [payMessage, setPayMessage] = useState('');

        const handlePaymentSubmit = async () => {
            if (!amount || amount <= 0) {
                setPayMessage("Please enter a valid amount.");
                return;
            }
            try {
                const response = await api.post('/transactions/pay-bill', {
                    email: user.email,
                    amount: amount
                });
                setPayMessage(`✅ ${response.data.message}. New Balance: ₹${response.data.newBalance}`);
                setAmount(''); 
            } catch (error) {
                setPayMessage(`❌ ${error.response?.data || 'Payment failed.'}`);
            }
        };

        return (
            <div style={styles.card}>
                <h3 style={styles.sectionTitle}>Bill Payment</h3>
                <p style={styles.sectionDesc}>Set up one-time or recurring payments for utilities, rent, or subscriptions.</p>
                
                <form style={styles.formContainer}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Payee / Biller</label>
                        <select style={styles.input}>
                            <option>Electric Utility</option>
                            <option>Internet Service</option>
                            <option>Apartment Rent</option>
                        </select>
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Amount (₹)</label>
                        <input type="number" placeholder="0.00" style={styles.input} value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </div>
                    <button type="button" onClick={handlePaymentSubmit} style={styles.actionButton}>Submit Payment</button>
                    {payMessage && <p style={{ marginTop: '15px', fontWeight: 'bold', color: payMessage.includes('✅') ? 'green' : 'red' }}>{payMessage}</p>}
                </form>
            </div>
        );
    };

    const LoanApplications = () => {
        const [loanType, setLoanType] = useState('Personal Loan');
        const [amount, setAmount] = useState('');
        const [myLoans, setMyLoans] = useState([]);
        const [message, setMessage] = useState('');

        const fetchMyLoans = async () => {
            try {
                const response = await api.get(`/loans/user/${user.email}`);
                setMyLoans(response.data);
            } catch (error) {
                console.error("Failed to fetch loans");
            }
        };

        useEffect(() => {
            if (user?.email) fetchMyLoans();
        }, [user.email]);

        const handleApply = async () => {
            if (!amount || amount <= 0) {
                setMessage("❌ Please enter a valid amount.");
                return;
            }
            try {
                await api.post('/loans/apply', {
                    userEmail: user.email,
                    loanType: loanType,
                    amount: parseFloat(amount)
                });
                setMessage("✅ Application submitted successfully!");
                setAmount('');
                fetchMyLoans();
            } catch (error) {
                setMessage("❌ Failed to submit application.");
            }
        };

        return (
            <div style={styles.card}>
                <h3 style={styles.sectionTitle}>Apply for a New Loan</h3>
                <form style={styles.formContainer}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Application Type</label>
                        <select style={styles.input} value={loanType} onChange={(e) => setLoanType(e.target.value)}>
                            <option>Personal Loan</option>
                            <option>Home Mortgage</option>
                            <option>Auto Financing</option>
                        </select>
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Requested Amount (₹)</label>
                        <input type="number" style={styles.input} value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Upload Documents (Simulated)</label>
                        <input type="file" style={{...styles.input, padding: '7px'}} />
                    </div>
                    <button type="button" onClick={handleApply} style={styles.actionButton}>Submit Application</button>
                    {message && <p style={{fontWeight: 'bold', marginTop: '10px'}}>{message}</p>}
                </form>

                <h3 style={{...styles.sectionTitle, marginTop: '40px'}}>My Applications</h3>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Type</th>
                            <th style={styles.th}>Amount</th>
                            <th style={styles.th}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myLoans.map((loan, idx) => (
                            <tr key={idx}>
                                <td style={styles.td}>{loan.loanType}</td>
                                <td style={styles.td}>₹ {loan.amount.toFixed(2)}</td>
                                <td style={{...styles.td, fontWeight: 'bold', color: loan.status === 'APPROVED' ? 'green' : loan.status === 'REJECTED' ? 'red' : 'orange'}}>
                                    {loan.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

	const ProfileUpdates = () => {
	        const [formData, setFormData] = useState({ phone: '', mailingAddress: '', currentPassword: '', newPassword: '' });

	        const handleChange = (e) => {
	            setFormData({ ...formData, [e.target.name]: e.target.value });
	        };

	        const handleSaveProfile = async () => {
	            if (!formData.currentPassword) {
	                alert("❌ Please enter your current password to authorize changes.");
	                return;
	            }

	            try {
	                // Send update request to backend
	                await api.put('/users/update-profile', {
	                    email: user.email,
	                    currentPassword: formData.currentPassword,
	                    phone: formData.phone,
	                    mailingAddress: formData.mailingAddress,
	                    newPassword: formData.newPassword
	                });
	                
	                // Update local storage and React user state
	                const updatedUser = { ...user };
	                if (formData.phone) updatedUser.phone = formData.phone;
	                if (formData.mailingAddress) updatedUser.mailingAddress = formData.mailingAddress;
	                
	                localStorage.setItem('user', JSON.stringify(updatedUser));
	                setUser(updatedUser); 

	                // --- BUILD THE EXACT SUCCESS POPUPS ---
	                let successMessages = [];
	                if (formData.phone && formData.phone.trim() !== '') {
	                    successMessages.push("Phone no. add successfully!");
	                }
	                if (formData.mailingAddress && formData.mailingAddress.trim() !== '') {
	                    successMessages.push("Mailing address updated successfully!");
	                }
	                if (formData.newPassword && formData.newPassword.trim() !== '') {
	                    successMessages.push("Password change successfully!");
	                }

	                if (successMessages.length === 0) {
	                    alert("✅ Profile updated successfully!");
	                } else {
	                    alert("✅ " + successMessages.join("\n"));
	                }

	                // Clear input fields
	                setFormData({ phone: '', mailingAddress: '', currentPassword: '', newPassword: '' }); 

	            } catch (error) {
	                console.error("Profile update error:", error);
	                const errorMsg = error.response?.data || error.message || 'Failed to update profile.';
	                alert(`❌ ${typeof errorMsg === 'string' ? errorMsg : 'Failed to update profile.'}`);
	            }
	        };

	        return (
	            <div style={styles.card}>
	                <h3 style={styles.sectionTitle}>Profile Updates</h3>
	                <p style={styles.sectionDesc}>Manage your personal details and security credentials.</p>

	                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px' }}>
	                    <div style={{ flex: '1 1 45%' }}>
	                        <label style={styles.label}>Email Address (Read Only)</label>
	                        <input type="email" value={user?.email || ''} style={{...styles.input, backgroundColor: '#f0f0f0'}} readOnly />
	                    </div>
	                    <div style={{ flex: '1 1 45%' }}>
	                        <label style={styles.label}>Phone Number</label>
	                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder={user?.phone || "+91"} style={styles.input} />
	                    </div>
	                    
	                    <div style={{ flex: '1 1 100%' }}>
	                        <label style={styles.label}>Mailing Address</label>
	                        <input type="text" name="mailingAddress" value={formData.mailingAddress} onChange={handleChange} placeholder="Street, City, State, ZIP" style={styles.input} />
	                    </div>

	                    <div style={{ flex: '1 1 100%', borderTop: '1px solid #eee', marginTop: '10px', paddingTop: '20px', display: 'flex', gap: '20px' }}>
	                        <div style={{ flex: '1 1 45%' }}>
	                            <label style={{...styles.label, color: '#e74c3c'}}>Current Password (Required)</label>
	                            <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} placeholder="Confirm current password" style={{...styles.input, border: '1px solid #e74c3c'}} />
	                        </div>
	                        <div style={{ flex: '1 1 45%' }}>
	                            <label style={styles.label}>New Password (Optional)</label>
	                            <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="Enter only to change password" style={styles.input} />
	                        </div>
	                    </div>

	                    <div style={{ flex: '1 1 100%', display: 'flex', justifyContent: 'flex-start', marginTop: '10px' }}>
	                        <button type="button" onClick={handleSaveProfile} style={styles.actionButton}>Save Changes</button>
	                    </div>
	                </div>
	            </div>
	        );
	    };
    // --- MAIN RENDER ---
    
    if (!user) return <div style={{textAlign: 'center', marginTop: '50px'}}>Loading...</div>;

    return (
        <div style={styles.container}>
            {/* SIDEBAR */}
            <div style={styles.sidebar}>
                <div>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <span style={{ fontSize: '40px' }}>🏦</span>
                        <h3 style={{ color: 'white', margin: '10px 0 0 0' }}>My Bank</h3>
                        <p style={{ color: '#aaa', fontSize: '12px', marginTop: '5px' }}>Welcome, {user.name}</p>
                    </div>

                    <button style={activeTab === 'overview' ? styles.activeNavBtn : styles.navBtn} onClick={() => setActiveTab('overview')}>
                        Balance Overview
                    </button>
                    <button style={activeTab === 'transactions' ? styles.activeNavBtn : styles.navBtn} onClick={() => setActiveTab('transactions')}>
                        Transactions & Statements
                    </button>
                    <button style={activeTab === 'bills' ? styles.activeNavBtn : styles.navBtn} onClick={() => setActiveTab('bills')}>
                        Bill Payment
                    </button>
                    <button style={activeTab === 'loans' ? styles.activeNavBtn : styles.navBtn} onClick={() => setActiveTab('loans')}>
                        Loans & Credit
                    </button>
                    <button style={activeTab === 'profile' ? styles.activeNavBtn : styles.navBtn} onClick={() => setActiveTab('profile')}>
                        Profile Updates
                    </button>
                </div>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </div>

            {/* MAIN CONTENT AREA */}
            <div style={styles.mainContent}>
                <div style={styles.header}>
                    <h2>Customer Portal</h2>
                    <span style={styles.roleBadge}>Secure Connection</span>
                </div>

                <div style={styles.contentArea}>
                    {activeTab === 'overview' && <BalanceOverview />}
                    {activeTab === 'transactions' && <TransactionHistory />}
                    {activeTab === 'bills' && <BillPayment />}
                    {activeTab === 'loans' && <LoanApplications />}
                    {activeTab === 'profile' && <ProfileUpdates />}
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

export default CustomerDashboard;