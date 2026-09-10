import React, { useState } from 'react';
import { Share2, Download, Copy, Check, X, Flame, Activity } from 'lucide-react';
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
  karhutlaData,
  lang = 'id'
}) {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const aqi = airQualityData?.current?.aqi || 0;
  const pm25 = airQualityData?.current?.pm25 || airQualityData?.current?.pm2_5 || 0;
  const temp = weatherData?.current?.temp || 28;
  const humidity = weatherData?.current?.humidity || 70;
  const uvIndex = weatherData?.current?.uvIndex || 0;
  const weatherCode = weatherData?.current?.weatherCode || 0;

  const aqiInfo = getAqiInfo(aqi, lang);
  const health = calculateEcoHealthScore(aqi, temp, humidity, uvIndex, pm25);
  const weatherVisual = getWeatherVisual(weatherCode, lang);
  const dateFormatted = formatFullCurrentDate(new Date(), lang);

  const fdrs = karhutlaData?.fdrs || { code: 'AMAN', label: 'Aman / Rendah', color: '#10b981' };
  const nearestFire = karhutlaData?.nearest;

  const shareText = `🌿 Pantauan Lingkungan ${location.name} (${dateFormatted}):\n• Kualitas Udara (AQI): ${aqi} (${aqiInfo.label})\n• Cuaca: ${temp}°C, ${weatherVisual.label}\n• Skor Kesehatan Lingkungan: ${health.score}/100 (${health.category})\n• Indeks Karhutla (FDRS): ${fdrs.code} (${fdrs.label})\n${latestEarthquake ? `• Gempa Terkini: M ${latestEarthquake.magnitude} (${latestEarthquake.wilayah})\n` : ''}🌐 Cek real-time di https://sekitarku.vercel.app`;

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

      // Helper: Draw Wrapped and Truncated Text
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
              ctx.fillText(line + '...', x, currentY);
              return currentY + lineHeight;
            }
            ctx.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }
        if (line && linesCount < maxLines) {
          ctx.fillText(line, x, currentY);
          currentY += lineHeight;
        }
        return currentY;
      };

      // --- HEADER SECTION ---
      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 38px sans-serif';
      ctx.fillText('SEKITARKU', 80, 110);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 24px sans-serif';
      ctx.fillText('LAPORAN RESMI KONDISI LINGKUNGAN & MITIGASI BENCANA', 80, 150);

      // --- HERO CARD: LOCATION & HEALTH SCORE (y: 200, h: 320) ---
      drawCard(80, 200, 920, 320, '#FFFFFF', '#E2E8F0');

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 64px sans-serif';
      ctx.fillText(location.name.substring(0, 22), 125, 290);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 28px sans-serif';
      ctx.fillText(`${location.province || 'Indonesia'} · ${dateFormatted}`, 125, 340);

      // Eco Health Score Badge
      const scoreBg = health.score >= 80 ? '#ECFDF5' : health.score >= 50 ? '#FEF3C7' : '#FEE2E2';
      const scoreColor = health.score >= 80 ? '#059669' : health.score >= 50 ? '#D97706' : '#DC2626';

      drawCard(125, 380, 830, 100, scoreBg, scoreColor);
      ctx.fillStyle = scoreColor;
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(`Skor Kesehatan Lingkungan: ${health.score}/100 (${health.category})`, 160, 444);

      // --- ROW 1: AQI & WEATHER (y: 560, h: 420) ---
      
      // AQI CARD (Left)
      drawCard(80, 560, 440, 420, '#FFFFFF', '#E2E8F0');

      ctx.fillStyle = aqiInfo.color;
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('KUALITAS UDARA (AQI)', 120, 620);

      ctx.fillStyle = aqiInfo.color;
      ctx.font = 'bold 96px sans-serif';
      ctx.fillText(String(aqi), 120, 725);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 34px sans-serif';
      ctx.fillText(aqiInfo.label.substring(0, 18), 120, 785);

      ctx.fillStyle = '#64748B';
      ctx.font = '500 24px sans-serif';
      ctx.fillText(`PM2.5: ${pm25} µg/m³`, 120, 835);
      ctx.fillText('Standar US-EPA & ISPU', 120, 875);

      // WEATHER CARD (Right)
      drawCard(560, 560, 440, 420, '#FFFFFF', '#E2E8F0');

      ctx.fillStyle = '#0284C7';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('CUACA & SUHU', 600, 620);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 96px sans-serif';
      ctx.fillText(`${temp}°C`, 600, 725);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 34px sans-serif';
      ctx.fillText(weatherVisual.label.substring(0, 18), 600, 785);

      ctx.fillStyle = '#64748B';
      ctx.font = '500 24px sans-serif';
      ctx.fillText(`Kelembapan: ${humidity}%`, 600, 835);
      ctx.fillText(`Indeks Radiasi UV: ${uvIndex}`, 600, 875);

      // --- ROW 2: EARTHQUAKE (y: 1020, h: 330) ---
      drawCard(80, 1020, 920, 330, '#FFFFFF', '#E2E8F0');

      ctx.fillStyle = '#DC2626';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('⚡ GEMPA BUMI TERKINI (BMKG)', 125, 1080);

      if (latestEarthquake) {
        // Magnitude Pill
        drawCard(125, 1115, 200, 80, '#FEE2E2', '#DC2626');
        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 44px sans-serif';
        ctx.fillText(`M ${latestEarthquake.magnitude}`, 160, 1172);

        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 28px sans-serif';
        drawWrappedText(latestEarthquake.wilayah, 355, 1145, 600, 38, 2);

        ctx.fillStyle = '#64748B';
        ctx.font = '500 22px sans-serif';
        ctx.fillText(`Kedalaman: ${latestEarthquake.kedalaman} · ${latestEarthquake.date} ${latestEarthquake.time}`, 125, 1255);
        ctx.fillText(latestEarthquake.potensi || 'Tidak berpotensi tsunami', 125, 1290);
      } else {
        ctx.fillStyle = '#64748B';
        ctx.font = '500 28px sans-serif';
        ctx.fillText('Tidak ada aktivitas gempa signifikan baru terdeteksi.', 125, 1180);
      }

      // --- ROW 3: FOREST FIRE / KARHUTLA & FDRS (y: 1390, h: 290) ---
      drawCard(80, 1390, 920, 290, '#FFFFFF', '#E2E8F0');

      ctx.fillStyle = '#EA580C';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('🔥 POTENSI KARHUTLA & TITIK PANAS SATELIT', 125, 1450);

      // FDRS Badge
      drawCard(125, 1485, 280, 75, fdrs.bg || '#ECFDF5', fdrs.color || '#10B981');
      ctx.fillStyle = fdrs.color || '#10B981';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(`FDRS: ${fdrs.code}`, 155, 1535);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(fdrs.label, 430, 1520);

      ctx.fillStyle = '#64748B';
      ctx.font = '500 22px sans-serif';
      if (nearestFire) {
        ctx.fillText(`Titik Panas Terdekat: ${nearestFire.regency} (${nearestFire.distanceKm} km dari lokasi)`, 125, 1600);
        ctx.fillText(`Satelit: ${nearestFire.satellite} · Tipe: ${nearestFire.type}`, 125, 1635);
      } else {
        ctx.fillText('Nihil titik panas aktif dalam radius 400 km.', 125, 1600);
      }

      // --- FOOTER SECTION (y: 1720) ---
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, 1720);
      ctx.lineTo(1000, 1720);
      ctx.stroke();

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('sekitarku.vercel.app', 80, 1780);

      ctx.fillStyle = '#64748B';
      ctx.font = '500 22px sans-serif';
      ctx.fillText('Sumber Resmi: BMKG, PVMBG Magma, NASA FIRMS & Copernicus', 80, 1825);
      ctx.fillText('Data diperbarui secara real-time untuk mitigasi bencana', 80, 1855);

      // Export as Blob
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });
  };

  const handleDownloadImage = async () => {
    try {
      setIsGenerating(true);
      const blob = await generateCanvasImage();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sekitarku-${location.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Gagal generate gambar:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNativeShare = async () => {
    try {
      setIsGenerating(true);
      const blob = await generateCanvasImage();
      const file = new File([blob], `sekitarku-${location.name.toLowerCase().replace(/\s+/g, '-')}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Pantauan Lingkungan ${location.name}`,
          text: shareText
        });
      } else if (navigator.share) {
        await navigator.share({
          title: `Pantauan Lingkungan ${location.name}`,
          text: shareText,
          url: 'https://sekitarku.vercel.app'
        });
      } else {
        handleDownloadImage();
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        handleDownloadImage();
      }
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
    <div className="modal-overlay animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          width: '95%',
          maxHeight: '90vh',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        {/* Header Modal */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: 'var(--border-thick)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-primary-bg)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Share2 size={18} strokeWidth={2.5} />
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

            {/* Karhutla Preview in Modal */}
            <div style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-card)',
              border: 'var(--border-thick)',
              marginBottom: '0.85rem'
            }}>
              <span style={{ fontSize: '0.675rem', fontWeight: '800', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Flame size={13} /> POTENSI KARHUTLA & TITIK PANAS (BMKG & NASA)
              </span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: fdrs.color,
                  color: '#fff'
                }}>
                  FDRS: {fdrs.code} ({fdrs.label})
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                  {nearestFire ? `📍 ${nearestFire.regency} (${nearestFire.distanceKm} km)` : 'Nihil titik panas dekat'}
                </span>
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
                  ⚡ GEMPA TERKINI (BMKG)
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
              Data Resmi BMKG, PVMBG & NASA • sekitarku.vercel.app
            </div>
          </div>

          {/* Action Sharing Buttons Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1.25rem' }}>
            
            {/* Unified Primary Action: Bagikan */}
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
