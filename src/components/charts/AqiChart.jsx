import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { translations } from '../../utils/i18n';

export function AqiChart({ hourlyData, lang = 'id' }) {
  const t = translations[lang] || translations.id;

  if (!hourlyData || !hourlyData.time || hourlyData.time.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '1.25rem', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Data riwayat AQI tidak tersedia.</p>
      </div>
    );
  }

  const chartData = hourlyData.time.slice(0, 24).map((timeStr, idx) => {
    const d = new Date(timeStr);
    const hour = `${d.getHours().toString().padStart(2, '0')}:00`;
    return {
      time: hour,
      aqi: hourlyData.us_aqi ? hourlyData.us_aqi[idx] : 0,
      pm25: hourlyData.pm2_5 ? hourlyData.pm2_5[idx] : 0
    };
  });

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>{t.aqiTrend}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{t.aqiHourlyForecast}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#2ea043' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '2px', backgroundColor: '#2ea043' }}></span> {lang === 'en' ? 'Good (0-50)' : 'Baik (0-50)'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#d29922' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '2px', backgroundColor: '#d29922' }}></span> {lang === 'en' ? 'Moderate (51-100)' : 'Sedang (51-100)'}
          </span>
        </div>
      </div>

      <div style={{ width: '100%', height: '180px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2ea043" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2ea043" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 2" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
            <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} domain={[0, 'auto']} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.75rem'
              }}
            />
            <Area type="monotone" dataKey="aqi" stroke="#2ea043" strokeWidth={2} fillOpacity={1} fill="url(#aqiGradient)" name="AQI" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
