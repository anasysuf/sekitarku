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

  // Infallible Karhutla resolution
  const activeKarhutla = karhutlaData || (location?.lat ? {
    fdrs: calculateFdrs(weatherData),
    nearest: getNearbyHotspots(location.lat, location.lon).nearest
  } : null);

  const fdrs = activeKarhutla?.fdrs || calculateFdrs(weatherData);
  const nearestFire = activeKarhutla?.nearest || (location?.lat ? getNearbyHotspots(location.lat, location.lon).nearest : null);
  
  // Cross-Correlation Kabut Asap
  const { isHazeActive, isVeryNear } = getHazeStatus(nearestFire, aqi, pm25);

  const quakeText = latestEarthquake ? `• Gempa Terkini: M ${latestEarthquake.magnitude} (${latestEarthquake.wilayah})\n` : '';
  const shareText = `🌿 Pantauan Lingkungan ${location.name} (${dateFormatted}):\n• Kualitas Udara: AQI ${aqi} (${aqiInfo.label})\n• Cuaca: ${temp}°C, ${weatherVisual.label}\n• Skor Kesehatan: ${health.score}/100 (${health.category})\n• Status Kabut Asap: ${isHazeActive ? `⚠️ TERPAPAR KABUT ASAP (Asap dari titik api ${nearestFire?.regency || 'wilayah sekitar'} sejauh ${nearestFire?.distanceKm || 0} km)` : '🟢 Bersih'}\n• Potensi Api Lahan Lokal: ${fdrs.code} (${fdrs.label})\n${quakeText}🌐 Cek real-time di https://sekitarku.vercel.app`;

  // Draw 9:16 high quality story infographic on HTML5 canvas (1080 x 1920)
  const generateCanvasImage = () => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');

      // 1. Sleek Modern Clean Canvas Background
      ctx.fillStyle = '#F4F6F9';
      ctx.fillRect(0, 0, 1080, 1920);

      // Top Brand Header Bar
      const topBar = ctx.createLinearGradient(0, 0, 1080, 0);
      topBar.addColorStop(0, '#059669');
      topBar.addColorStop(0.5, '#10B981');
      topBar.addColorStop(1, '#0284C7');
      ctx.fillStyle = topBar;
      ctx.fillRect(0, 0, 1080, 16);

      // Helper for clean rounded card
      const drawCard = (x, y, w, h, fill, radius = 28, border = null) => {
        ctx.save();
        ctx.shadowColor = 'rgba(15, 23, 42, 0.05)';
        ctx.shadowBlur = 16;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 6;

        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, w, h, radius);
        } else {
          ctx.rect(x, y, w, h);
        }
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.restore();

        if (border) {
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(x, y, w, h, radius);
          } else {
            ctx.rect(x, y, w, h);
          }
          ctx.strokeStyle = border;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      };

      // Helper for soft solid badge pill (no harsh borders)
      const drawPill = (x, y, w, h, bg, radius = 14) => {
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, w, h, radius);
        } else {
          ctx.rect(x, y, w, h);
        }
        ctx.fillStyle = bg;
        ctx.fill();
      };

      // Helper for wrapped text
      const drawWrappedText = (text, x, y, maxWidth, lineHeight, maxLines = 3) => {
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

      // =========================================================================
      // 1. BRAND HEADER (y: 60 - 170)
      // =========================================================================
      
      // Brand Pill
      drawPill(70, 70, 230, 48, '#ECFDF5', 24);
      ctx.beginPath();
      ctx.arc(96, 94, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#10B981';
      ctx.fill();

      ctx.fillStyle = '#065F46';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('SEKITARKU', 116, 102);

      // Live tag right
      drawPill(740, 70, 270, 48, '#FFFFFF', 24);
      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('LIVE DATA INDONESIA', 765, 100);

      // Subtitle
      ctx.fillStyle = '#64748B';
      ctx.font = '700 18px sans-serif';
      ctx.fillText('LAPORAN RESMI KONDISI LINGKUNGAN & MITIGASI BENCANA', 70, 155);

      // =========================================================================
      // 2. HERO LOCATION & ECO-HEALTH CARD (y: 180, h: 250)
      // =========================================================================
      drawCard(70, 180, 940, 250, '#FFFFFF', 28);

      // Clean City Name (Auto-truncate smoothly)
      const cleanCityName = location.name.length > 26 ? location.name.substring(0, 25) + '...' : location.name;
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 48px sans-serif';
      ctx.fillText(cleanCityName, 110, 250);

      // Sub-location and Date
      ctx.fillStyle = '#64748B';
      ctx.font = '600 21px sans-serif';
      ctx.fillText(`${location.province || 'Indonesia'} · ${dateFormatted}`, 110, 290);

      // EcoHealth Score Filled Strip
      const scoreBg = health.score >= 80 ? '#ECFDF5' : health.score >= 50 ? '#FEF3C7' : '#FEE2E2';
      const scoreColor = health.score >= 80 ? '#047857' : health.score >= 50 ? '#B45309' : '#B91C1C';
      drawPill(110, 325, 860, 70, scoreBg, 16);

      ctx.fillStyle = scoreColor;
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(`Skor Kesehatan Lingkungan: ${health.score}/100`, 135, 368);

      ctx.font = '700 20px sans-serif';
      ctx.fillText(`(${health.category})`, 720, 368);

      // =========================================================================
      // 3. ROW 1: AQI & CUACA TWIN CARDS (y: 460, h: 360)
      // =========================================================================

      // Left Card: AQI
      drawCard(70, 460, 455, 360, '#FFFFFF', 28);

      // AQI Category Header
      ctx.fillStyle = '#64748B';
      ctx.font = '800 16px sans-serif';
      ctx.fillText('KUALITAS UDARA (AQI)', 105, 505);

      // Giant AQI Value
      ctx.fillStyle = aqiInfo.color;
      ctx.font = 'bold 88px sans-serif';
      ctx.fillText(String(aqi), 105, 600);

      // AQI Status Label
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 23px sans-serif';
      drawWrappedText(aqiInfo.label, 105, 650, 385, 28, 2);

      // AQI Subtext
      ctx.fillStyle = '#64748B';
      ctx.font = '600 19px sans-serif';
      ctx.fillText(`PM2.5: ${pm25} µg/m³`, 105, 745);
      ctx.fillText('Standar US-EPA & ISPU', 105, 780);

      // Right Card: Weather
      drawCard(555, 460, 455, 360, '#FFFFFF', 28);

      // Weather Category Header
      ctx.fillStyle = '#64748B';
      ctx.font = '800 16px sans-serif';
      ctx.fillText('CUACA & SUHU', 590, 505);

      // Giant Temp Value
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 88px sans-serif';
      ctx.fillText(`${temp}°C`, 590, 600);

      // Weather Status Label
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 23px sans-serif';
      drawWrappedText(weatherVisual.label, 590, 650, 385, 28, 2);

      // Weather Subtext
      ctx.fillStyle = '#64748B';
      ctx.font = '600 19px sans-serif';
      ctx.fillText(`Kelembapan: ${humidity}%`, 590, 745);
      ctx.fillText(`Indeks UV: ${uvIndex} / 12`, 590, 780);

      // =========================================================================
      // 4. ROW 2: KARHUTLA & KABUT ASAP ALERT CARD (y: 850, h: 420)
      // =========================================================================
      const karhutlaCardBg = isHazeActive ? '#FFFBFB' : '#FFFFFF';
      drawCard(70, 850, 940, 420, karhutlaCardBg, 28, isHazeActive ? '#FCA5A5' : null);

      // Section Title
      ctx.fillStyle = '#EA580C';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('STATUS KARHUTLA & KABUT ASAP', 110, 895);

      // Badges Row
      // 1. Lahan Lokal Pill
      drawPill(110, 920, 320, 54, fdrs.bg, 14);
      ctx.fillStyle = fdrs.color;
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`Lahan Lokal: ${fdrs.code}`, 130, 954);

      // 2. Kabut Asap Status Pill
      if (isHazeActive) {
        drawPill(450, 920, 520, 54, '#FEE2E2', 14);
        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('⚠️ TERPAPAR KABUT ASAP', 475, 954);
      } else {
        drawPill(450, 920, 520, 54, '#ECFDF5', 14);
        ctx.fillStyle = '#059669';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('🟢 Kabut Asap: Bersih / Aman', 475, 954);
      }

      // Clear Advisory Box
      const advBoxBg = isHazeActive ? '#FEE2E2' : '#F8FAFC';
      drawPill(110, 995, 860, 160, advBoxBg, 18);

      ctx.fillStyle = isHazeActive ? '#991B1B' : '#334155';
      ctx.font = isHazeActive ? 'bold 21px sans-serif' : '500 20px sans-serif';
      if (isHazeActive) {
        drawWrappedText(`Peringatan: Udara terpapar kabut asap kiriman dari titik api ${nearestFire?.regency || 'wilayah sekitar'} (${nearestFire?.distanceKm || 0} km). Lahan setempat aman dari api, namun gunakan masker N95 untuk aktivitas pernapasan!`, 135, 1045, 810, 32, 3);
      } else {
        drawWrappedText('Kondisi tanah & vegetasi lokal basah/aman dari potensi kebakaran baru. Udara terpantau bersih & bebas dari kabut asap karhutla.', 135, 1055, 810, 32, 2);
      }

      // Nearest Fire Proximity Details
      ctx.fillStyle = '#64748B';
      ctx.font = '600 19px sans-serif';
      if (nearestFire) {
        ctx.fillText(`Titik Panas Terdekat: ${nearestFire.regency} (${nearestFire.distanceKm} km) · Satelit ${nearestFire.satellite}`, 110, 1225);
      } else {
        ctx.fillText('Tidak terdeteksi titik panas satelit dalam radius 400 km', 110, 1225);
      }

      // =========================================================================
      // 5. ROW 3: GEMPA BUMI TERKINI / KESELAMATAN (y: 1300, h: 290)
      // =========================================================================
      if (latestEarthquake && latestEarthquake.magnitude) {
        drawCard(70, 1300, 940, 290, '#FFFFFF', 28);

        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('GEMPA BUMI TERKINI (BMKG)', 110, 1345);

        // Magnitude Pill
        drawPill(110, 1370, 160, 120, '#FEE2E2', 20);
        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 44px sans-serif';
        ctx.fillText(`M ${latestEarthquake.magnitude}`, 125, 1445);

        // Quake Location
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 24px sans-serif';
        drawWrappedText(latestEarthquake.wilayah, 295, 1405, 675, 32, 2);

        // Depth and Time (Guarded against undefined)
        const depthStr = latestEarthquake.depth || latestEarthquake.kedalaman || '10 km';
        const dateStr = latestEarthquake.dateTime || latestEarthquake.date || latestEarthquake.time || 'Waktu Terkini';
        ctx.fillStyle = '#64748B';
        ctx.font = '600 19px sans-serif';
        ctx.fillText(`Kedalaman: ${depthStr} · ${dateStr}`, 295, 1475);
      } else {
        drawCard(70, 1300, 940, 290, '#FFFFFF', 28);
        ctx.fillStyle = '#059669';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('PANDUAN KESELAMATAN & KESEHATAN', 110, 1345);

        ctx.fillStyle = '#334155';
        ctx.font = '600 21px sans-serif';
        ctx.fillText('• Pantau kondisi cuaca dan indeks polusi udara secara berkala.', 110, 1400);
        ctx.fillText('• Cukupi kebutuhan hidrasi harian saat beraktivitas di luar ruangan.', 110, 1445);
        ctx.fillText('• Gunakan masker bila kualitas udara berada pada level tidak sehat.', 110, 1490);
      }

      // =========================================================================
      // 6. FOOTER ANCHOR (y: 1620, h: 220)
      // =========================================================================
      drawCard(70, 1620, 940, 220, '#FFFFFF', 28);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('Pantau Lingkungan & Mitigasi Bencana Real-Time', 110, 1675);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 19px sans-serif';
      ctx.fillText('Sumber Resmi: BMKG · PVMBG (MAGMA) · NASA FIRMS · COPERNICUS', 110, 1720);

      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('sekitarku.vercel.app · Peduli Udara & Keselamatan Anda', 110, 1775);

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
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-primary-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)'
            }}>
              <Share2 size={18} strokeWidth={2.5} />
            </div>
            <div>
              <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', display: 'block' }}>
                Bagikan Kondisi Lingkungan
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                Format Story HD (9:16) untuk WhatsApp & Instagram
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
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            backgroundColor: 'var(--bg-muted)',
            border: 'var(--border-flat)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
            position: 'relative'
          }}>
            
            {/* Top Brand Banner in Preview */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: '800',
                color: '#059669',
                backgroundColor: '#ecfdf5',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Sparkles size={11} /> SEKITARKU LIVE
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                {dateFormatted}
              </span>
            </div>

            {/* City Title & EcoHealth Score */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem', gap: '0.5rem' }}>
              <div style={{ minWidth: 0 }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {location.name}
                </h4>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                  {location.province || 'Indonesia'}
                </span>
              </div>
              <div style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: health.score >= 80 ? 'var(--color-secondary-bg)' : health.score >= 50 ? 'var(--color-warning-bg)' : 'var(--color-danger-bg)',
                color: health.score >= 80 ? 'var(--color-secondary)' : health.score >= 50 ? '#b45309' : 'var(--color-danger)',
                fontSize: '0.75rem',
                fontWeight: '800',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                Skor: {health.score}/100
              </div>
            </div>

            {/* AQI & Weather Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem', marginBottom: '0.85rem' }}>
              <div style={{
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-card)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}>
                <span style={{ fontSize: '0.675rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Kualitas Udara</span>
                <div style={{ fontSize: '1.45rem', fontWeight: '800', color: aqiInfo.color, margin: '0.15rem 0' }}>
                  {aqi} AQI
                </div>
                <span style={{ fontSize: '0.725rem', fontWeight: '700', color: aqiInfo.color, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{aqiInfo.label}</span>
              </div>

              <div style={{
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-card)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}>
                <span style={{ fontSize: '0.675rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cuaca</span>
                <div style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-main)', margin: '0.15rem 0' }}>
                  {temp}°C
                </div>
                <span style={{ fontSize: '0.725rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{weatherVisual.label}</span>
              </div>
            </div>

            {/* Karhutla & Kabut Asap Preview in Modal */}
            <div style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-card)',
              marginBottom: '0.85rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.675rem', fontWeight: '800', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Flame size={13} /> STATUS KARHUTLA & KABUT ASAP
                </span>
                
                {isHazeActive ? (
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}>
                    <Wind size={10} /> ⚠️ Terpapar Asap
                  </span>
                ) : (
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
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
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: fdrs.bg,
                  color: fdrs.color,
                  whiteSpace: 'nowrap'
                }}>
                  Lahan: {fdrs.code}
                </span>

                <span style={{ fontSize: '0.725rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                  {nearestFire ? `📍 Titik Panas: ${nearestFire.regency} (${nearestFire.distanceKm} km)` : 'Nihil titik panas dekat'}
                </span>
              </div>

              {/* Plain language note */}
              <div style={{
                marginTop: '0.45rem',
                padding: '0.5rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isHazeActive ? '#fee2e2' : 'var(--bg-muted)',
                fontSize: '0.725rem',
                color: isHazeActive ? '#991b1b' : 'var(--text-muted)',
                lineHeight: 1.35,
                fontWeight: isHazeActive ? '700' : '500'
              }}>
                {isHazeActive
                  ? `Peringatan: Udara terpapar kabut asap kiriman dari titik api ${nearestFire?.regency || 'wilayah sekitar'} (${nearestFire?.distanceKm || 0} km). Lahan setempat aman dari api, namun gunakan masker N95 untuk pernapasan!`
                  : `Kondisi lahan setempat basah & aman dari risiko api baru. Tidak terdeteksi kabut asap karhutla di wilayah ini.`}
              </div>
            </div>

            {/* Quake Preview in Modal */}
            {latestEarthquake && (
              <div style={{
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-card)',
                marginBottom: '0.85rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.675rem', fontWeight: '800', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ⚡ GEMPA TERKINI (BMKG)
                  </span>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--color-danger-bg)',
                    color: 'var(--color-danger)',
                    fontWeight: '800',
                    fontSize: '0.75rem',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}>
                    M {latestEarthquake.magnitude}
                  </span>
                </div>
                <div style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--text-main)', lineHeight: 1.35, marginBottom: '0.2rem' }}>
                  {latestEarthquake.wilayah}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  Kedalaman: {latestEarthquake.depth || latestEarthquake.kedalaman || '10 km'} {latestEarthquake.dateTime || latestEarthquake.time ? `· ${latestEarthquake.dateTime || latestEarthquake.time}` : ''}
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
