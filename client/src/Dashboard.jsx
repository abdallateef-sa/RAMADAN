import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ token, logout, theme, toggleTheme }) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    fetchSchedule();
  }, [token]);

  const fetchSchedule = async () => {
    try {
      const res = await axios.get(`${API_URL}/schedule`, {
        headers: { 'x-auth-token': token }
      });
      const sorted = res.data.sort((a, b) => a.day - b.day);
      setSchedule(sorted);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = async (day, category, item, value) => {
    setSchedule(prev => prev.map(d => {
      if (d.day === day) {
        return {
          ...d,
          [category]: {
            ...d[category],
            [item]: value
          }
        };
      }
      return d;
    }));

    try {
      setSaving(true);
      await axios.post(`${API_URL}/schedule/update`,
        { day, category, item, value },
        { headers: { 'x-auth-token': token } }
      );
    } catch (err) {
      console.error("Failed to save", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-color)' }}>جاري التحميل...</div>;

  return (
    <div className="container">
      <header className="app-header">
        <h2 className="app-title">🌙 جدول أعمال رمضان</h2>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button onClick={logout} className="btn btn-danger">تسجيل الخروج</button>
        </div>
      </header>

      <div className="table-container">
        <table className="schedule-table">
          <thead>
            <tr className="header-row-1">
              <th rowSpan="3" className="th-day">اليوم</th>
              <th colSpan="8" className="th-salah">الصلاة</th>
              <th colSpan="3" className="th-azkar">أذكار</th>
              <th colSpan="3" className="th-quran">قرآن</th>
              <th colSpan="4" className="th-deeds">أعمال صالحة</th>
            </tr>
            <tr className="header-row-2">
              <th colSpan="5" className="th-salah" style={{ filter: 'brightness(1.1)' }}>الفروض (على وقتها)</th>
              <th colSpan="3" className="th-salah" style={{ filter: 'brightness(1.2)' }}>النوافل</th>
              <th rowSpan="2" className="th-azkar" style={{ filter: 'brightness(1.1)' }}>الصباح</th>
              <th rowSpan="2" className="th-azkar" style={{ filter: 'brightness(1.1)' }}>المساء</th>
              <th rowSpan="2" className="th-azkar" style={{ filter: 'brightness(1.1)' }}>أذكار ودعاء</th>
              <th rowSpan="2" className="th-quran" style={{ filter: 'brightness(1.1)' }}>ورد تلاوة</th>
              <th rowSpan="2" className="th-quran" style={{ filter: 'brightness(1.1)' }}>ورد تدبر</th>
              <th rowSpan="2" className="th-quran" style={{ filter: 'brightness(1.1)' }}>ورد سماع</th>
              <th rowSpan="2" className="th-deeds" style={{ filter: 'brightness(1.1)' }}>صدقة</th>
              <th rowSpan="2" className="th-deeds" style={{ filter: 'brightness(1.1)' }}>صلة الرحم</th>
              <th rowSpan="2" className="th-deeds" style={{ filter: 'brightness(1.1)' }}>إدخال سرور</th>
              <th rowSpan="2" className="th-deeds" style={{ filter: 'brightness(1.1)' }}>إفطار صائم</th>
            </tr>
            <tr className="header-row-3">
              <th className="th-salah" style={{ filter: 'brightness(1.2)' }}>فجر</th>
              <th className="th-salah" style={{ filter: 'brightness(1.2)' }}>ظهر</th>
              <th className="th-salah" style={{ filter: 'brightness(1.2)' }}>عصر</th>
              <th className="th-salah" style={{ filter: 'brightness(1.2)' }}>مغرب</th>
              <th className="th-salah" style={{ filter: 'brightness(1.2)' }}>عشاء</th>
              <th className="th-salah" style={{ filter: 'brightness(1.3)' }}>الرواتب</th>
              <th className="th-salah" style={{ filter: 'brightness(1.3)' }}>الضحى</th>
              <th className="th-salah" style={{ filter: 'brightness(1.3)' }}>قيام</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((dayData, index) => (
              <tr key={dayData.day} style={{ backgroundColor: index % 2 === 0 ? 'var(--card-bg)' : 'var(--table-stripe)' }}>
                <td style={{ fontWeight: 'bold' }}>{dayData.day} رمضان</td>

                {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map(p => (
                  <td key={p}>
                    <input
                      type="checkbox"
                      checked={dayData?.salah?.[p] || false}
                      onChange={(e) => handleCheck(dayData.day, 'salah', p, e.target.checked)}
                    />
                  </td>
                ))}

                {['rawatib', 'duha', 'qiyam'].map(p => (
                  <td key={p}>
                    <input
                      type="checkbox"
                      checked={dayData?.salah?.[p] || false}
                      onChange={(e) => handleCheck(dayData.day, 'salah', p, e.target.checked)}
                    />
                  </td>
                ))}

                {['morning', 'evening', 'general'].map(a => (
                  <td key={a}>
                    <input
                      type="checkbox"
                      checked={dayData?.azkar?.[a] || false}
                      onChange={(e) => handleCheck(dayData.day, 'azkar', a, e.target.checked)}
                    />
                  </td>
                ))}

                {['recitation', 'reflection', 'listening'].map(q => (
                  <td key={q}>
                    <input
                      type="checkbox"
                      checked={dayData?.quran?.[q] || false}
                      onChange={(e) => handleCheck(dayData.day, 'quran', q, e.target.checked)}
                    />
                  </td>
                ))}

                {['charity', 'kinship', 'makeHappy', 'iftar'].map(g => (
                  <td key={g}>
                    <input
                      type="checkbox"
                      checked={dayData?.goodDeeds?.[g] || false}
                      onChange={(e) => handleCheck(dayData.day, 'goodDeeds', g, e.target.checked)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
