import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ token, logout }) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSchedule();
  }, [token]);

  const fetchSchedule = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/schedule', {
        headers: { 'x-auth-token': token }
      });
      // Ensure schedule is sorted by day
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
    // 1. Optimistic Update
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

    // 2. API Call
    try {
      setSaving(true);
      await axios.post('http://localhost:5000/api/schedule/update',
        { day, category, item, value },
        { headers: { 'x-auth-token': token } }
      );
    } catch (err) {
      console.error("Failed to save", err);
      // Revert if needed? For simplicity, we just log error.
    } finally {
      setSaving(false);
    }
  };

  const calculateProgress = () => {
    // Optional: Calculate overall progress
    return 0;
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>جاري التحميل...</div>;

  return (
    <div className="container" style={{ direction: 'rtl' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>جدول أعمال رمضان</h2>
        <button onClick={logout} style={{ backgroundColor: '#dc2626' }}>تسجيل الخروج</button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="schedule-table">
          <thead>
            {/* Top Header Row */}
            <tr className="header-row-1">
              <th rowSpan="3" style={{ minWidth: '80px', backgroundColor: '#1e3a8a', color: 'white' }}>اليوم</th>
              <th colSpan="8" style={{ backgroundColor: '#1e40af', color: 'white' }}>الصلاة</th>
              <th colSpan="3" style={{ backgroundColor: '#15803d', color: 'white' }}>أذكار</th>
              <th colSpan="3" style={{ backgroundColor: '#b45309', color: 'white' }}>قرآن</th>
              <th colSpan="4" style={{ backgroundColor: '#7e22ce', color: 'white' }}>أعمال صالحة</th>
            </tr>

            {/* Middle Header Row */}
            <tr className="header-row-2">
              <th colSpan="5" style={{ backgroundColor: '#2563eb' }}>الفروض (على وقتها)</th>
              <th colSpan="3" style={{ backgroundColor: '#3b82f6' }}>النوافل</th>
              <th rowSpan="2">الصباح</th>
              <th rowSpan="2">المساء</th>
              <th rowSpan="2">أذكار ودعاء</th>
              <th rowSpan="2">ورد تلاوة</th>
              <th rowSpan="2">ورد تدبر</th>
              <th rowSpan="2">ورد سماع</th>
              <th rowSpan="2">صدقة</th>
              <th rowSpan="2">صلة الرحم</th>
              <th rowSpan="2">إدخال سرور</th>
              <th rowSpan="2">إفطار صائم</th>
            </tr>

            {/* Bottom Header Row */}
            <tr className="header-row-3">
              <th>فجر</th>
              <th>ظهر</th>
              <th>عصر</th>
              <th>مغرب</th>
              <th>عشاء</th>
              <th>الرواتب</th>
              <th>الضحى</th>
              <th>قيام</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((dayData) => (
              <tr key={dayData.day}>
                <td className="day-cell">{dayData.day} رمضان</td>

                {/* Salah Fard */}
                {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map(p => (
                  <td key={p}>
                    <input
                      type="checkbox"
                      checked={dayData?.salah?.[p] || false}
                      onChange={(e) => handleCheck(dayData.day, 'salah', p, e.target.checked)}
                    />
                  </td>
                ))}

                {/* Salah Sunan */}
                {['rawatib', 'duha', 'qiyam'].map(p => (
                  <td key={p}>
                    <input
                      type="checkbox"
                      checked={dayData?.salah?.[p] || false}
                      onChange={(e) => handleCheck(dayData.day, 'salah', p, e.target.checked)}
                    />
                  </td>
                ))}

                {/* Azkar */}
                {['morning', 'evening', 'general'].map(a => (
                  <td key={a}>
                    <input
                      type="checkbox"
                      checked={dayData?.azkar?.[a] || false}
                      onChange={(e) => handleCheck(dayData.day, 'azkar', a, e.target.checked)}
                    />
                  </td>
                ))}

                {/* Quran */}
                {['recitation', 'reflection', 'listening'].map(q => (
                  <td key={q}>
                    <input
                      type="checkbox"
                      checked={dayData?.quran?.[q] || false}
                      onChange={(e) => handleCheck(dayData.day, 'quran', q, e.target.checked)}
                    />
                  </td>
                ))}

                {/* Good Deeds */}
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
