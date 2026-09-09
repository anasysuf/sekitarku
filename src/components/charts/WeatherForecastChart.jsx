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
    <div className="flat-card" style={{ padding: '1.5rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>{t.forecast7Title}</h3>
      </div>

      <div className="forecast-scroll-container">
        {dailyData.time.slice(0, 7).map((dateStr, idx) => {
          const d = new Date(dateStr);
          const dayName = idx === 0 ? t.today : days[d.getDay()];
          const maxTemp = Math.round(dailyData.temperature_2m_max?.[idx] ?? 0);
          const minTemp = Math.round(dailyData.temperature_2m_min?.[idx] ?? 0);
          const code = dailyData.weather_code?.[idx] ?? 0;
          const weather = formatWeatherCode(code);

          return (
            <div
              key={dateStr}
              className="forecast-item"
              style={{
                backgroundColor: idx === 0 ? 'var(--color-primary-bg)' : 'var(--bg-muted)',
                borderColor: idx === 0 ? 'var(--color-primary)' : 'var(--border-flat)'
              }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: idx === 0 ? 'var(--color-primary)' : 'var(--text-muted)' }}>
                {dayName}
              </div>
              <div style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--text-main)', margin: '0.5rem 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {weather.label}
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>
                {maxTemp}°
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                {minTemp}°
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
