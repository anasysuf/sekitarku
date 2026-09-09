import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { translations } from '../../utils/i18n';

export function AqiChart({ hourlyData, lang = 'id' }) {
  const t = translations[lang] || translations.id;

  if (!hourlyData || !hourlyData.time) {
    return (
      <div className="flat-card" style={{ padding: '1.5rem', minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600' }}>Data riwayat AQI belum tersedia.</p>
      </div>
    );
  }

  const chartData = hourlyData.time.slice(0, 24).map((timeStr, index) => {
    const d = new Date(timeStr);
    const hour = d.getHours().toString().padStart(2, '0') + ':00';
    return {
      time: hour,
      aqi: hourlyData.us_aqi ? hourlyData.us_aqi[index] : 0,
      pm25: hourlyData.pm2_5 ? hourlyData.pm2_5[index] : 0
    };
  });

  return (
    <div className="flat-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
          {t.aqiTrend} (24 Jam)
        </h3>
        <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '3px 8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}>
          US-EPA Index
        </span>
      </div>

      <div style={{ width: '100%', height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="flatAqiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-flat)" vertical={false} />
            <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
            <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} domain={[0, 'auto']} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-card)',
                border: 'var(--border-thick)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-main)',
                fontSize: '0.8rem',
                fontWeight: '700'
              }}
            />
            <Area type="monotone" dataKey="aqi" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#flatAqiGradient)" name="AQI" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
