import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setAuth, theme, toggleTheme }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage(null);
      await axios.post(`${API_URL}/login`, { email });
      setStep(2);
      setMessage({ type: 'success', text: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.msg || 'حدث خطأ أثناء إرسال الرمز' });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage(null);
      const res = await axios.post(`${API_URL}/verify`, { email, otp, rememberMe });
      setAuth(res.data.token);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.msg || 'الرمز غير صحيح أو منتهي الصلاحية' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>تسجيل الدخول</h2>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        {message && (
          <div style={{
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '5px',
            backgroundColor: message.type === 'error' ? 'var(--danger-color)' : 'var(--success-color)',
            color: 'white',
            textAlign: 'center'
          }}>
            {message.text}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={sendOtp}>
            <div className="form-group">
              <label className="form-label">البريد الإلكتروني:</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@gmail.com"
              />
            </div>
            <button type="submit" disabled={loading} className="btn" style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp}>
            <div className="form-group">
              <label className="form-label">رمز التحقق (OTP):</label>
              <input
                type="text"
                className="form-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="XXXXXX"
                style={{ letterSpacing: '5px', textAlign: 'center', fontSize: '1.2rem' }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <label htmlFor="rememberMe" style={{ cursor: 'pointer', color: 'var(--text-color)' }}>تذكرني</label>
            </div>

            <button type="submit" disabled={loading} className="btn" style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'جاري التحقق...' : 'تأكيد الدخول'}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              style={{
                marginTop: '15px',
                background: 'none',
                color: 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                textDecoration: 'underline'
              }}
            >
              تغيير البريد الإلكتروني
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
