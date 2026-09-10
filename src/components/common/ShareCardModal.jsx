import React, { useState } from 'react';
import {
  Share2,
  Download,
  Copy,
  Check,
  X,
  Flame,
  Wind,
  ShieldCheck,
  Sparkles,
  Activity,
  Calendar,
  MapPin,
  Thermometer,
  Sun,
  Droplets,
  AlertTriangle
} from 'lucide-react';
import { getAqiInfo } from '../../utils/aqi';
import { calculateEcoHealthScore } from '../../utils/healthIndex';
import { getWeatherVisual } from '../../utils/weatherIcons';
import { formatFullCurrentDate } from '../../utils/format';
import { calculateFdrs, getNearbyHotspots, getHazeStatus } from '../../utils/karhutla';

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

  const aqi = Number(airQualityData?.current?.aqi) || 0;
  const pm25 = Number(airQualityData?.current?.pm25 ?? airQualityData?.current?.pm2_5) || 0;
  const temp = Number(weatherData?.current?.temp ?? weatherData?.current?.temperature ?? 28);
  const humidity = Number(weatherData?.current?.humidity ?? 70);
  const uvIndex = Number(weatherData?.current?.uvIndex ?? 0);
  const weatherCode = Number(weatherData?.current?.weatherCode ?? 0);

  const aqiInfo = getAqiInfo(aqi, lang);
  const health = calculateEcoHealthScore(aqi, temp, humidity, uvIndex, pm25);
  const weatherVisual = getWeatherVisual(weatherCode, lang);
  const dateFormatted = formatFullCurrentDate(new Date(), lang);

  // Infallible Karhutla resolution (uses props or recalculates immediately from coordinates)
  const activeKarhutla = karhutlaData || (location?.lat ? {
    fdrs: calculateFdrs(weatherData),
    nearest: getNearbyHotspots(location.lat, location.lon).nearest
  } : null);

  const fdrs = activeKarhutla?.fdrs || calculateFdrs(weatherData);
  const nearestFire = activeKarhutla?.nearest || (location?.lat ? getNearbyHotspots(location.lat, location.lon).nearest : null);
  
  // Cross-Correlation Kabut Asap (Identik 100% dengan KarhutlaCard)
  const { isHazeActive, isVeryNear } = getHazeStatus(nearestFire, aqi, pm25);

  const shareText = `🌿 Pantauan Lingkungan ${location.name} (${dateFormatted}):\n• Kualitas Udara: AQI ${aqi} (${aqiInfo.label})\n• Cuaca: ${temp}°C, ${weatherVisual.label}\n• Skor Kesehatan: ${health.score}/100 (${health.category})\n• Status Kabut Asap: ${isHazeActive ? `⚠️ TERPAPAR KABUT ASAP (Asap dari titik api ${nearestFire?.regency || 'wilayah sekitar'} sejauh ${nearestFire?.distanceKm || 0} km)` : '🟢 Bersih'}\n• Potensi Api Lahan Lokal: ${fdrs.code} (${fdrs.label})\n${latestEarthquake ? `• Gempa Terkini: M ${latestEarthquake.magnitude} (${latestEarthquake.wilayah})\n` : ''}🌐 Cek real-time di https://sekitarku.vercel.app`;

  // Draw 9:16 high quality story infographic on HTML5 canvas with zero overflow
  const generateCanvasImage = () => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');

      // 1. Premium Background with Subtle Environmental Mesh
      const bgGradient = ctx.createLinearGradient(0, 0, 1080, 1920);
      bgGradient.addColorStop(0, '#F0FDF4'); // soft emerald tint at top
      bgGradient.addColorStop(0.3, '#F8FAFC');
      bgGradient.addColorStop(0.7, '#F1F5F9');
      bgGradient.addColorStop(1, '#E2E8F0');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, 1080, 1920);

      // Top Decorative Emerald Accent Strip
      const topBarGrad = ctx.createLinearGradient(0, 0, 1080, 0);
      topBarGrad.addColorStop(0, '#10B981');
      topBarGrad.addColorStop(0.5, '#059669');
      topBarGrad.addColorStop(1, '#0284C7');
      ctx.fillStyle = topBarGrad;
      ctx.fillRect(0, 0, 1080, 24);

      // Helper for clean rounded cards with subtle drop shadow
      const drawCard = (x, y, w, h, fill, border, radius = 24, hasShadow = true) => {
        ctx.save();
        if (hasShadow) {
          ctx.shadowColor = 'rgba(15, 23, 42, 0.06)';
          ctx.shadowBlur = 20;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 10;
        }

        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, w, h, radius);
        } else {
          ctx.rect(x, y, w, h);
        }
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.restore();

        // Border stroke
        if (border) {
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(x, y, w, h, radius);
          } else {
            ctx.rect(x, y, w, h);
          }
          ctx.strokeStyle = border;
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }
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
      // 1. BRAND HEADER (y: 60 - 150)
      // ==========================================
      
      // Brand Pill Badge
      drawCard(80, 60, 260, 52, '#ECFDF5', '#10B981', 26, false);
      
      // Pulse dot
      ctx.beginPath();
      ctx.arc(110, 86, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#10B981';
      ctx.fill();

      ctx.fillStyle = '#065F46';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('SEKITARKU', 130, 94);

      // Top right live data badge
      drawCard(710, 60, 290, 52, '#FFFFFF', '#CBD5E1', 26, false);
      ctx.fillStyle = '#475569';
      ctx.font = '700 18px sans-serif';
      ctx.fillText('LIVE DATA INDONESIA', 735, 93);

      // Subtitle
      ctx.fillStyle = '#64748B';
      ctx.font = '700 20px sans-serif';
      ctx.fillText('LAPORAN RESMI KONDISI LINGKUNGAN & MITIGASI BENCANA', 80, 150);

      // ==========================================
      // 2. HERO LOCATION CARD (y: 180, h: 260)
      // ==========================================
      drawCard(80, 180, 920, 260, '#FFFFFF', '#E2E8F0', 28);

      // City Name
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 54px sans-serif';
      ctx.fillText(location.name.substring(0, 22), 120, 255);

      // Location & Date
      ctx.fillStyle = '#64748B';
      ctx.font = '600 22px sans-serif';
      ctx.fillText(`📍 ${location.province || 'Indonesia'} · 📅 ${dateFormatted}`, 120, 300);

      // Eco Health Score Capsule (Wide Banner)
      const scoreBg = health.score >= 80 ? '#ECFDF5' : health.score >= 50 ? '#FEF3C7' : '#FEE2E2';
      const scoreBorder = health.score >= 80 ? '#10B981' : health.score >= 50 ? '#F59E0B' : '#EF4444';
      const scoreColor = health.score >= 80 ? '#047857' : health.score >= 50 ? '#B45309' : '#B91C1C';

      drawCard(120, 335, 840, 75, scoreBg, scoreBorder, 18, false);
      
      ctx.fillStyle = scoreColor;
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(`Skor Kesehatan Lingkungan: ${health.score}/100`, 155, 382);

      ctx.fillStyle = scoreColor;
      ctx.font = '700 22px sans-serif';
      ctx.fillText(`(${health.category})`, 760, 382);

      // ==========================================
      // 3. ROW 1: AQI & WEATHER (y: 470, h: 360)
      // ==========================================
      
      // Left: AQI Card
      drawCard(80, 470, 445, 360, '#FFFFFF', '#E2E8F0', 24);

      // AQI Header Badge
      drawCard(110, 500, 250, 40, aqiInfo.bg || '#F8FAFC', aqiInfo.color, 20, false);
      ctx.fillStyle = aqiInfo.color;
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('KUALITAS UDARA (AQI)', 125, 526);

      // Giant AQI Number
      ctx.fillStyle = aqiInfo.color;
      ctx.font = 'bold 84px sans-serif';
      ctx.fillText(String(aqi), 115, 615);

      // AQI Status Label
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 24px sans-serif';
      drawWrappedText(aqiInfo.label, 115, 665, 375, 30, 2);

      // Sub-metrics
      ctx.fillStyle = '#64748B';
      ctx.font = '600 20px sans-serif';
      ctx.fillText(`PM2.5: ${pm25} µg/m³`, 115, 750);
      ctx.fillText('Standar US-EPA & ISPU', 115, 785);

      // Right: Weather Card
      drawCard(555, 470, 445, 360, '#FFFFFF', '#E2E8F0', 24);

      // Weather Header Badge
      drawCard(585, 500, 210, 40, '#F0F9FF', '#0284C7', 20, false);
      ctx.fillStyle = '#0284C7';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('CUACA & SUHU', 605, 526);

      // Giant Temp Number
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 84px sans-serif';
      ctx.fillText(`${temp}°C`, 590, 615);

      // Weather Description
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 24px sans-serif';
      drawWrappedText(weatherVisual.label, 590, 665, 375, 30, 2);

      // Sub-metrics
      ctx.fillStyle = '#64748B';
      ctx.font = '600 20px sans-serif';
      ctx.fillText(`Kelembapan: ${humidity}%`, 590, 750);
      ctx.fillText(`Indeks UV: ${uvIndex} / 12`, 590, 785);

      // ==========================================
      // 4. ROW 2: POTENSI KARHUTLA & KABUT ASAP (y: 860, h: 360)
      // ==========================================
      const hazeBorderColor = isHazeActive ? '#EF4444' : '#E2E8F0';
      const hazeBgCard = isHazeActive ? '#FFF5F5' : '#FFFFFF';
      drawCard(80, 860, 920, 360, hazeBgCard, hazeBorderColor, 26);

      // Section Title
      ctx.fillStyle = '#EA580C';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('🔥 POTENSI KARHUTLA & STATUS KABUT ASAP', 120, 910);

      // Status Badges Row
      // 1. Lahan Lokal
      drawCard(120, 935, 320, 58, fdrs.bg, fdrs.color, 14, false);
      ctx.fillStyle = fdrs.color;
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(`Lahan Lokal: ${fdrs.code}`, 145, 972);

      // 2. Kabut Asap Status Badge
      if (isHazeActive) {
        drawCard(465, 935, 495, 58, '#FEE2E2', '#DC2626', 14, false);
        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('⚠️ TERPAPAR KABUT ASAP', 490, 972);
      } else {
        drawCard(465, 935, 495, 58, '#ECFDF5', '#059669', 14, false);
        ctx.fillStyle = '#059669';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('🟢 Kabut Asap: Nihil / Bersih', 490, 972);
      }

      // Plain language advisory box
      const advisoryBg = isHazeActive ? '#FEE2E2' : '#F8FAFC';
      const advisoryBorder = isHazeActive ? '#FCA5A5' : '#E2E8F0';
      drawCard(120, 1015, 840, 115, advisoryBg, advisoryBorder, 16, false);

      ctx.fillStyle = isHazeActive ? '#B91C1C' : '#334155';
      ctx.font = isHazeActive ? 'bold 21px sans-serif' : '500 20px sans-serif';
      if (isHazeActive) {
        drawWrappedText(`🚨 Peringatan: Udara terpapar kabut asap kiriman dari titik api ${nearestFire?.regency || 'wilayah sekitar'} (${nearestFire?.distanceKm || 0} km). Lahan setempat aman dari api, namun gunakan masker N95 untuk pernapasan!`, 140, 1055, 800, 28, 3);
      } else {
        drawWrappedText('Kondisi tanah & vegetasi lokal basah/aman dari potensi kebakaran baru. Udara terpantau bersih & bebas kabut asap karhutla.', 140, 1060, 800, 28, 2);
      }

      // Hotspot proximity distance
      ctx.fillStyle = '#64748B';
      ctx.font = '600 20px sans-serif';
      if (nearestFire) {
        ctx.fillText(`📍 Titik Panas Satelit Terdekat: ${nearestFire.regency} (${nearestFire.distanceKm} km) · Satelit ${nearestFire.satellite}`, 120, 1185);
      } else {
        ctx.fillText('📍 Tidak terdeteksi titik panas dalam radius 400 km', 120, 1185);
      }

      // ==========================================
      // 5. ROW 3: GEMPA TERKINI (y: 1250, h: 240)
      // ==========================================
      if (latestEarthquake) {
        drawCard(80, 1250, 920, 240, '#FFFFFF', '#E2E8F0', 26);

        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('⚡ GEMPA BUMI TERKINI (BMKG)', 120, 1300);

        // Magnitude Pill
        drawCard(120, 1325, 160, 120, '#FEE2E2', '#DC2626', 18, false);
        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 48px sans-serif';
        ctx.fillText(`M ${latestEarthquake.magnitude}`, 135, 1405);

        // Quake Details
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 26px sans-serif';
        drawWrappedText(latestEarthquake.wilayah, 310, 1365, 650, 34, 2);

        ctx.fillStyle = '#64748B';
        ctx.font = '600 20px sans-serif';
        ctx.fillText(`Kedalaman: ${latestEarthquake.kedalaman} · ${latestEarthquake.tanggal} ${latestEarthquake.jam}`, 310, 1425);
      } else {
        // Fallback: Health Safety Tips
        drawCard(80, 1250, 920, 240, '#FFFFFF', '#E2E8F0', 26);
        ctx.fillStyle = '#059669';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('🛡️ PANDUAN KESELAMATAN & KESEHATAN', 120, 1300);

        ctx.fillStyle = '#334155';
        ctx.font = '600 22px sans-serif';
        ctx.fillText('• Pantau perubahan cuaca dan indeks polusi secara berkala.', 120, 1355);
        ctx.fillText('• Bawa air minum yang cukup dan gunakan pelindung saat sinar UV tinggi.', 120, 1395);
        ctx.fillText('• Gunakan masker N95 jika udara berada pada level sensitif / tidak sehat.', 120, 1435);
      }

      // ==========================================
      // 6. FOOTER WATERMARK & CREDITS (y: 1670 - 1870)
      // ==========================================
      drawCard(80, 1670, 920, 190, '#FFFFFF', '#E2E8F0', 28);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('Pantau Lingkungan & Mitigasi Bencana Real-Time', 120, 1725);

      // Data Sources Pill Strip
      ctx.fillStyle = '#64748B';
      ctx.font = '600 20px sans-serif';
      ctx.fillText('Data Resmi: BMKG · PVMBG (MAGMA) · NASA FIRMS · COPERNICUS', 120, 1770);

      // Brand Link Banner
      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('🌿 sekitarku.vercel.app · Peduli Udara & Keselamatan Anda', 120, 1820);

      resolve(canvas.toDataURL('image/png', 0.95));
    });
  };

  const handleNativeShare = async () => {
    setIsGenerating(true);
    try {
      const dataUrl = await generateCanvasImage();
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `sekitarku-${location.name.toLowerCase().replace(/\s+/g, '-')}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Laporan Lingkungan ${location.name} - Sekitarku`,
          text: shareText
        });
      } else if (navigator.share) {
        await navigator.share({
          title: `Laporan Lingkungan ${location.name} - Sekitarku`,
          text: shareText,
          url: window.location.href
        });
      } else {
        handleDownloadImage();
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share error:', err);
        handleDownloadImage();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = async () => {
    setIsGenerating(true);
    try {
      const dataUrl = await generateCanvasImage();
      const link = document.createElement('a');
      link.download = `sekitarku-${location.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        className="flat-card"
        style={{
          width: '100%',
          maxWidth: '480px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-card)',
          boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.25)',
          borderRadius: 'var(--radius-xl)',
          border: '1.5px solid var(--border-color)',
          padding: 0,
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1.15rem 1.4rem',
          borderBottom: 'var(--border-thick)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-primary-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)'
            }}>
              <Share2 size={16} strokeWidth={2.5} />
            </div>
            <div>
              <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', display: 'block' }}>
                Bagikan Kartu Kondisi Lingkungan
              </span>
              <span style={{ fontSize: '0.725rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                Grafis HD 9:16 Siap Dibagikan ke WhatsApp & Instagram
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flat-btn-secondary"
            style={{ width: '32px', height: '32px', padding: 0, minHeight: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body & Interactive Preview */}
        <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1 }}>
          
          {/* Aesthetic Card Frame Mockup */}
          <div style={{
            border: '1.5px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-muted) 100%)',
            boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.08)',
            position: 'relative'
          }}>
            
            {/* Top Brand Banner in Preview */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: '800',
                  color: '#059669',
                  backgroundColor: '#ecfdf5',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid #10b98140',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Sparkles size={11} /> SEKITARKU STORY HD
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                {dateFormatted}
              </span>
            </div>

            {/* City Title & EcoHealth Score */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                  {location.name}
                </h4>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                  {location.province || 'Indonesia'}
                </span>
              </div>
              <div style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: health.score >= 80 ? 'var(--color-secondary-bg)' : health.score >= 50 ? 'var(--color-warning-bg)' : 'var(--color-danger-bg)',
                color: health.score >= 80 ? 'var(--color-secondary)' : health.score >= 50 ? '#b45309' : 'var(--color-danger)',
                fontSize: '0.75rem',
                fontWeight: '800',
                border: `1px solid ${health.score >= 80 ? 'var(--color-secondary)' : health.score >= 50 ? '#b45309' : 'var(--color-danger)'}40`
              }}>
                Skor: {health.score}/100
              </div>
            </div>

            {/* AQI & Weather Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem', marginBottom: '0.85rem' }}>
              <div style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-card)',
                border: 'var(--border-flat)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}>
                <span style={{ fontSize: '0.675rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Kualitas Udara</span>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: aqiInfo.color, margin: '0.15rem 0' }}>
                  {aqi} AQI
                </div>
                <span style={{ fontSize: '0.725rem', fontWeight: '700', color: aqiInfo.color }}>{aqiInfo.label}</span>
              </div>

              <div style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-card)',
                border: 'var(--border-flat)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}>
                <span style={{ fontSize: '0.675rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cuaca</span>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', margin: '0.15rem 0' }}>
                  {temp}°C
                </div>
                <span style={{ fontSize: '0.725rem', fontWeight: '700', color: 'var(--text-main)' }}>{weatherVisual.label}</span>
              </div>
            </div>

            {/* Karhutla & Kabut Asap Preview in Modal */}
            <div style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-card)',
              border: isHazeActive ? '1.5px solid var(--color-danger)' : 'var(--border-flat)',
              marginBottom: '0.85rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <span style={{ fontSize: '0.675rem', fontWeight: '800', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Flame size={13} /> POTENSI KARHUTLA & STATUS KABUT ASAP
                </span>
                
                {isHazeActive ? (
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: '800',
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-sm)',
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
                    borderRadius: 'var(--radius-sm)',
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
                padding: '0.5rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isHazeActive ? 'var(--color-danger-bg)' : 'var(--bg-muted)',
                fontSize: '0.725rem',
                color: isHazeActive ? 'var(--color-danger)' : 'var(--text-muted)',
                lineHeight: 1.35,
                fontWeight: isHazeActive ? '700' : '500'
              }}>
                {isHazeActive
                  ? `🚨 Waspada: Udara terpapar kabut asap kiriman dari titik api ${nearestFire?.regency || 'wilayah sekitar'} (${nearestFire?.distanceKm || 0} km). Lahan setempat aman dari api, namun gunakan masker N95 untuk pernapasan!`
                  : `Kondisi lahan setempat basah & aman dari risiko api baru. Tidak terdeteksi kabut asap karhutla di wilayah ini.`}
              </div>
            </div>

            {/* Quake Preview in Modal */}
            {latestEarthquake && (
              <div style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-card)',
                border: 'var(--border-flat)',
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
            
            {/* Primary Action: Bagikan */}
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
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
              }}
            >
              <Share2 size={18} strokeWidth={2.5} />
              <span>{isGenerating ? 'Menyiapkan Gambar...' : 'Bagikan Gambar'}</span>
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
                <span>Unduh PNG</span>
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
