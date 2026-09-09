import React from 'react';
import { formatWeatherCode } from '../../utils/format';
import { translations } from '../../utils/i18n';

export function WeatherForecastChart({ dailyData, lang = 'id' }) {
  const t = translations[lang] || translations.id;
  if (!dailyData || !dailyData.time) return null;

  const daysId = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = lang === 'en' ? daysEn : daysId;

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '1.5rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>{t.forecast7Title}</h3>
      </div>

      <div className="forecast-scroll-container">
        {dailyData.time.slice(0, 7).map((dateStr, idx) => {
          const d = new Date(dateStr);
          const dayName = idx === 0 ? t.today : days[d.getDay()];
          const maxTemp = Math.round(dailyData.temperature_2m_max[idx]);
          const minTemp = Math.round(dailyData.temperature_2m_min[idx]);
          const code = dailyData.weather_code[idx];
          const weather = formatWeatherCode(code);

          return (
            <div
              key={dateStr}
              className="forecast-item"
              style={{
                backgroundColor: idx === 0 ? 'var(--accent-brand-bg)' : 'var(--bg-primary)',
                borderColor: idx === 0 ? 'var(--accent-brand)' : 'var(--border-color)'
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: idx === 0 ? '700' : '600', color: idx === 0 ? 'var(--accent-brand)' : 'var(--text-secondary)' }}>
                {dayName}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-primary)', margin: '0.5rem 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {weather.label}
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                {maxTemp}°
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {minTemp}°
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
