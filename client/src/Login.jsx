import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const API_URL = 'http://localhost:5000/api';

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
      const res = await axios.post(`${API_URL}/verify`, { email, otp });
      setAuth(res.data.token);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.msg || 'الرمز غير صحيح أو منتهي الصلاحية' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f4f8' }}>
      <div className="login-container" style={{ direction: 'rtl' }}>
        <h2 style={{ marginBottom: '20px', color: '#1e3a8a' }}>تسجيل الدخول - مخطط رمضان</h2>

        {message && (
          <div style={{
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '5px',
            backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce7',
            color: message.type === 'error' ? '#991b1b' : '#166534'
          }}>
            {message.text}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={sendOtp}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>البريد الإلكتروني:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@gmail.com"
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              {loading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>رمز التحقق (OTP):</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="أدخل الرمز المكون من 6 أرقام"
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              {loading ? 'جاري التحقق...' : 'تأكيد الدخول'}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              style={{ marginTop: '10px', background: 'none', color: '#666', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}
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
