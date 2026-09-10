import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { Activity, Wind, TrendingUp, TrendingDown, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { getAqiInfo } from '../../utils/aqi';
import { translations } from '../../utils/i18n';

export function AqiChart({ hourlyData }) {
  const [metric, setMetric] = useState('aqi'); // 'aqi' | 'pm25'
  const t = translations;

  if (!hourlyData || !hourlyData.time || !hourlyData.us_aqi) {
    return (
      <div className="flat-card" style={{ padding: '1.5rem', minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600' }}>Data riwayat tren kualitas udara belum tersedia.</p>
      </div>
    );
  }

  // Format 24-hour data
  const chartData = hourlyData.time.slice(0, 24).map((timeStr, index) => {
    const d = new Date(timeStr);
    const hour = d.getHours().toString().padStart(2, '0') + ':00';
    const aqiVal = Math.round(hourlyData.us_aqi ? hourlyData.us_aqi[index] : 0);
    const pm25Val = Math.round((hourlyData.pm2_5 ? hourlyData.pm2_5[index] : 0) * 10) / 10;
    const aqiMeta = getAqiInfo(aqiVal);

    return {
      time: hour,
      fullTime: `${hour} WIB`,
      aqi: aqiVal,
      pm25: pm25Val,
      label: aqiMeta.label,
      color: aqiMeta.color,
      advice: aqiMeta.advice
    };
  });

  // Calculate 24-Hour Highlights
  const aqiValues = chartData.map((d) => d.aqi);
  const avgAqi = Math.round(aqiValues.reduce((a, b) => a + b, 0) / (aqiValues.length || 1));
  const avgInfo = getAqiInfo(avgAqi);

  let maxItem = chartData[0];
  let minItem = chartData[0];

  chartData.forEach((item) => {
    if (item.aqi > maxItem.aqi) maxItem = item;
    if (item.aqi < minItem.aqi) minItem = item;
  });

  // Active Metric Colors
  const isAqi = metric === 'aqi';
  const strokeColor = isAqi ? avgInfo.color : '#0284c7';
  const gradientId = isAqi ? 'dynamicAqiGradient' : 'dynamicPm25Gradient';

  // Custom Rich Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: 'var(--border-thick)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 0.95rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            minWidth: '190px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem', borderBottom: '1px solid var(--border-flat)', paddingBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} /> {data.fullTime}
            </span>
            <span
              style={{
                fontSize: '0.675rem',
                fontWeight: '800',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: `${data.color}22`,
                color: data.color
              }}
            >
              {data.label}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', margin: '0.35rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Indeks AQI:</span>
              <strong style={{ fontSize: '0.95rem', color: data.color, fontWeight: '900' }}>{data.aqi}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>PM2.5:</span>
              <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '800' }}>{data.pm25} µg/m³</strong>
            </div>
          </div>

          <div style={{ marginTop: '0.35rem', paddingTop: '0.3rem', borderTop: '1px dashed var(--border-flat)', fontSize: '0.675rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
            {data.advice}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flat-card" style={{ padding: '1.5rem' }}>
      
      {/* Header with Title & Metric Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(59, 130, 246, 0.12)',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Activity size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
              {t.aqiTrend || 'Tren Kualitas Udara'} (24 Jam)
            </h3>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              Riwayat Polutan & Indeks Standar Kualitas Udara (US-EPA & ISPU)
            </span>
          </div>
        </div>

        {/* Metric Selector Buttons */}
        <div style={{ display: 'flex', gap: '0.3rem', backgroundColor: 'var(--bg-muted)', padding: '3px', borderRadius: 'var(--radius-sm)' }}>
          <button
            onClick={() => setMetric('aqi')}
            style={{
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: '800',
              borderRadius: 'var(--radius-sm)',
              border: metric === 'aqi' ? '1px solid var(--color-primary)' : 'none',
              backgroundColor: metric === 'aqi' ? 'var(--bg-card)' : 'transparent',
              color: metric === 'aqi' ? 'var(--color-primary)' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            {t.metricAqi || 'Indeks AQI'}
          </button>
          <button
            onClick={() => setMetric('pm25')}
            style={{
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: '800',
              borderRadius: 'var(--radius-sm)',
              border: metric === 'pm25' ? '1px solid #0284c7' : 'none',
              backgroundColor: metric === 'pm25' ? 'var(--bg-card)' : 'transparent',
              color: metric === 'pm25' ? '#0284c7' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            PM2.5 (µg/m³)
          </button>
        </div>
      </div>

      {/* 24-Hour Highlights Metric Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '0.5rem',
        marginBottom: '1rem'
      }}>
        {/* Average AQI */}
        <div style={{ padding: '0.55rem 0.75rem', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)', border: 'var(--border-thick)' }}>
          <span style={{ fontSize: '0.675rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block' }}>{t.avg24h || 'Rata-rata 24 Jam'}</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
            <strong style={{ fontSize: '1rem', fontWeight: '900', color: avgInfo.color }}>
              {isAqi ? avgAqi : `${(chartData.reduce((a,b)=>a+b.pm25,0)/chartData.length).toFixed(1)}`}
            </strong>
            <span style={{ fontSize: '0.7rem', fontWeight: '700', color: avgInfo.color }}>
              {isAqi ? `(${avgInfo.label})` : 'µg/m³'}
            </span>
          </div>
        </div>

        {/* Peak Pollution (Highest) */}
        <div style={{ padding: '0.55rem 0.75rem', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)', border: 'var(--border-thick)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <TrendingUp size={12} color="#ef4444" />
            <span style={{ fontSize: '0.675rem', fontWeight: '700', color: 'var(--text-muted)' }}>{t.peak24h || 'Puncak Tertinggi'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
            <strong style={{ fontSize: '1rem', fontWeight: '900', color: maxItem.color }}>
              {isAqi ? maxItem.aqi : `${maxItem.pm25}`}
            </strong>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              pukul {maxItem.time}
            </span>
          </div>
        </div>

        {/* Cleanest Air (Lowest) */}
        <div style={{ padding: '0.55rem 0.75rem', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)', border: 'var(--border-thick)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <TrendingDown size={12} color="#10b981" />
            <span style={{ fontSize: '0.675rem', fontWeight: '700', color: 'var(--text-muted)' }}>{t.clean24h || 'Terendah / Terbersih'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
            <strong style={{ fontSize: '1rem', fontWeight: '900', color: minItem.color }}>
              {isAqi ? minItem.aqi : `${minItem.pm25}`}
            </strong>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              pukul {minItem.time}
            </span>
          </div>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div style={{ width: '100%', height: 195 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="dynamicAqiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.45} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="dynamicPm25Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-flat)" vertical={false} />
            
            <XAxis
              dataKey="time"
              stroke="var(--text-muted)"
              fontSize={11}
              fontWeight={600}
              tickLine={false}
              interval="preserveStartEnd"
            />
            
            <YAxis
              stroke="var(--text-muted)"
              fontSize={11}
              fontWeight={600}
              tickLine={false}
              domain={[0, 'auto']}
            />
            
            {/* Standard Threshold Reference Line for Moderate AQI (50) and Unhealthy (150) */}
            {isAqi && <ReferenceLine y={50} stroke="#10b981" strokeDasharray="2 2" opacity={0.6} />}
            {isAqi && <ReferenceLine y={100} stroke="#eab308" strokeDasharray="2 2" opacity={0.6} />}
            {isAqi && <ReferenceLine y={150} stroke="#ef4444" strokeDasharray="2 2" opacity={0.6} />}

            <Tooltip content={<CustomTooltip />} />
            
            <Area
              type="monotone"
              dataKey={metric}
              stroke={strokeColor}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              name={isAqi ? 'Indeks AQI' : 'PM2.5 (µg/m³)'}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AQI Reference Scale Strip */}
      <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: 'var(--border-thick)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
        <span style={{ fontWeight: '700' }}>Skala Indeks:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span>0-50 Baik</span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#eab308' }} />
            <span>51-100 Sedang</span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f97316' }} />
            <span>101-150 Sensitif</span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <span>151-200 Tdk Sehat</span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8b5cf6' }} />
            <span>200+ Berbahaya</span>
          </span>
        </div>
      </div>

    </div>
  );
}
