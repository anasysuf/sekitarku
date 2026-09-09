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

  // Draw 9:16 high quality story infographic on HTML5 canvas with zero overflow
  const generateCanvasImage = () => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');

      // 1. Clean Canvas Background
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, 1080, 1920);

      // Top Decorative Brand Banner
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

      // Helper: Draw Wrapped and Truncated Text with Strict Bounds
      const drawWrappedText = (text, x, y, maxWidth, lineHeight, maxLines = 2) => {
        if (!text) return y;
        const words = String(text).split(' ');
        let line = '';
        let linesCount = 0;
        let currentY = y;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + (line ? ' ' : '') + words[n];
          const metrics = ctx.measureText(testLine);

          if (metrics.width > maxWidth && n > 0) {
            linesCount++;
            if (linesCount >= maxLines) {
              // Truncate current line with ellipsis
              let truncated = line;
              while (truncated.length > 0 && ctx.measureText(truncated + '...').width > maxWidth) {
                truncated = truncated.slice(0, -1);
              }
              ctx.fillText(truncated + '...', x, currentY);
              return currentY + lineHeight;
            }
            ctx.fillText(line, x, currentY);
            line = words[n];
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, x, currentY);
        return currentY + lineHeight;
      };

      // 2. Header
      ctx.fillStyle = '#0F172A';
      ctx.font = '800 68px "Outfit", sans-serif';
      ctx.fillText('Sekitarku', 80, 140);

      ctx.fillStyle = '#64748B';
      ctx.font = '700 32px "Outfit", sans-serif';
      ctx.fillText('Laporan Lingkungan & Cuaca Real-Time', 80, 195);

      // 3. Location Hero Card
      drawCard(80, 250, 920, 250, '#FFFFFF', '#E2E8F0');

      ctx.fillStyle = '#0F172A';
      ctx.font = '800 54px "Outfit", sans-serif';
      drawWrappedText(location.name, 120, 330, 840, 60, 1);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 30px "Outfit", sans-serif';
      drawWrappedText(location.province || 'Indonesia', 120, 385, 840, 38, 1);

      ctx.fillStyle = '#059669';
      ctx.font = '700 28px "Outfit", sans-serif';
      ctx.fillText(`📅 ${dateFormatted}`, 120, 445);

      // 4. Eco-Health Composite Score Card
      drawCard(80, 530, 920, 320, '#FFFFFF', '#E2E8F0');

      ctx.fillStyle = '#64748B';
      ctx.font = '800 26px "Outfit", sans-serif';
      ctx.fillText('SKOR KUALITAS LINGKUNGAN', 120, 595);

      ctx.fillStyle = health.color || '#10B981';
      ctx.font = '800 96px "Outfit", sans-serif';
      ctx.fillText(`${health.score}`, 120, 705);

      ctx.fillStyle = '#64748B';
      ctx.font = '800 44px "Outfit", sans-serif';
      ctx.fillText('/100', 250, 705);

      // Dynamic Score Badge
      const badgeText = health.category || 'Baik';
      ctx.font = '800 32px "Outfit", sans-serif';
      const badgeTextWidth = ctx.measureText(badgeText).width;
      const badgeWidth = Math.min(420, Math.max(260, badgeTextWidth + 60));
      const badgeX = 960 - badgeWidth;

      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(badgeX, 630, badgeWidth, 80, 18);
      else ctx.rect(badgeX, 630, badgeWidth, 80);
      ctx.fillStyle = health.color || '#10B981';
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(badgeText, badgeX + (badgeWidth / 2), 682);
      ctx.textAlign = 'left';

      ctx.fillStyle = '#334155';
      ctx.font = '600 28px "Outfit", sans-serif';
      drawWrappedText(`Perkiraan setara paparan ${health.cigs || '0'} batang rokok/hari.`, 120, 790, 840, 36, 1);

      // 5. Grid: AQI & Weather Cards
      drawCard(80, 880, 440, 370, '#FFFFFF', '#E2E8F0');

      ctx.fillStyle = aqiInfo.color || '#10B981';
      ctx.font = '800 26px "Outfit", sans-serif';
      ctx.fillText('KUALITAS UDARA', 120, 940);

      ctx.fillStyle = aqiInfo.color || '#10B981';
      ctx.font = '800 84px "Outfit", sans-serif';
      ctx.fillText(`${aqi}`, 120, 1045);

      ctx.fillStyle = '#64748B';
      ctx.font = '700 30px "Outfit", sans-serif';
      ctx.fillText('AQI US', 280, 1045);

      ctx.fillStyle = '#0F172A';
      ctx.font = '800 34px "Outfit", sans-serif';
      drawWrappedText(aqiInfo.label, 120, 1120, 360, 40, 1);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 26px "Outfit", sans-serif';
      ctx.fillText(`PM2.5: ${pm25} µg/m³`, 120, 1190);

      // Weather Card
      drawCard(560, 880, 440, 370, '#FFFFFF', '#E2E8F0');

      ctx.fillStyle = '#0284C7';
      ctx.font = '800 26px "Outfit", sans-serif';
      ctx.fillText('CUACA & SUHU', 600, 940);

      ctx.fillStyle = '#0F172A';
      ctx.font = '800 84px "Outfit", sans-serif';
      ctx.fillText(`${temp}°C`, 600, 1045);

      ctx.fillStyle = '#0F172A';
      ctx.font = '800 34px "Outfit", sans-serif';
      drawWrappedText(weatherVisual.label, 600, 1120, 360, 40, 1);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 26px "Outfit", sans-serif';
      ctx.fillText(`Kelembapan: ${humidity}%`, 600, 1190);

      // 6. Seismic / Earthquake Card (Adaptive Multi-line Layout)
      if (latestEarthquake) {
        drawCard(80, 1280, 920, 290, '#FFFFFF', '#E2E8F0');

        ctx.fillStyle = '#EF4444';
        ctx.font = '800 26px "Outfit", sans-serif';
        ctx.fillText('GEMPA TERKINI (BMKG)', 120, 1335);

        // Magnitude Pill Badge
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(120, 1370, 170, 150, 18);
        else ctx.rect(120, 1370, 170, 150);
        ctx.fillStyle = '#FEF2F2';
        ctx.fill();
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#EF4444';
        ctx.font = '800 52px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`M ${latestEarthquake.magnitude}`, 205, 1455);
        ctx.font = '700 22px "Outfit", sans-serif';
        ctx.fillText('MAGNITUDO', 205, 1495);
        ctx.textAlign = 'left';

        // Location & Depth with auto-wrap
        ctx.fillStyle = '#0F172A';
        ctx.font = '700 28px "Outfit", sans-serif';
        const nextY = drawWrappedText(latestEarthquake.wilayah || 'Indonesia', 320, 1410, 640, 36, 2);

        ctx.fillStyle = '#64748B';
        ctx.font = '600 24px "Outfit", sans-serif';
        const quakeDetails = `Kedalaman: ${latestEarthquake.depth || '-'} • ${latestEarthquake.potensi || 'Tidak berpotensi tsunami'}`;
        drawWrappedText(quakeDetails, 320, Math.max(1485, nextY + 10), 640, 32, 2);
      } else {
        drawCard(80, 1280, 920, 260, '#FFFFFF', '#E2E8F0');

        ctx.fillStyle = '#10B981';
        ctx.font = '800 26px "Outfit", sans-serif';
        ctx.fillText('INFORMASI KESELAMATAN', 120, 1340);

        ctx.fillStyle = '#0F172A';
        ctx.font = '700 30px "Outfit", sans-serif';
        ctx.fillText('Tidak ada peringatan bencana kritis saat ini.', 120, 1410);

        ctx.fillStyle = '#64748B';
        ctx.font = '600 26px "Outfit", sans-serif';
        ctx.fillText('Tetap pantau pembaruan berkala dari BMKG & Sekitarku.', 120, 1465);
      }

      // 7. Footer Branding
      ctx.fillStyle = '#0F172A';
      ctx.font = '800 34px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('sekitarku.vercel.app', 540, 1680);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 26px "Outfit", sans-serif';
      ctx.fillText('Data Resmi BMKG & Open-Meteo • Dipantau Secara Real-Time', 540, 1730);

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

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Pantauan Lingkungan ${location.name}`,
          text: shareText,
          files: [file]
        });
      } else if (navigator.share) {
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

            {/* Quake Preview in Modal */}
            {latestEarthquake && (
              <div style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-card)',
                border: 'var(--border-thick)',
                marginBottom: '0.85rem'
              }}>
                <span style={{ fontSize: '0.675rem', fontWeight: '800', color: 'var(--color-danger)', display: 'block' }}>
                  GEMPA TERKINI (BMKG)
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.25rem' }}>
                  <div style={{
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-danger-bg)',
                    color: 'var(--color-danger)',
                    fontWeight: '800',
                    fontSize: '1rem',
                    border: '1px solid var(--color-danger)'
                  }}>
                    M {latestEarthquake.magnitude}
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {latestEarthquake.wilayah}
                  </div>
                </div>
              </div>
            )}

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
