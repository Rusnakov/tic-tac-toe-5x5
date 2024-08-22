import React, { useState } from 'react';

// Typy dla propsów komponentu
interface AuthFormProps {
    onSubmit: (email: string, password: string, username: string, isLogin: boolean) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [username, setUsername] = useState<string>(''); // Dodajemy pole username
    const [isLogin, setIsLogin] = useState<boolean>(true);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSubmit(email, password, username, isLogin);
    };

    return (
        <div style={styles.container}>
            <h2>{isLogin ? 'Logowanie' : 'Rejestracja'}</h2>
            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                {!isLogin && (
                    <div style={styles.formGroup}>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                )}
                <div style={styles.formGroup}>
                    <label>Hasło:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.button}>
                    {isLogin ? 'Zaloguj się' : 'Zarejestruj się'}
                </button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)} style={styles.toggleButton}>
                {isLogin ? 'Nie masz konta? Zarejestruj się' : 'Masz już konto? Zaloguj się'}
            </button>
        </div>
    );
};

// Prosty obiekt ze stylami (inline styles)
const styles = {
    container: {
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        textAlign: 'center' as const,
    },
    formGroup: {
        marginBottom: '15px',
    },
    input: {
        width: '100%',
        padding: '10px',
        margin: '5px 0',
        boxSizing: 'border-box' as const,
    },
    button: {
        padding: '10px 20px',
        width: '100%',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        cursor: 'pointer' as const,
    },
    toggleButton: {
        marginTop: '10px',
        backgroundColor: 'transparent',
        border: 'none',
        color: '#007bff',
        cursor: 'pointer' as const,
    },
};

export default AuthForm;