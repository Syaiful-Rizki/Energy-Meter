// =====================================================
// LOGIN PAGE
// Firebase Email/Password authentication
// =====================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MdLock, MdPerson, MdLogin, MdSensors } from 'react-icons/md';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signedUpEmail, setSignedUpEmail] = useState('');
  const [signedUpPassword, setSignedUpPassword] = useState('');
  const [showSignupSuccessModal, setShowSignupSuccessModal] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [toast, setToast] = useState({ text: '', type: 'success', visible: false });
  const { login, resetPassword, signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!toast.visible) return;

    const timer = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 4500);

    return () => clearTimeout(timer);
  }, [toast.visible]);

  const showToast = (text, type = 'success') => {
    setToast({ text, type, visible: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (isSignUp) {
      // Sign up flow
      if (password !== confirmPassword) {
        setError('Password dan konfirmasi tidak cocok');
        setLoading(false);
        return;
      }

      try {
        await signup(email, password);
        // store created credentials temporarily to prefill sign-in
        setSignedUpEmail(email);
        setSignedUpPassword(password);
        // show success modal and switch to sign-in view (but do not auto-login)
        setShowSignupSuccessModal(true);
        setIsSignUp(false);
      } catch (err) {
        console.error('Signup error:', err);
        switch (err.code) {
          case 'auth/email-already-in-use':
            setError('Email sudah terdaftar');
            break;
          case 'auth/weak-password':
            setError('Password terlalu lemah (minimal 6 karakter)');
            break;
          case 'auth/invalid-email':
            setError('Format email tidak valid');
            break;
          default:
            setError('Pendaftaran gagal. Silakan coba lagi.');
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Existing login flow
      try {
        await login(email, password);
        navigate('/dashboard');
      } catch (err) {
        console.error('Login error:', err);
        switch (err.code) {
          case 'auth/user-not-found':
            setError('Akun tidak ditemukan');
            break;
          case 'auth/wrong-password':
            setError('Password salah');
            break;
          case 'auth/invalid-email':
            setError('Format email tidak valid');
            break;
          case 'auth/invalid-credential':
            setError('Email atau password salah');
            break;
          default:
            setError('Login gagal. Silakan coba lagi.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Masukkan email terlebih dahulu');
      return;
    }

    setError('');
    setMessage('');
    setResetting(true);

    try {
      await resetPassword(email);
      setMessage('Link reset password telah dikirim ke email');
      showToast('Link reset password telah dikirim ke email', 'success');
    } catch (err) {
      console.error('Reset password error:', err);

      let errorText = 'Gagal mengirim reset password';

      switch (err.code) {
        case 'auth/user-not-found':
          errorText = 'Email tidak terdaftar';
          setError(errorText);
          break;

        case 'auth/invalid-email':
          errorText = 'Format email tidak valid';
          setError(errorText);
          break;

        default:
          setError(errorText);
      }

      showToast(errorText, 'error');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg">
        <div className="login-bg-grid"></div>
        <div className="login-bg-glow login-bg-glow-1"></div>
        <div className="login-bg-glow login-bg-glow-2"></div>
        <div className="login-bg-glow login-bg-glow-3"></div>
        {/* Floating particles */}
        <div className="login-particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="login-particle" style={{
              '--x': `${Math.random() * 100}%`,
              '--y': `${Math.random() * 100}%`,
              '--duration': `${3 + Math.random() * 4}s`,
              '--delay': `${Math.random() * 3}s`,
              '--size': `${2 + Math.random() * 4}px`,
            }}></div>
          ))}
        </div>
      </div>

      {/* Login Card */}
      <div className="login-card">
        <div className="login-card-inner">
          {/* Logo */}
          <div className="login-logo">
            <div className="login-logo-circle">
              <MdSensors size={36} />
            </div>
          </div>

          <h2 className="login-title">Energy Meter Login</h2>
          <p className="login-subtitle">Masuk untuk mengelola sistem monitoring</p>

          {/* Error Message */}
          {error && (
            <div className="login-error">
              <span>{error}</span>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className="login-message">
              <span>{message}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="email">Email</label>
              <div className="login-input-wrapper">
                <MdPerson size={20} className="login-input-icon" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <div className="login-input-wrapper">
                <MdLock size={20} className="login-input-icon" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>
            {isSignUp && (
              <div className="login-field">
                <label htmlFor="confirmPassword">Konfirmasi Password</label>
                <div className="login-input-wrapper">
                  <MdLock size={20} className="login-input-icon" />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required={isSignUp}
                    autoComplete="new-password"
                  />
                </div>
              </div>
            )}
                {/* Lupa Password - tampil di bawah kolom password, sebelah kanan */}
                {!isSignUp && (
                  <div className="login-forgot-inline">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={resetting}
                      className="login-forgot-btn"
                    >
                      {resetting ? 'Mengirim...' : 'Lupa Password?'}
                    </button>
                  </div>
                )}

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="login-btn-loading"></span>
              ) : (
                <>
                  <MdLogin size={20} />
                  {isSignUp ? 'Daftar' : 'Login'}
                </>
              )}
            </button>

            {isSignUp && (
              <button
                type="button"
                className="back-btn"
                onClick={() => { setIsSignUp(false); setError(''); setMessage(''); }}
              >
                Kembali ke Login
              </button>
            )}

            {/* Signup button styled as secondary, placed below the login button */}
            {!isSignUp && (
              <button
                type="button"
                className="signup-btn"
                onClick={() => { setIsSignUp(true); setError(''); setMessage(''); }}
              >
                <MdPerson size={20} />
                Daftar
              </button>
            )}
          </form>

          {/* Signup success modal */}
          {showSignupSuccessModal && (
            <div className="signup-modal-overlay" onClick={() => setShowSignupSuccessModal(false)}>
              <div className="signup-modal" onClick={(e) => e.stopPropagation()}>
                <h3>Pendaftaran Berhasil</h3>
                <p>Akun Anda telah dibuat. Silakan masuk menggunakan akun yang baru dibuat.</p>
                <div className="signup-modal-actions">
                  <button onClick={() => { setShowSignupSuccessModal(false); setEmail(signedUpEmail); setPassword(signedUpPassword); }} className="primary">Masuk dengan Akun Ini</button>
                  <button onClick={() => setShowSignupSuccessModal(false)} className="muted">Tutup</button>
                </div>
              </div>
            </div>
          )}

          <p className="login-footer">© 2026 Energy Meter</p>
        </div>
      </div>

      {toast.visible && (
        <div className={`login-toast ${toast.type}`}>
          {toast.text}
        </div>
      )}
    </div>
  );
}
