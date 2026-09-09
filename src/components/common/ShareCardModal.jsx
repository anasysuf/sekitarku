import React, { useState, useRef } from 'react';
import { Share2, Download, MessageCircle, Copy, Check, X, Sparkles, MapPin, Calendar, Wind, Sun, HeartPulse, Activity } from 'lucide-react';
import { getAqiInfo } from '../../utils/aqi';
import { calculateEcoHealthScore } from '../../utils/healthIndex';
import { getWeatherVisual } from '../../utils/weatherIcons';
import { formatFullCurrentDate } from '../../utils/format';

export function ShareCardModal({
  isOpen,
  onClose,
  location,
  airQualityData,
  weatherData,
  latestEarthquake,
  lang = 'id'
}) {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef(null);

  if (!isOpen) return null;

  const aqi = airQualityData?.current?.aqi || 0;
  const pm25 = airQualityData?.current?.pm25 || 0;
  const temp = weatherData?.current?.temp || 28;
  const humidity = weatherData?.current?.humidity || 70;
  const uvIndex = weatherData?.current?.uvIndex || 0;
  const weatherCode = weatherData?.current?.weatherCode || 0;

  const aqiInfo = getAqiInfo(aqi, lang);
  const health = calculateEcoHealthScore(aqi, temp, humidity, uvIndex, pm25);
  const weatherVisual = getWeatherVisual(weatherCode, lang);
  const dateFormatted = formatFullCurrentDate(new Date(), lang);

  const shareText = `🌿 Pantauan Lingkungan ${location.name} hari ini (${dateFormatted}):\n- Kualitas Udara (AQI): ${aqi} (${aqiInfo.label})\n- Cuaca: ${temp}°C, ${weatherVisual.label}\n- Skor Kelayakan Lingkungan: ${health.score}/100 (${health.category})\n- Paparan Polusi: ${health.cigs > 0 ? health.cigs + ' rokok/hari' : 'Udara Bersih'}\n\nPantau data resmi BMKG & Open-Meteo secara real-time di Sekitarku: ${window.location.origin}`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleDownloadImage = () => {
    setIsGenerating(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350; // Instagram/Story portrait aspect ratio 4:5
      const ctx = canvas.getContext('2d');

      // 1. Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 1080, 1350);

      // 2. Top Header Brand Pill
      ctx.fillStyle = '#1e293b';
      ctx.roundRect(60, 60, 960, 120, 20);
      ctx.fill();

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(120, 120, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 42px "Outfit", sans-serif';
      ctx.fillText('SEKITARKU', 180, 125);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 24px "Outfit", sans-serif';
      ctx.fillText('Pantauan Lingkungan & Kualitas Hidup', 180, 155);

      // 3. City & Date Block
      ctx.fillStyle = '#1e293b';
      ctx.roundRect(60, 210, 960, 150, 20);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 46px "Outfit", sans-serif';
      ctx.fillText(location.name, 100, 280);

      ctx.fillStyle = '#10b981';
      ctx.font = '700 26px "Outfit", sans-serif';
      ctx.fillText(`${location.province} • ${dateFormatted}`, 100, 325);

      // 4. Main Metric Blocks Grid
      // Left Card: AQI
      ctx.fillStyle = '#1e293b';
      ctx.roundRect(60, 390, 465, 340, 20);
      ctx.fill();

      ctx.fillStyle = aqiInfo.color;
      ctx.font = '800 26px "Outfit", sans-serif';
      ctx.fillText('KUALITAS UDARA (AQI)', 100, 445);

      ctx.font = '800 96px "Outfit", sans-serif';
      ctx.fillText(String(aqi), 100, 560);

      ctx.fillStyle = aqiInfo.color;
      ctx.roundRect(100, 595, 385, 55, 12);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 26px "Outfit", sans-serif';
      ctx.fillText(aqiInfo.label.toUpperCase(), 125, 634);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 22px "Outfit", sans-serif';
      ctx.fillText(`PM2.5: ${pm25} µg/m³`, 100, 695);

      // Right Card: Cuaca & Suhu
      ctx.fillStyle = '#1e293b';
      ctx.roundRect(555, 390, 465, 340, 20);
      ctx.fill();

      ctx.fillStyle = '#3b82f6';
      ctx.font = '800 26px "Outfit", sans-serif';
      ctx.fillText('CUACA & SUHU', 595, 445);

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 96px "Outfit", sans-serif';
      ctx.fillText(`${temp}°C`, 595, 560);

      ctx.fillStyle = '#3b82f6';
      ctx.roundRect(595, 595, 385, 55, 12);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 26px "Outfit", sans-serif';
      ctx.fillText(weatherVisual.label.toUpperCase(), 620, 634);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 22px "Outfit", sans-serif';
      ctx.fillText(`Kelembapan: ${humidity}% • UV: ${uvIndex}`, 595, 695);

      // 5. Eco-Health Score Banner
      ctx.fillStyle = '#1e293b';
      ctx.roundRect(60, 760, 960, 240, 20);
      ctx.fill();

      ctx.fillStyle = health.color;
      ctx.roundRect(100, 800, 110, 110, 16);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 58px "Outfit", sans-serif';
      ctx.fillText(String(health.score), 125, 875);

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 36px "Outfit", sans-serif';
      ctx.fillText(health.category, 240, 845);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 24px "Outfit", sans-serif';
      ctx.fillText('Skor Kelayakan Lingkungan Terpadu (0-100)', 240, 885);

      ctx.fillStyle = health.cigs > 1.5 ? '#ef4444' : '#10b981';
      ctx.font = '700 24px "Outfit", sans-serif';
      ctx.fillText(`Paparan Polusi: ${health.cigs > 0 ? health.cigs + ' rokok/hari' : 'Udara Bersih'}`, 240, 925);

      // 6. Seismic / BMKG Info (if any)
      if (latestEarthquake) {
        ctx.fillStyle = '#1e293b';
        ctx.roundRect(60, 1030, 960, 130, 20);
        ctx.fill();

        ctx.fillStyle = '#f59e0b';
        ctx.font = '800 24px "Outfit", sans-serif';
        ctx.fillText(`GEMPA TERKINI BMKG: M ${latestEarthquake.magnitude} SR (Kedalaman ${latestEarthquake.depth})`, 100, 1075);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 20px "Outfit", sans-serif';
        ctx.fillText(`${latestEarthquake.wilayah} • ${latestEarthquake.date} ${latestEarthquake.time}`, 100, 1115);
      }

      // 7. Footer Official Watermark
      ctx.fillStyle = '#64748b';
      ctx.font = '700 22px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Data Resmi: BMKG & Open-Meteo • sekitarku.vercel.app', 540, 1290);
      ctx.textAlign = 'left';

      // Convert to downloadable image
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Sekitarku-${location.name.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0,10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        className="flat-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '540px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-canvas)',
          border: 'var(--border-thick)',
          overflow: 'hidden',
          padding: 0
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ padding: '1.25rem', borderBottom: 'var(--border-thick)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Share2 size={20} color="var(--color-primary)" strokeWidth={2.5} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
              Bagikan Laporan Lingkungan
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="flat-btn-secondary"
            style={{ minHeight: '32px', padding: '4px 8px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Story Card Visual Preview */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
          
          <div
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-muted)',
              border: 'var(--border-thick)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Kondisi Terkini
                </span>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0.1rem 0', color: 'var(--text-main)' }}>
                  {location.name}
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  {dateFormatted}
                </span>
              </div>
              <div style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: health.color,
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: '800'
              }}>
                Skor {health.score}/100
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-canvas)', border: 'var(--border-thick)' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '700', color: aqiInfo.color, display: 'block' }}>KUALITAS UDARA</span>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: aqiInfo.color, lineHeight: 1.1, margin: '0.2rem 0' }}>
                  AQI {aqi}
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)' }}>{aqiInfo.label}</span>
              </div>

              <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-canvas)', border: 'var(--border-thick)' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--color-primary)', display: 'block' }}>CUACA & SUHU</span>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.1, margin: '0.2rem 0' }}>
                  {temp}°C
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)' }}>{weatherVisual.label}</span>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', fontWeight: '600' }}>
              Data Resmi BMKG & Open-Meteo • sekitarku.vercel.app
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1.25rem' }}>
            
            <button
              onClick={handleDownloadImage}
              disabled={isGenerating}
              className="flat-btn-primary"
              style={{ width: '100%', gap: '0.5rem' }}
            >
              <Download size={18} />
              <span>{isGenerating ? 'Membuat Gambar...' : 'Unduh Kartu Gambar (Story PNG)'}</span>
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <button
                onClick={handleShareWhatsApp}
                className="flat-btn-secondary"
                style={{
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  borderColor: '#25D366',
                  gap: '0.45rem'
                }}
              >
                <MessageCircle size={18} />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleCopyText}
                className="flat-btn-secondary"
                style={{ gap: '0.45rem' }}
              >
                {copied ? <Check size={18} color="var(--color-secondary)" /> : <Copy size={18} />}
                <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
              </button>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: '0.75rem 1.25rem', borderTop: 'var(--border-thick)', backgroundColor: 'var(--bg-muted)', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          Format gambar dioptimalkan untuk Instagram Stories & WhatsApp Status
        </div>
      </div>
    </div>
  );
}
