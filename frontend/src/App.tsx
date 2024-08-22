import React from 'react';
import AuthForm from './components/AuthForm';
import logo from './logo.svg';
import './App.css';

const App: React.FC = () => {
  const handleAuth = async (email: string, password: string, username: string, isLogin: boolean) => {
    const url = isLogin ? '/backend/src/routes/login' : '/backend/src/routes/register';
    const body = isLogin ? { email, password } : { email, password, username };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        // Obsługa błędów z serwera
        alert(data.message || 'Wystąpił błąd');
      } else {
        // Zalogowano pomyślnie lub zarejestrowano, można np. przechować token
        console.log('Sukces', data);
        if (isLogin) {
          localStorage.setItem('token', data.token);
        } else {
          alert('Rejestracja zakończona sukcesem. Możesz się teraz zalogować.');
        }
      }
    } catch (error) {
      console.error('Błąd:', error);
      alert('Wystąpił błąd');
    }
  };

  return (
    <div>
      <h1> Moja gra w kółko i krzyżyk</h1>
      <AuthForm onSubmit={handleAuth} />
    </div>
  );
};

export default App;