import React from 'react';
import { Calendar, Droplets, Sun, ArrowUp, ArrowDown } from 'lucide-react';
import { getWeatherVisual } from '../../utils/weatherIcons';
import { formatShortDate } from '../../utils/format';
import { translations } from '../../utils/i18n';

export function WeatherForecastChart({ dailyData, lang = 'id' }) {
  const t = translations[lang] || translations.id;
  if (!dailyData || !dailyData.time) return null;

  const daysId = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = lang === 'en' ? daysEn : daysId;

  // Calculate weekly extremes
  const maxTemps = dailyData.temperature_2m_max?.slice(0, 7) || [];
  const minTemps = dailyData.temperature_2m_min?.slice(0, 7) || [];
  const highestTemp = maxTemps.length ? Math.round(Math.max(...maxTemps)) : 33;
  const lowestTemp = minTemps.length ? Math.round(Math.min(...minTemps)) : 23;

  return (
    <div className="flat-card" style={{ padding: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-primary-bg)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calendar size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
              {t.forecast7Title || 'Prakiraan Cuaca 7 Hari Kedepan'}
            </h3>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              Suhu Siang/Malam · Probabilitas Hujan · Indeks UV Harian
            </span>
          </div>
        </div>

        {/* Weekly Summary Pill */}
        <span style={{
          fontSize: '0.725rem',
          fontWeight: '700',
          padding: '4px 10px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--bg-muted)',
          color: 'var(--text-muted)',
          border: 'var(--border-thick)'
        }}>
          Rentang: <strong style={{ color: 'var(--text-main)' }}>{lowestTemp}°C - {highestTemp}°C</strong>
        </span>
      </div>

      {/* 7-Day Grid Cards */}
      <div className="forecast-scroll-container" style={{ gap: '0.65rem' }}>
        {dailyData.time.slice(0, 7).map((dateStr, idx) => {
          const d = new Date(dateStr);
          const dayName = idx === 0 ? (lang === 'en' ? 'Today' : 'Hari Ini') : days[d.getDay()];
          const formattedDate = formatShortDate(dateStr, lang);
          const maxTemp = Math.round(dailyData.temperature_2m_max?.[idx] ?? 0);
          const minTemp = Math.round(dailyData.temperature_2m_min?.[idx] ?? 0);
          const rainProb = Math.round(dailyData.precipitation_probability_max?.[idx] ?? (dailyData.precipitation_sum?.[idx] > 0 ? 60 : 15));
          const rainSum = (dailyData.precipitation_sum?.[idx] ?? 0).toFixed(1);
          const uvMax = Math.round(dailyData.uv_index_max?.[idx] ?? 6);
          const code = dailyData.weather_code?.[idx] ?? 0;
          const visual = getWeatherVisual(code, lang);
          const IconComp = visual.icon;

          return (
            <div
              key={dateStr}
              className="forecast-item"
              style={{
                backgroundColor: idx === 0 ? 'var(--color-primary-bg)' : 'var(--bg-muted)',
                borderColor: idx === 0 ? 'var(--color-primary)' : 'var(--border-thick)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                minWidth: '125px',
                minHeight: '235px',
                padding: '0.95rem 0.65rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: idx === 0 ? '0 4px 12px rgba(16, 185, 129, 0.12)' : 'none',
                position: 'relative'
              }}
            >
              {/* Day & Date Header */}
              <div style={{ textAlign: 'center', width: '100%' }}>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '800',
                  color: idx === 0 ? 'var(--color-primary)' : 'var(--text-main)',
                  letterSpacing: '-0.01em'
                }}>
                  {dayName}
                </div>
                <div style={{
                  fontSize: '0.725rem',
                  fontWeight: '600',
                  color: idx === 0 ? 'var(--color-primary)' : 'var(--text-muted)',
                  marginTop: '1px'
                }}>
                  {formattedDate}
                </div>
              </div>

              {/* Weather Icon Badge */}
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: visual.bg,
                  border: `1px solid ${visual.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0.35rem 0'
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
                lineHeight: 1.25,
                minHeight: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 2px'
              }}>
                {visual.label}
              </div>

              {/* Temperature High / Low with clear labels */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                backgroundColor: 'var(--bg-card)',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-flat)',
                width: '90%',
                marginTop: '0.2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1px', color: '#ef4444' }} title="Suhu Maksimum (Siang)">
                  <ArrowUp size={11} strokeWidth={3} />
                  <strong style={{ fontSize: '0.85rem', fontWeight: '800' }}>{maxTemp}°</strong>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>/</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1px', color: '#0284c7' }} title="Suhu Minimum (Malam)">
                  <ArrowDown size={11} strokeWidth={3} />
                  <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{minTemp}°</span>
                </div>
              </div>

              {/* Secondary Details: Rain Probability & UV Max */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                marginTop: '0.45rem',
                paddingTop: '0.4rem',
                borderTop: '1px dashed var(--border-flat)',
                fontSize: '0.675rem',
                fontWeight: '700',
                color: 'var(--text-muted)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: rainProb >= 40 ? '#0284c7' : 'var(--text-muted)' }} title={`Peluang Hujan: ${rainProb}% (${rainSum} mm)`}>
                  <Droplets size={11} strokeWidth={2.5} />
                  <span>{rainProb}%</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: uvMax >= 8 ? '#ea580c' : 'var(--text-muted)' }} title={`Indeks UV Maksimum: ${uvMax}`}>
                  <Sun size={11} strokeWidth={2.5} />
                  <span>UV {uvMax}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
