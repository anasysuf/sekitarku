import React from 'react';
import { Calendar } from 'lucide-react';
import { getWeatherVisual } from '../../utils/weatherIcons';
import { formatShortDate } from '../../utils/format';
import { translations } from '../../utils/i18n';

export function WeatherForecastChart({ dailyData, lang = 'id' }) {
  const t = translations[lang] || translations.id;
  if (!dailyData || !dailyData.time) return null;

  const daysId = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = lang === 'en' ? daysEn : daysId;

  return (
    <div className="flat-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={18} color="var(--color-primary)" strokeWidth={2.5} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
            {t.forecast7Title}
          </h3>
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>
          Prakiraan 7 Hari Kedepan • Open-Meteo
        </span>
      </div>

      <div className="forecast-scroll-container">
        {dailyData.time.slice(0, 7).map((dateStr, idx) => {
          const d = new Date(dateStr);
          const dayName = idx === 0 ? t.today : days[d.getDay()];
          const formattedDate = formatShortDate(dateStr, lang);
          const maxTemp = Math.round(dailyData.temperature_2m_max?.[idx] ?? 0);
          const minTemp = Math.round(dailyData.temperature_2m_min?.[idx] ?? 0);
          const code = dailyData.weather_code?.[idx] ?? 0;
          const visual = getWeatherVisual(code, lang);
          const IconComp = visual.icon;

          return (
            <div
              key={dateStr}
              className="forecast-item"
              style={{
                backgroundColor: idx === 0 ? 'var(--color-primary-bg)' : 'var(--bg-muted)',
                borderColor: idx === 0 ? 'var(--color-primary)' : 'var(--border-flat)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                minHeight: '185px',
                padding: '0.85rem 0.5rem'
              }}
            >
              {/* Day & Date Header */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '0.825rem',
                  fontWeight: '800',
                  color: idx === 0 ? 'var(--color-primary)' : 'var(--text-main)',
                  letterSpacing: '-0.01em'
                }}>
                  {dayName}
                </div>
                <div style={{
                  fontSize: '0.725rem',
                  fontWeight: '700',
                  color: idx === 0 ? 'var(--color-primary)' : 'var(--text-muted)',
                  marginTop: '1px'
                }}>
                  {formattedDate}
                </div>
              </div>

              {/* Weather Icon Badge */}
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: visual.bg,
                  border: `1px solid ${visual.color}35`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0.4rem 0'
                }}
              >
                <IconComp size={24} color={visual.color} strokeWidth={2.5} />
              </div>

              {/* Weather Condition Label */}
              <div style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: 'var(--text-main)',
                textAlign: 'center',
                lineHeight: 1.2,
                minHeight: '26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {visual.label}
              </div>

              {/* Temperature Range */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1 }}>
                  {maxTemp}°
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  {minTemp}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
