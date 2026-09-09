import React, { useState } from 'react';
import { Share2, Download, MessageCircle, Copy, Check, X } from 'lucide-react';
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
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');

      // Helper function for rounded rectangles with explicit beginPath
      function drawCard(x, y, w, h, radius, fill, stroke) {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, radius);
        if (fill) {
          ctx.fillStyle = fill;
          ctx.fill();
        }
        if (stroke) {
          ctx.lineWidth = 3;
          ctx.strokeStyle = stroke;
          ctx.stroke();
        }
      }

      // 1. Solid Canvas Background
      ctx.fillStyle = '#0b1120';
      ctx.fillRect(0, 0, 1080, 1350);

      // 2. Top Header Brand Block
      drawCard(60, 60, 960, 110, 20, '#1e293b', '#334155');

      ctx.beginPath();
      ctx.arc(115, 115, 26, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 38px sans-serif';
      ctx.fillText('SEKITARKU', 165, 122);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('Pantauan Lingkungan Hidup Real-Time', 165, 150);

      // 3. Location & Date Block
      drawCard(60, 195, 960, 150, 20, '#1e293b', '#334155');

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText(location.name || 'DKI Jakarta', 95, 260);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(`${location.province || 'Indonesia'} • ${dateFormatted}`, 95, 305);

      // 4. Middle Grid: AQI Block (Left)
      drawCard(60, 370, 465, 340, 20, '#1e293b', aqiInfo.color);

      ctx.fillStyle = aqiInfo.color;
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('KUALITAS UDARA (AQI)', 95, 420);

      ctx.font = 'bold 88px sans-serif';
      ctx.fillText(String(aqi), 95, 525);

      drawCard(95, 560, 395, 52, 10, aqiInfo.color, null);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(aqiInfo.label.toUpperCase(), 120, 595);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`PM2.5: ${pm25} µg/m³`, 95, 660);

      // Middle Grid: Weather Block (Right)
      drawCard(555, 370, 465, 340, 20, '#1e293b', '#3b82f6');

      ctx.fillStyle = '#3b82f6';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('CUACA & SUHU', 590, 420);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 88px sans-serif';
      ctx.fillText(`${temp}°C`, 590, 525);

      drawCard(590, 560, 395, 52, 10, '#3b82f6', null);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(weatherVisual.label.toUpperCase(), 615, 595);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`Kelembapan: ${humidity}% • UV: ${uvIndex}`, 590, 660);

      // 5. Eco-Health Score Banner
      drawCard(60, 735, 960, 240, 20, '#1e293b', health.color);

      drawCard(95, 770, 110, 110, 16, health.color, null);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 54px sans-serif';
      ctx.fillText(String(health.score), 125, 845);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 34px sans-serif';
      ctx.fillText(health.category, 235, 815);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('Skor Kelayakan Lingkungan Terpadu (0 - 100)', 235, 855);

      ctx.fillStyle = health.cigs > 1.5 ? '#ef4444' : '#10b981';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(`Paparan Polusi: ${health.cigs > 0 ? health.cigs + ' rokok/hari' : 'Udara Bersih'}`, 235, 895);

      // 6. Seismic / BMKG Info
      if (latestEarthquake) {
        drawCard(60, 1000, 960, 140, 20, '#1e293b', '#f59e0b');

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText(`GEMPA TERKINI BMKG: M ${latestEarthquake.magnitude} SR (Kedalaman ${latestEarthquake.depth})`, 95, 1045);

        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`${latestEarthquake.wilayah}`, 95, 1080);

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(`Waktu: ${latestEarthquake.date} ${latestEarthquake.time} • ${latestEarthquake.potensi || 'Tidak berpotensi tsunami'}`, 95, 1110);
      }

      // 7. Footer Watermark
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Data Resmi: BMKG & Open-Meteo • sekitarku.vercel.app', 540, 1275);
      ctx.textAlign = 'left';

      // Download trigger
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
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
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
          backgroundColor: 'var(--bg-card)',
          border: 'var(--border-thick)',
          overflow: 'hidden',
          padding: 0
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: 'var(--border-thick)', backgroundColor: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Share2 size={20} color="var(--color-primary)" strokeWidth={2.5} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Bagikan Laporan Lingkungan
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="flat-btn-secondary"
            style={{ minHeight: '32px', padding: '4px 8px' }}
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Story Card Visual Preview */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', backgroundColor: 'var(--bg-card)' }}>
          
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
              <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-card)', border: 'var(--border-thick)' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '700', color: aqiInfo.color, display: 'block' }}>KUALITAS UDARA</span>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: aqiInfo.color, lineHeight: 1.1, margin: '0.2rem 0' }}>
                  AQI {aqi}
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)' }}>{aqiInfo.label}</span>
              </div>

              <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-card)', border: 'var(--border-thick)' }}>
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
              <Download size={18} strokeWidth={2.5} />
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
                <MessageCircle size={18} strokeWidth={2.5} />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleCopyText}
                className="flat-btn-secondary"
                style={{ gap: '0.45rem' }}
              >
                {copied ? <Check size={18} color="var(--color-secondary)" strokeWidth={2.5} /> : <Copy size={18} strokeWidth={2.5} />}
                <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
              </button>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: '0.85rem 1.5rem', borderTop: 'var(--border-thick)', backgroundColor: 'var(--bg-muted)', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'center' }}>
          Format gambar beresolusi tinggi untuk Instagram Story & WhatsApp Status
        </div>
      </div>
    </div>
  );
}
