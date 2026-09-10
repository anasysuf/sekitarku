import React, { useState } from 'react';
import { Share2, Download, Copy, Check, X, Flame, Wind, AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';
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

  const fdrs = karhutlaData?.fdrs || { code: 'AMAN', label: 'Aman / Rendah', desc: 'Tanah & vegetasi lokal basah. Sangat kecil kemungkinan kebakaran setempat.', color: '#10b981', bg: '#ecfdf5' };
  const nearestFire = karhutlaData?.nearest;
  
  // Korelasi Silang Kabut Asap (Compound Risk)
  const isModerateOrWorseAir = aqi >= 100;
  const isNearbyHotspot = nearestFire && nearestFire.distanceKm <= 150;
  const isHazeSpillover = isModerateOrWorseAir && isNearbyHotspot;

  const shareText = `🌿 Pantauan Lingkungan ${location.name} (${dateFormatted}):\n• Kualitas Udara: AQI ${aqi} (${aqiInfo.label})\n• Cuaca: ${temp}°C, ${weatherVisual.label}\n• Skor Kesehatan: ${health.score}/100 (${health.category})\n• Status Kabut Asap: ${isHazeSpillover ? `⚠️ TERPAPAR KABUT ASAP (Asap dari titik api ${nearestFire.regency} sejauh ${nearestFire.distanceKm} km)` : '🟢 Bersih'}\n• Potensi Api Lahan Lokal: ${fdrs.code} (${fdrs.label})\n${latestEarthquake ? `• Gempa Terkini: M ${latestEarthquake.magnitude} (${latestEarthquake.wilayah})\n` : ''}🌐 Cek real-time di https://sekitarku.vercel.app`;

  // Draw 9:16 high quality story infographic on HTML5 canvas with zero overflow
  const generateCanvasImage = () => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');

      // 1. Clean Background
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, 1080, 1920);

      // Top Decorative Brand Banner
      ctx.fillStyle = '#10B981';
      ctx.fillRect(0, 0, 1080, 20);

      // Helper for clean rounded cards
      const drawCard = (x, y, w, h, fill, border, radius = 24) => {
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, w, h, radius);
        } else {
          ctx.rect(x, y, w, h);
        }
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = border;
        ctx.lineWidth = 3;
        ctx.stroke();
      };

      // Helper: Draw Wrapped Text with Strict Bounds
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

      // ==========================================
      // 1. BRAND HEADER (y: 60 - 140)
      // ==========================================
      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('SEKITARKU', 80, 95);

      ctx.fillStyle = '#64748B';
      ctx.font = '700 20px sans-serif';
      ctx.fillText('LAPORAN RESMI KONDISI LINGKUNGAN & MITIGASI BENCANA', 80, 130);

      // ==========================================
      // 2. HERO LOCATION CARD (y: 170, h: 260)
      // ==========================================
      drawCard(80, 170, 920, 260, '#FFFFFF', '#E2E8F0');

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 56px sans-serif';
      ctx.fillText(location.name.substring(0, 24), 120, 250);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 24px sans-serif';
      ctx.fillText(`${location.province || 'Indonesia'} · ${dateFormatted}`, 120, 295);

      // Eco Health Score Pill
      const scoreBg = health.score >= 80 ? '#ECFDF5' : health.score >= 50 ? '#FEF3C7' : '#FEE2E2';
      const scoreColor = health.score >= 80 ? '#059669' : health.score >= 50 ? '#D97706' : '#DC2626';

      drawCard(120, 330, 840, 70, scoreBg, scoreColor, 16);
      ctx.fillStyle = scoreColor;
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(`Skor Kesehatan: ${health.score}/100 (${health.category})`, 150, 374);

      // ==========================================
      // 3. ROW 1: AQI & WEATHER (y: 460, h: 360)
      // ==========================================
      
      // Left: AQI Card
      drawCard(80, 460, 445, 360, '#FFFFFF', '#E2E8F0');

      ctx.fillStyle = aqiInfo.color;
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('KUALITAS UDARA (AQI)', 115, 510);

      ctx.fillStyle = aqiInfo.color;
      ctx.font = 'bold 80px sans-serif';
      ctx.fillText(String(aqi), 115, 600);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 26px sans-serif';
      drawWrappedText(aqiInfo.label, 115, 650, 375, 32, 2);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 20px sans-serif';
      ctx.fillText(`PM2.5: ${pm25} µg/m³`, 115, 740);
      ctx.fillText('Standar US-EPA & ISPU', 115, 775);

      // Right: Weather Card
      drawCard(555, 460, 445, 360, '#FFFFFF', '#E2E8F0');

      ctx.fillStyle = '#0284C7';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('CUACA & SUHU', 590, 510);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 80px sans-serif';
      ctx.fillText(`${temp}°C`, 590, 600);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 26px sans-serif';
      drawWrappedText(weatherVisual.label, 590, 650, 375, 32, 2);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 20px sans-serif';
      ctx.fillText(`Kelembapan: ${humidity}%`, 590, 740);
      ctx.fillText(`Indeks Radiasi UV: ${uvIndex}`, 590, 775);

      // ==========================================
      // 4. ROW 2: POTENSI KARHUTLA & KABUT ASAP (y: 850, h: 340)
      // ==========================================
      drawCard(80, 850, 920, 340, '#FFFFFF', '#E2E8F0');

      ctx.fillStyle = '#EA580C';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('🔥 POTENSI KARHUTLA & KABUT ASAP', 120, 900);

      // 2 Badges: 1 for Smoke Haze, 1 for Local Soil FDRS
      if (isHazeSpillover) {
        // Haze Alert Badge (Red/Orange)
        drawCard(120, 930, 380, 60, '#FEE2E2', '#DC2626', 14);
        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('⚠️ TERPAPAR KABUT ASAP', 145, 968);

        // Local Soil FDRS Badge (Secondary)
        drawCard(520, 930, 340, 60, '#F1F5F9', '#94A3B8', 14);
        ctx.fillStyle = '#475569';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`Lahan Lokal: ${fdrs.code}`, 545, 968);
      } else {
        // Safe Soil Badge
        drawCard(120, 930, 320, 60, fdrs.bg || '#ECFDF5', fdrs.color || '#10B981', 14);
        ctx.fillStyle = fdrs.color || '#10B981';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(`Lahan Lokal: ${fdrs.code}`, 145, 968);

        // No Haze Badge
        drawCard(460, 930, 320, 60, '#ECFDF5', '#10B981', 14);
        ctx.fillStyle = '#059669';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('🟢 Kabut Asap: Nihil', 485, 968);
      }

      // Plain Language Explanation
      ctx.fillStyle = isHazeSpillover ? '#DC2626' : '#334155';
      ctx.font = isHazeSpillover ? 'bold 21px sans-serif' : '500 20px sans-serif';
      if (isHazeSpillover) {
        drawWrappedText(`🚨 Peringatan: Udara terpapar kabut asap kiriman dari titik api ${nearestFire?.regency} (${nearestFire?.distanceKm} km). Lahan setempat aman dari api, namun gunakan masker N95 untuk pernapasan!`, 120, 1025, 840, 28, 3);
      } else {
        drawWrappedText(`Kondisi lahan setempat basah & aman dari risiko api baru. Tidak terdeteksi sebaran kabut asap karhutla di wilayah ini.`, 120, 1025, 840, 28, 2);
      }

      // Hotspot Distance Info
      ctx.fillStyle = '#64748B';
      ctx.font = '600 19px sans-serif';
      if (nearestFire) {
        ctx.fillText(`📍 Titik Panas Terdekat: ${nearestFire.regency} (${nearestFire.distanceKm} km) · Satelit ${nearestFire.satellite}`, 120, 1150);
      } else {
        ctx.fillText('Nihil titik panas aktif terpantau dalam radius 400 km.', 120, 1150);
      }

      // ==========================================
      // 5. ROW 3: GEMPA TERKINI (y: 1220, h: 290)
      // ==========================================
      drawCard(80, 1220, 920, 290, '#FFFFFF', '#E2E8F0');

      ctx.fillStyle = '#DC2626';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('⚡ GEMPA BUMI TERKINI (BMKG)', 120, 1270);

      if (latestEarthquake) {
        // Magnitude Pill
        drawCard(120, 1300, 170, 75, '#FEE2E2', '#DC2626', 16);
        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 38px sans-serif';
        ctx.fillText(`M ${latestEarthquake.magnitude}`, 150, 1352);

        // Location text
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 24px sans-serif';
        drawWrappedText(latestEarthquake.wilayah || 'Wilayah Indonesia', 315, 1330, 640, 34, 2);

        // Sub details
        const depthVal = latestEarthquake.depth || latestEarthquake.kedalaman || '-';
        ctx.fillStyle = '#64748B';
        ctx.font = '600 20px sans-serif';
        ctx.fillText(`Kedalaman: ${depthVal} · ${latestEarthquake.date || ''} ${latestEarthquake.time || ''}`, 120, 1420);
        ctx.fillText(latestEarthquake.potensi || 'Tidak berpotensi tsunami', 120, 1455);
      } else {
        ctx.fillStyle = '#64748B';
        ctx.font = '600 24px sans-serif';
        ctx.fillText('Tidak ada aktivitas gempa signifikan baru terdeteksi.', 120, 1345);
      }

      // ==========================================
      // 6. FOOTER SECTION (y: 1540 - 1880)
      // ==========================================
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, 1540);
      ctx.lineTo(1000, 1540);
      ctx.stroke();

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('sekitarku.vercel.app', 80, 1600);

      ctx.fillStyle = '#64748B';
      ctx.font = '500 22px sans-serif';
      ctx.fillText('Sumber Resmi: BMKG, PVMBG Magma, NASA FIRMS & Copernicus', 80, 1645);
      ctx.fillText('Data diperbarui secara real-time untuk mitigasi bencana', 80, 1680);

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

            {/* Karhutla & Kabut Asap Preview in Modal (Super Clear for Laypeople) */}
            <div style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-card)',
              border: isHazeSpillover ? '1.5px solid var(--color-danger)' : 'var(--border-thick)',
              marginBottom: '0.85rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <span style={{ fontSize: '0.675rem', fontWeight: '800', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Flame size={13} /> POTENSI KARHUTLA & STATUS KABUT ASAP
                </span>
                
                {isHazeSpillover ? (
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: '800',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    color: '#dc2626',
                    border: '1px solid #dc2626',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <Wind size={10} /> ⚠️ Terpapar Asap
                  </span>
                ) : (
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: '800',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    color: '#059669',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}>
                    🟢 Asap: Bersih
                  </span>
                )}
              </div>

              {/* Status Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', margin: '0.35rem 0' }}>
                <span style={{
                  fontSize: '0.725rem',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: fdrs.bg,
                  color: fdrs.color,
                  border: `1px solid ${fdrs.color}40`
                }}>
                  Lahan Lokal: {fdrs.code}
                </span>

                <span style={{ fontSize: '0.725rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                  {nearestFire ? `📍 Titik Api: ${nearestFire.regency} (${nearestFire.distanceKm} km)` : 'Nihil titik panas dekat'}
                </span>
              </div>

              {/* Plain language note */}
              <div style={{
                marginTop: '0.45rem',
                padding: '0.45rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isHazeSpillover ? 'var(--color-danger-bg)' : 'var(--bg-muted)',
                fontSize: '0.7rem',
                color: isHazeSpillover ? 'var(--color-danger)' : 'var(--text-muted)',
                lineHeight: 1.35,
                fontWeight: isHazeSpillover ? '700' : '500'
              }}>
                {isHazeSpillover
                  ? `🚨 Waspada: Udara terpapar kabut asap kiriman dari titik api ${nearestFire?.regency} (${nearestFire?.distanceKm} km). Lahan setempat aman dari api, namun gunakan masker N95 untuk pernapasan!`
                  : `Kondisi lahan setempat basah & aman dari risiko api baru. Tidak terdeteksi kabut asap karhutla di wilayah ini.`}
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
