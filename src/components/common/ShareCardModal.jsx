import React, { useState } from 'react';
import { Share2, Download, Copy, Check, X } from 'lucide-react';
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

  const shareText = `🌿 Pantauan Lingkungan ${location.name} (${dateFormatted}):\n• Kualitas Udara (AQI): ${aqi} (${aqiInfo.label})\n• Cuaca: ${temp}°C, ${weatherVisual.label}\n• Skor Kesehatan Lingkungan: ${health.score}/100 (${health.category})\n${latestEarthquake ? `• Gempa Terkini: M ${latestEarthquake.magnitude} (${latestEarthquake.wilayah})\n` : ''}🌐 Cek real-time di https://sekitarku.vercel.app`;

  // Draw 9:16 high quality story infographic on HTML5 canvas
  const generateCanvasImage = () => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');

      // 1. Clean Slate Background
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, 1080, 1920);

      // Top Decorative Banner
      ctx.fillStyle = '#10B981';
      ctx.fillRect(0, 0, 1080, 24);

      // Helper for clean rounded cards
      const drawCard = (x, y, w, h, fill, border) => {
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, w, h, 28);
        } else {
          ctx.rect(x, y, w, h);
        }
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = border;
        ctx.lineWidth = 4;
        ctx.stroke();
      };

      // 2. Header
      ctx.fillStyle = '#0F172A';
      ctx.font = '800 68px "Outfit", sans-serif';
      ctx.fillText('Sekitarku', 80, 140);

      ctx.fillStyle = '#64748B';
      ctx.font = '700 32px "Outfit", sans-serif';
      ctx.fillText('Laporan Lingkungan & Cuaca Real-Time', 80, 195);

      // 3. Location Hero Card
      drawCard(80, 250, 920, 260, '#FFFFFF', '#E2E8F0');

      ctx.fillStyle = '#0F172A';
      ctx.font = '800 58px "Outfit", sans-serif';
      ctx.fillText(location.name, 120, 340);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 32px "Outfit", sans-serif';
      ctx.fillText(location.province || 'Indonesia', 120, 395);

      ctx.fillStyle = '#059669';
      ctx.font = '700 28px "Outfit", sans-serif';
      ctx.fillText(`📅 ${dateFormatted}`, 120, 455);

      // 4. Eco-Health Composite Score Card
      drawCard(80, 550, 920, 340, '#FFFFFF', '#E2E8F0');

      ctx.fillStyle = '#64748B';
      ctx.font = '800 28px "Outfit", sans-serif';
      ctx.fillText('SKOR KUALITAS LINGKUNGAN', 120, 620);

      ctx.fillStyle = health.color || '#10B981';
      ctx.font = '800 100px "Outfit", sans-serif';
      ctx.fillText(`${health.score}`, 120, 740);

      ctx.fillStyle = '#64748B';
      ctx.font = '800 48px "Outfit", sans-serif';
      ctx.fillText('/100', 250, 740);

      // Score Badge
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(520, 660, 440, 90, 20);
      else ctx.rect(520, 660, 440, 90);
      ctx.fillStyle = health.color || '#10B981';
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 36px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(health.category || 'Baik', 740, 718);
      ctx.textAlign = 'left';

      ctx.fillStyle = '#334155';
      ctx.font = '600 28px "Outfit", sans-serif';
      ctx.fillText(`Perkiraan setara paparan ${health.cigs || '0'} batang rokok/hari.`, 120, 830);

      // 5. Grid: AQI & Weather Cards
      drawCard(80, 930, 440, 380, '#FFFFFF', '#E2E8F0');

      ctx.fillStyle = aqiInfo.color || '#10B981';
      ctx.font = '800 28px "Outfit", sans-serif';
      ctx.fillText('KUALITAS UDARA', 120, 990);

      ctx.fillStyle = aqiInfo.color || '#10B981';
      ctx.font = '800 88px "Outfit", sans-serif';
      ctx.fillText(`${aqi}`, 120, 1100);

      ctx.fillStyle = '#64748B';
      ctx.font = '700 32px "Outfit", sans-serif';
      ctx.fillText('AQI US', 280, 1100);

      ctx.fillStyle = '#0F172A';
      ctx.font = '800 36px "Outfit", sans-serif';
      ctx.fillText(aqiInfo.label, 120, 1180);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 28px "Outfit", sans-serif';
      ctx.fillText(`PM2.5: ${pm25} µg/m³`, 120, 1240);

      // Weather Card
      drawCard(560, 930, 440, 380, '#FFFFFF', '#E2E8F0');

      ctx.fillStyle = '#0284C7';
      ctx.font = '800 28px "Outfit", sans-serif';
      ctx.fillText('CUACA & SUHU', 600, 990);

      ctx.fillStyle = '#0F172A';
      ctx.font = '800 88px "Outfit", sans-serif';
      ctx.fillText(`${temp}°C`, 600, 1100);

      ctx.fillStyle = '#0F172A';
      ctx.font = '800 36px "Outfit", sans-serif';
      ctx.fillText(weatherVisual.label, 600, 1180);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 28px "Outfit", sans-serif';
      ctx.fillText(`Kelembapan: ${humidity}%`, 600, 1240);

      // 6. Seismic / Earthquake Card
      if (latestEarthquake) {
        drawCard(80, 1350, 920, 240, '#FFFFFF', '#E2E8F0');

        ctx.fillStyle = '#EF4444';
        ctx.font = '800 28px "Outfit", sans-serif';
        ctx.fillText('GEMPA TERKINI (BMKG)', 120, 1410);

        ctx.fillStyle = '#EF4444';
        ctx.font = '800 58px "Outfit", sans-serif';
        ctx.fillText(`M ${latestEarthquake.magnitude}`, 120, 1490);

        ctx.fillStyle = '#0F172A';
        ctx.font = '700 30px "Outfit", sans-serif';
        ctx.fillText(latestEarthquake.wilayah || 'Indonesia', 340, 1475);

        ctx.fillStyle = '#64748B';
        ctx.font = '600 26px "Outfit", sans-serif';
        ctx.fillText(`Kedalaman: ${latestEarthquake.depth} • ${latestEarthquake.potensi}`, 340, 1525);
      } else {
        drawCard(80, 1350, 920, 240, '#FFFFFF', '#E2E8F0');

        ctx.fillStyle = '#10B981';
        ctx.font = '800 28px "Outfit", sans-serif';
        ctx.fillText('INFORMASI KESELAMATAN', 120, 1410);

        ctx.fillStyle = '#0F172A';
        ctx.font = '700 32px "Outfit", sans-serif';
        ctx.fillText('Tidak ada peringatan bencana kritis saat ini.', 120, 1480);

        ctx.fillStyle = '#64748B';
        ctx.font = '600 26px "Outfit", sans-serif';
        ctx.fillText('Tetap pantau pembaruan berkala dari BMKG & Sekitarku.', 120, 1530);
      }

      // 7. Footer Branding
      ctx.fillStyle = '#0F172A';
      ctx.font = '800 34px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('sekitarku.vercel.app', 540, 1720);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 26px "Outfit", sans-serif';
      ctx.fillText('Data Resmi BMKG & Open-Meteo • Dipantau Secara Real-Time', 540, 1770);

      ctx.textAlign = 'left';

      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });
  };

  // Unified Share: Web Share API with image file -> triggers OS Share Sheet (WhatsApp Status, Instagram Story, X, etc.)
  const handleNativeShare = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateCanvasImage();
      if (!blob) throw new Error('Gagal membuat gambar');

      const fileName = `Sekitarku_${location.name.replace(/\s+/g, '_')}_${Date.now()}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // Check if navigator.canShare supports files
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Pantauan Lingkungan ${location.name}`,
          text: shareText,
          files: [file]
        });
      } else if (navigator.share) {
        // Fallback share text & auto-download image
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);

        await navigator.share({
          title: `Pantauan Lingkungan ${location.name}`,
          text: shareText,
          url: 'https://sekitarku.vercel.app'
        });
      } else {
        // Direct download + copy text
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        navigator.clipboard?.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share error:', err);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateCanvasImage();
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Sekitarku_${location.name.replace(/\s+/g, '_')}_${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '480px',
          width: '95%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: 'var(--border-thick)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-primary-bg)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Share2 size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                Bagikan Laporan
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, fontWeight: '600' }}>
                Kartu grafis HD untuk Story WhatsApp, Instagram & Medsos
              </p>
            </div>
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
              padding: '1.35rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-muted)',
              border: 'var(--border-thick)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Laporan Resmi
                </span>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0.1rem 0', color: 'var(--text-main)' }}>
                  {location.name}
                </h4>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: '600' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem', marginBottom: '0.85rem' }}>
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-card)', border: 'var(--border-thick)' }}>
                <span style={{ fontSize: '0.675rem', fontWeight: '800', color: aqiInfo.color, display: 'block' }}>KUALITAS UDARA</span>
                <div style={{ fontSize: '1.65rem', fontWeight: '800', color: aqiInfo.color, lineHeight: 1.1, margin: '0.15rem 0' }}>
                  AQI {aqi}
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)' }}>{aqiInfo.label}</span>
              </div>

              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-card)', border: 'var(--border-thick)' }}>
                <span style={{ fontSize: '0.675rem', fontWeight: '800', color: 'var(--color-primary)', display: 'block' }}>CUACA & SUHU</span>
                <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.1, margin: '0.15rem 0' }}>
                  {temp}°C
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)' }}>{weatherVisual.label}</span>
              </div>
            </div>

            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textAlign: 'center', fontWeight: '600' }}>
              Data Resmi BMKG & Open-Meteo • sekitarku.vercel.app
            </div>
          </div>

          {/* Action Sharing Buttons Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1.25rem' }}>
            
            {/* Unified Primary Action: Bagikan (Direct OS Sheet / Intent / File Share) */}
            <button
              onClick={handleNativeShare}
              disabled={isGenerating}
              className="flat-btn-primary"
              style={{
                width: '100%',
                backgroundColor: 'var(--color-primary)',
                gap: '0.5rem',
                minHeight: '46px',
                fontSize: '0.95rem',
                fontWeight: '800',
                justifyContent: 'center'
              }}
            >
              <Share2 size={18} strokeWidth={2.5} />
              <span>{isGenerating ? 'Menyiapkan Gambar...' : 'Bagikan'}</span>
            </button>

            {/* Secondary Actions: Simpan PNG & Salin Teks */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              
              {/* Download PNG */}
              <button
                onClick={handleDownloadImage}
                disabled={isGenerating}
                className="flat-btn-secondary"
                style={{
                  gap: '0.4rem',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  padding: '0.65rem 0.5rem',
                  justifyContent: 'center'
                }}
              >
                <Download size={16} strokeWidth={2.5} />
                <span>Simpan PNG</span>
              </button>

              {/* Copy Text Button */}
              <button
                onClick={handleCopyText}
                className="flat-btn-secondary"
                style={{
                  gap: '0.4rem',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  padding: '0.65rem 0.5rem',
                  justifyContent: 'center'
                }}
              >
                {copied ? <Check size={16} color="var(--color-secondary)" strokeWidth={2.5} /> : <Copy size={16} strokeWidth={2.2} />}
                <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
              </button>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: '0.75rem 1.5rem', borderTop: 'var(--border-thick)', backgroundColor: 'var(--bg-muted)', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'center' }}>
          Mendukung WhatsApp Status, Instagram Stories, Twitter/X, & aplikasi lainnya
        </div>
      </div>
    </div>
  );
}
