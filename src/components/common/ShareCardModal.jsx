import React, { useState } from 'react';
import {
  Share2,
  Download,
  Copy,
  Check,
  X,
  Sparkles,
  Calendar,
  Flame,
  Zap,
  MapPin,
  AlertTriangle,
  ShieldCheck,
  Cigarette,
  Wind
} from 'lucide-react';
import { getAqiInfo } from '../../utils/aqi.js';
import { calculateEcoHealthScore } from '../../utils/healthIndex.js';
import { getWeatherVisual } from '../../utils/weatherIcons.jsx';
import { formatFullCurrentDate } from '../../utils/format.js';
import { calculateFdrs, getNearbyHotspots, getHazeStatus } from '../../utils/karhutla.js';
import { translations } from '../../utils/i18n.js';

export function ShareCardModal({ isOpen, onClose, location, airQualityData, weatherData, latestEarthquake, karhutlaData }) {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const t = translations;

  const locationName = location?.name || location?.city || 'Indonesia';
  const locationProvince = location?.province || 'Indonesia';

  const aqi = Number(airQualityData?.current?.aqi) || 0;
  const pm25 = Number(airQualityData?.current?.pm25 ?? airQualityData?.current?.pm2_5) || 0;
  const temp = Number(weatherData?.current?.temp ?? weatherData?.current?.temperature ?? 28);
  const humidity = Number(weatherData?.current?.humidity ?? 70);
  const uvIndex = Number(weatherData?.current?.uvIndex ?? 0);
  const weatherCode = Number(weatherData?.current?.weatherCode ?? 0);

  const aqiInfo = getAqiInfo(aqi);
  const health = calculateEcoHealthScore(aqi, temp, humidity, uvIndex, pm25);
  const weatherVisual = getWeatherVisual(weatherCode);
  const dateFormatted = formatFullCurrentDate(new Date());

  // Dynamic Infallible Karhutla resolution based on active location coordinates
  const activeKarhutla = karhutlaData || (location?.lat ? {
    fdrs: calculateFdrs(weatherData),
    nearest: getNearbyHotspots(location.lat, location.lon).nearest
  } : null);

  const fdrs = activeKarhutla?.fdrs || calculateFdrs(weatherData);
  const nearestFire = activeKarhutla?.nearest || (location?.lat ? getNearbyHotspots(location.lat, location.lon).nearest : null);
  
  // Cross-Correlation Kabut Asap
  const { isHazeActive, isVeryNear } = getHazeStatus(nearestFire, aqi, pm25);

  const hazeStatusText = isHazeActive ? '⚠️ Terpapar Asap Karhutla' : '🟢 Bebas Asap';
  const fireProximityText = nearestFire ? ` (Titik Api Terdekat: ${nearestFire.regency}, ${nearestFire.distanceKm} km)` : '';
  const quakeText = latestEarthquake ? `• Gempa Terkini: M ${latestEarthquake.magnitude} (${latestEarthquake.wilayah})\n` : '';
  const cigsCount = health.cigs ?? health.cigarettesEquivalent ?? 0;
  const shareText = `📍 Laporan Lingkungan & Cuaca Real-Time: ${locationName}\n🌱 Kualitas Udara: AQI ${aqi} (${health.category})\n🚬 Paparan Rokok: ${cigsCount} btg/hari\n🌡️ Cuaca: ${temp}°C • ${weatherVisual.label || 'Cerah'}\n⚠️ Status Asap: ${hazeStatusText}${fireProximityText}\n${quakeText}\nPantau selengkapnya di Sekitarku: https://sekitarku.vercel.app`;

  // Draw 9:16 high quality story infographic on HTML5 canvas (1080 x 1920) with mathematically guaranteed bounds
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
      const drawCard = (x, y, w, h, fill, border) => {
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, w, h, 24);
        } else {
          ctx.rect(x, y, w, h);
        }
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = border || '#E2E8F0';
        ctx.lineWidth = 3.5;
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
              let truncated = line;
              while (truncated.length > 0 && ctx.measureText(truncated + '...').width > maxWidth) {
                truncated = truncated.slice(0, -1);
              }
              ctx.fillText(truncated + '...', x, currentY);
              return currentY + lineHeight;
            }
            ctx.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, x, currentY);
        return currentY + lineHeight;
      };

      // Infographic Header
      ctx.fillStyle = '#0F172A';
      ctx.font = '800 60px "Outfit", sans-serif';
      ctx.fillText('Sekitarku', 80, 115);

      ctx.fillStyle = '#64748B';
      ctx.font = '700 26px "Outfit", sans-serif';
      ctx.fillText('Laporan Lingkungan & Cuaca Real-Time', 80, 160);

      // 1. Location Hero Card (Y=195, H=205)
      drawCard(80, 195, 920, 205, '#FFFFFF', '#E2E8F0');

      const locFont = locationName.length > 24 ? '800 40px "Outfit", sans-serif' : '800 46px "Outfit", sans-serif';
      ctx.fillStyle = '#0F172A';
      ctx.font = locFont;
      drawWrappedText(locationName, 120, 260, 840, 48, 1);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 26px "Outfit", sans-serif';
      drawWrappedText(locationProvince, 120, 312, 840, 32, 1);

      ctx.fillStyle = '#059669';
      ctx.font = '700 24px "Outfit", sans-serif';
      ctx.fillText(`${dateFormatted}`, 120, 362);

      // 2. Eco-Health Composite Score Card (Y=425, H=245)
      drawCard(80, 425, 920, 245, '#FFFFFF', '#E2E8F0');

      ctx.fillStyle = '#64748B';
      ctx.font = '800 22px "Outfit", sans-serif';
      ctx.fillText(t.ecoScoreTitle, 120, 470);

      ctx.fillStyle = health.color || '#10B981';
      ctx.font = '800 84px "Outfit", sans-serif';
      ctx.fillText(`${health.score}`, 120, 565);

      ctx.fillStyle = '#64748B';
      ctx.font = '800 38px "Outfit", sans-serif';
      ctx.fillText('/100', 250, 565);

      // Dynamic Score Badge
      const badgeText = health.category || 'Baik';
      ctx.font = '800 28px "Outfit", sans-serif';
      const badgeTextWidth = ctx.measureText(badgeText).width;
      const badgeWidth = Math.min(420, Math.max(220, badgeTextWidth + 48));
      const badgeX = 960 - badgeWidth;

      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(badgeX, 505, badgeWidth, 68, 16);
      else ctx.rect(badgeX, 505, badgeWidth, 68);
      ctx.fillStyle = health.color || '#10B981';
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(badgeText, badgeX + (badgeWidth / 2), 548);
      ctx.textAlign = 'left';

      ctx.fillStyle = '#334155';
      ctx.font = '600 24px "Outfit", sans-serif';
      const cigsVal = health.cigs ?? health.cigarettesEquivalent ?? 0;
      const cigsNote = `Setara ${cigsVal} batang rokok/hari (Paparan PM2.5)`;
      drawWrappedText(cigsNote, 120, 635, 840, 30, 1);

      // 3. Grid: AQI & Weather Cards (Y=695, H=310)
      
      // AQI Card
      drawCard(80, 695, 440, 310, '#FFFFFF', '#E2E8F0');

      ctx.fillStyle = aqiInfo.color || '#10B981';
      ctx.font = '800 22px "Outfit", sans-serif';
      ctx.fillText('KUALITAS UDARA', 120, 745);

      ctx.fillStyle = aqiInfo.color || '#10B981';
      ctx.font = '800 76px "Outfit", sans-serif';
      ctx.fillText(`${aqi}`, 120, 835);

      ctx.fillStyle = '#64748B';
      ctx.font = '700 26px "Outfit", sans-serif';
      ctx.fillText('AQI US', 265, 835);

      ctx.fillStyle = '#0F172A';
      ctx.font = '800 28px "Outfit", sans-serif';
      drawWrappedText(aqiInfo.label, 120, 900, 360, 32, 1);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 22px "Outfit", sans-serif';
      ctx.fillText(`PM2.5: ${pm25} µg/m³`, 120, 960);

      // Weather Card
      drawCard(560, 695, 440, 310, '#FFFFFF', '#E2E8F0');

      ctx.fillStyle = '#3B82F6';
      ctx.font = '800 22px "Outfit", sans-serif';
      ctx.fillText('CUACA SAAT INI', 600, 745);

      ctx.fillStyle = '#0F172A';
      ctx.font = '800 76px "Outfit", sans-serif';
      ctx.fillText(`${temp}°C`, 600, 835);

      ctx.fillStyle = '#0F172A';
      ctx.font = '800 28px "Outfit", sans-serif';
      drawWrappedText(weatherVisual.label, 600, 900, 360, 32, 1);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 22px "Outfit", sans-serif';
      ctx.fillText(`${t.humidity}: ${humidity}%`, 600, 960);

      // 4. Karhutla & Wildfire Haze Alert Card (Y=1030, H=325)
      const hazeCardBorder = isHazeActive ? '#EF4444' : '#E2E8F0';
      drawCard(80, 1030, 920, 325, '#FFFFFF', hazeCardBorder);

      ctx.fillStyle = '#EA580C';
      ctx.font = '800 22px "Outfit", sans-serif';
      ctx.fillText(t.karhutlaCardHeader, 120, 1078);

      // Dynamically Sized Badges Row
      const b1Text = `${t.landLocalBadge}: ${fdrs.code}`;
      ctx.font = '800 20px "Outfit", sans-serif';
      const b1TextWidth = ctx.measureText(b1Text).width;
      const b1Width = Math.max(220, b1TextWidth + 36);

      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(120, 1105, b1Width, 48, 12);
      else ctx.rect(120, 1105, b1Width, 48);
      ctx.fillStyle = fdrs.bg || '#ECFDF5';
      ctx.fill();

      ctx.fillStyle = fdrs.color || '#10B981';
      ctx.font = '800 20px "Outfit", sans-serif';
      ctx.fillText(b1Text, 138, 1136);

      // Badge 2: Kabut Asap
      const hazeBadgeBg = isHazeActive ? '#FEE2E2' : '#ECFDF5';
      const hazeBadgeColor = isHazeActive ? '#DC2626' : '#059669';
      const hazeBadgeText = isHazeActive ? 'TERPAPAR KABUT ASAP' : 'Kabut Asap: Bersih';
      const b2TextWidth = ctx.measureText(hazeBadgeText).width;
      const b2Width = Math.max(240, b2TextWidth + 36);
      const b2X = 120 + b1Width + 14;

      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(b2X, 1105, b2Width, 48, 12);
      else ctx.rect(b2X, 1105, b2Width, 48);
      ctx.fillStyle = hazeBadgeBg;
      ctx.fill();

      ctx.fillStyle = hazeBadgeColor;
      ctx.font = '800 20px "Outfit", sans-serif';
      ctx.fillText(hazeBadgeText, b2X + 18, 1136);

      // Plain language advisory
      ctx.fillStyle = isHazeActive ? '#DC2626' : '#334155';
      ctx.font = isHazeActive ? '700 22px "Outfit", sans-serif' : '600 22px "Outfit", sans-serif';
      if (isHazeActive) {
        const hazeWarnText = `Peringatan: Terdeteksi paparan kabut asap (${nearestFire ? `${nearestFire.distanceKm} km dari ${nearestFire.regency}` : 'partikel asap karhutla'}). Gunakan masker N95.`;
        drawWrappedText(hazeWarnText, 120, 1195, 840, 30, 2);
      } else {
        const hazeSafeText = 'Kondisi udara terpantau bersih dari kabut asap karhutla langsung.';
        drawWrappedText(hazeSafeText, 120, 1195, 840, 30, 2);
      }

      ctx.fillStyle = '#64748B';
      ctx.font = '600 21px "Outfit", sans-serif';
      if (nearestFire) {
        const hotspotText = `Titik Api Terdekat: ${nearestFire.regency} (${nearestFire.distanceKm} km) • Satelit ${nearestFire.satellite || 'SNPP'}`;
        drawWrappedText(hotspotText, 120, 1315, 840, 26, 1);
      } else {
        const noFireText = 'Tidak terdeteksi titik panas dalam radius pemantauan satelit';
        drawWrappedText(noFireText, 120, 1315, 840, 26, 1);
      }

      // 5. Seismic & Earthquake Card (Y=1380, H=265)
      if (latestEarthquake) {
        drawCard(80, 1380, 920, 265, '#FFFFFF', '#E2E8F0');

        ctx.fillStyle = '#EF4444';
        ctx.font = '800 22px "Outfit", sans-serif';
        ctx.fillText('GEMPA TERKINI (BMKG)', 120, 1428);

        // Magnitude Pill Badge
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(120, 1455, 145, 135, 16);
        else ctx.rect(120, 1455, 145, 135);
        ctx.fillStyle = '#FEF2F2';
        ctx.fill();
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#EF4444';
        ctx.font = '800 44px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`M ${latestEarthquake.magnitude}`, 192, 1530);
        ctx.font = '700 19px "Outfit", sans-serif';
        ctx.fillText(t.magnitude.toUpperCase(), 192, 1565);
        ctx.textAlign = 'left';

        // Location & Depth with auto-wrap
        ctx.fillStyle = '#0F172A';
        ctx.font = '700 25px "Outfit", sans-serif';
        const nextY = drawWrappedText(latestEarthquake.wilayah || 'Indonesia', 290, 1490, 670, 32, 2);

        ctx.fillStyle = '#64748B';
        ctx.font = '600 21px "Outfit", sans-serif';
        const depthStr = latestEarthquake.depth || latestEarthquake.kedalaman || '-';
        const quakeDetails = `${t.depth}: ${depthStr} • ${latestEarthquake.potensi || 'Tidak berpotensi tsunami'}`;
        drawWrappedText(quakeDetails, 290, Math.max(1570, nextY + 6), 670, 28, 2);
      } else {
        drawCard(80, 1380, 920, 265, '#FFFFFF', '#E2E8F0');

        ctx.fillStyle = '#10B981';
        ctx.font = '800 22px "Outfit", sans-serif';
        ctx.fillText('INFORMASI KESELAMATAN', 120, 1428);

        ctx.fillStyle = '#0F172A';
        ctx.font = '700 25px "Outfit", sans-serif';
        ctx.fillText('Tidak ada peringatan bencana kritis saat ini.', 120, 1495);

        ctx.fillStyle = '#64748B';
        ctx.font = '600 21px "Outfit", sans-serif';
        ctx.fillText('Tetap pantau pembaruan berkala dari BMKG, KLHK SiPongi+ & Sekitarku.', 120, 1550);
      }

      // 6. Footer Branding & Attribution (Y=1710 onwards)
      ctx.fillStyle = '#0F172A';
      ctx.font = '800 32px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('sekitarku.vercel.app', 540, 1735);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 23px "Outfit", sans-serif';
      ctx.fillText('Data Resmi BMKG, PVMBG, NASA & SiPongi+ • Dipantau Secara Real-Time', 540, 1780);

      ctx.textAlign = 'left';

      resolve(canvas.toDataURL('image/png', 0.95));
    });
  };

  const handleNativeShare = async () => {
    setIsGenerating(true);
    try {
      const dataUrl = await generateCanvasImage();
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const safeCityName = String(locationName).toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const file = new File([blob], `sekitarku-${safeCityName}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${locationName} - Sekitarku`,
          text: shareText
        });
      } else if (navigator.share) {
        await navigator.share({
          title: `${locationName} - Sekitarku`,
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
      const safeCityName = String(locationName).toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const link = document.createElement('a');
      link.download = `sekitarku-${safeCityName}-${Date.now()}.png`;
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

  const cigsVal = health.cigs ?? health.cigarettesEquivalent ?? 0;
  const depthStr = latestEarthquake?.depth || latestEarthquake?.kedalaman || '-';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
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
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Window Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.25rem',
          borderBottom: 'var(--border-thick)',
          backgroundColor: 'var(--bg-card)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Sparkles size={16} color="var(--color-primary)" />
              {t.shareModalTitle}
            </h3>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', margin: '2px 0 0 0', fontWeight: '500' }}>
              {t.shareModalSubtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup modal bagikan"
            style={{
              padding: '0.4rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: 'var(--bg-muted)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body / 1:1 Clean Infographic Preview Container */}
        <div style={{ padding: '1rem 1.25rem', overflowY: 'auto', flex: 1 }}>
          
          {/* Live Preview Canvas Card */}
          <div style={{
            borderRadius: '16px',
            backgroundColor: '#F8FAFC',
            border: '2px solid #E2E8F0',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            position: 'relative'
          }}>
            {/* Top Decorative Brand Banner */}
            <div style={{ height: '6px', backgroundColor: '#10B981', width: '100%' }} />

            <div style={{ padding: '1.15rem' }}>
              
              {/* Infographic Header */}
              <div style={{ marginBottom: '0.85rem' }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0F172A', margin: 0, lineHeight: 1.15, fontFamily: 'Outfit, sans-serif' }}>
                  Sekitarku
                </h4>
                <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '2px 0 0 0', fontWeight: '700', fontFamily: 'Outfit, sans-serif' }}>
                  Laporan Lingkungan & Cuaca Real-Time
                </p>
              </div>

              {/* 1. Location Hero Card */}
              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                marginBottom: '0.75rem'
              }}>
                <h5 style={{ fontSize: '1.05rem', fontWeight: '900', color: '#0F172A', margin: 0, lineHeight: 1.2, fontFamily: 'Outfit, sans-serif' }}>
                  {locationName}
                </h5>
                <p style={{ fontSize: '0.775rem', color: '#64748B', margin: '2px 0 4px 0', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>
                  {locationProvince}
                </p>
                <span style={{ fontSize: '0.725rem', color: '#059669', fontWeight: '700', fontFamily: 'Outfit, sans-serif', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={13} /> {dateFormatted}
                </span>
              </div>

              {/* 2. Eco-Health Composite Score Card */}
              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                marginBottom: '0.75rem'
              }}>
                <div style={{ fontSize: '0.675rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.03em', fontFamily: 'Outfit, sans-serif' }}>
                  {t.ecoScoreTitle}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '4px 0 6px 0', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                    <span style={{ fontSize: '1.85rem', fontWeight: '900', color: health.color, lineHeight: 1, fontFamily: 'Outfit, sans-serif' }}>
                      {health.score}
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#64748B', fontFamily: 'Outfit, sans-serif' }}>
                      /100
                    </span>
                  </div>

                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: health.color,
                    color: '#FFFFFF',
                    fontWeight: '800',
                    fontSize: '0.75rem',
                    fontFamily: 'Outfit, sans-serif',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                  }}>
                    {health.category}
                  </span>
                </div>

                <div style={{ fontSize: '0.725rem', fontWeight: '600', color: '#334155', fontFamily: 'Outfit, sans-serif', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Cigarette size={14} color="#64748b" /> Setara {cigsVal} batang rokok/hari (Paparan PM2.5)
                </div>
              </div>

              {/* 3. Grid: AQI & Weather Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem', marginBottom: '0.75rem' }}>
                
                {/* AQI Card */}
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E2E8F0'
                }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: '800', color: aqiInfo.color, textTransform: 'uppercase', fontFamily: 'Outfit, sans-serif' }}>
                    KUALITAS UDARA
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '2px 0' }}>
                    <span style={{ fontSize: '1.65rem', fontWeight: '900', color: aqiInfo.color, lineHeight: 1.1, fontFamily: 'Outfit, sans-serif' }}>
                      {aqi}
                    </span>
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#64748B', fontFamily: 'Outfit, sans-serif' }}>
                      AQI US
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0F172A', fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {aqiInfo.label}
                  </div>
                  <div style={{ fontSize: '0.675rem', color: '#64748B', fontWeight: '600', marginTop: '2px', fontFamily: 'Outfit, sans-serif' }}>
                    PM2.5: {pm25} µg/m³
                  </div>
                </div>

                {/* Weather Card */}
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E2E8F0'
                }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#3B82F6', textTransform: 'uppercase', fontFamily: 'Outfit, sans-serif' }}>
                    CUACA SAAT INI
                  </div>
                  <div style={{ fontSize: '1.65rem', fontWeight: '900', color: '#0F172A', margin: '2px 0', lineHeight: 1.1, fontFamily: 'Outfit, sans-serif' }}>
                    {temp}°C
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0F172A', fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {weatherVisual.label}
                  </div>
                  <div style={{ fontSize: '0.675rem', color: '#64748B', fontWeight: '600', marginTop: '2px', fontFamily: 'Outfit, sans-serif' }}>
                    {t.humidity}: {humidity}%
                  </div>
                </div>

              </div>

              {/* 4. Karhutla & Kabut Asap Alert Card */}
              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                backgroundColor: '#FFFFFF',
                border: `1.5px solid ${isHazeActive ? '#EF4444' : '#E2E8F0'}`,
                marginBottom: '0.75rem'
              }}>
                <div style={{ fontSize: '0.675rem', fontWeight: '800', color: '#EA580C', textTransform: 'uppercase', marginBottom: '0.4rem', fontFamily: 'Outfit, sans-serif', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Flame size={13} /> {t.karhutlaCardHeader.toUpperCase()}
                </div>

                {/* Status Badges Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '0.45rem' }}>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: fdrs.bg || '#ECFDF5',
                    color: fdrs.color || '#10B981',
                    fontSize: '0.68rem',
                    fontWeight: '800',
                    fontFamily: 'Outfit, sans-serif'
                  }}>
                    {t.landLocalBadge}: {fdrs.code}
                  </span>

                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: isHazeActive ? '#FEE2E2' : '#ECFDF5',
                    color: isHazeActive ? '#DC2626' : '#059669',
                    fontSize: '0.68rem',
                    fontWeight: '800',
                    fontFamily: 'Outfit, sans-serif',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {isHazeActive ? <><AlertTriangle size={11} /> TERPAPAR KABUT ASAP</> : <><ShieldCheck size={11} /> Kabut Asap: Bersih</>}
                  </span>
                </div>

                {/* Advisory */}
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: isHazeActive ? '700' : '600',
                  color: isHazeActive ? '#DC2626' : '#334155',
                  lineHeight: 1.35,
                  marginBottom: '0.35rem',
                  fontFamily: 'Outfit, sans-serif'
                }}>
                  {isHazeActive
                    ? `Peringatan: Terdeteksi paparan kabut asap (${nearestFire ? `${nearestFire.distanceKm} km dari ${nearestFire.regency}` : 'partikel asap karhutla'}). Gunakan masker N95.`
                    : 'Kondisi udara terpantau bersih dari kabut asap karhutla langsung.'}
                </div>

                {/* Hotspot details */}
                <div style={{ fontSize: '0.68rem', fontWeight: '600', color: '#64748B', fontFamily: 'Outfit, sans-serif' }}>
                  {nearestFire
                    ? `Titik Api Terdekat: ${nearestFire.regency} (${nearestFire.distanceKm} km) • Satelit ${nearestFire.satellite || 'SNPP'}`
                    : 'Tidak terdeteksi titik panas dalam radius pemantauan satelit'}
                </div>
              </div>

              {/* 5. Seismic / Earthquake Card */}
              {latestEarthquake ? (
                <div style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E2E8F0',
                  marginBottom: '0.85rem'
                }}>
                  <div style={{ fontSize: '0.675rem', fontWeight: '800', color: '#EF4444', textTransform: 'uppercase', marginBottom: '0.45rem', fontFamily: 'Outfit, sans-serif', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Zap size={13} /> GEMPA TERKINI (BMKG)
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      backgroundColor: '#FEF2F2',
                      border: '1.5px solid #EF4444',
                      borderRadius: '8px',
                      padding: '4px 8px',
                      textAlign: 'center',
                      minWidth: '65px',
                      flexShrink: 0
                    }}>
                      <div style={{ fontSize: '1.05rem', fontWeight: '900', color: '#EF4444', lineHeight: 1.1, fontFamily: 'Outfit, sans-serif' }}>
                        M {latestEarthquake.magnitude}
                      </div>
                      <div style={{ fontSize: '0.55rem', fontWeight: '800', color: '#EF4444', textTransform: 'uppercase', fontFamily: 'Outfit, sans-serif' }}>
                        {t.magnitude}
                      </div>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.775rem', fontWeight: '700', color: '#0F172A', lineHeight: 1.3, fontFamily: 'Outfit, sans-serif', wordBreak: 'break-word' }}>
                        {latestEarthquake.wilayah}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: '600', marginTop: '2px', fontFamily: 'Outfit, sans-serif' }}>
                        {t.depth}: {depthStr} • {latestEarthquake.potensi || 'Tidak berpotensi tsunami'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E2E8F0',
                  marginBottom: '0.85rem'
                }}>
                  <div style={{ fontSize: '0.675rem', fontWeight: '800', color: '#10B981', textTransform: 'uppercase', marginBottom: '0.2rem', fontFamily: 'Outfit, sans-serif' }}>
                    INFORMASI KESELAMATAN
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0F172A', fontFamily: 'Outfit, sans-serif' }}>
                    Tidak ada peringatan bencana kritis saat ini.
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>
                    Tetap pantau pembaruan berkala dari BMKG, KLHK SiPongi+ & Sekitarku.
                  </div>
                </div>
              )}

              {/* 6. Footer Branding */}
              <div style={{ textAlign: 'center', paddingTop: '0.25rem' }}>
                <div style={{ fontSize: '0.825rem', fontWeight: '900', color: '#0F172A', fontFamily: 'Outfit, sans-serif' }}>
                  sekitarku.vercel.app
                </div>
                <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: '600', marginTop: '1px', fontFamily: 'Outfit, sans-serif' }}>
                  Data Resmi BMKG, PVMBG, NASA & SiPongi+ • Dipantau Secara Real-Time
                </div>
              </div>

            </div>
          </div>

          {/* Action Sharing Buttons Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1.15rem' }}>
            
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
              <span>{isGenerating ? 'Menyiapkan Gambar...' : t.shareBtn}</span>
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
                <span>{t.downloadPngBtn}</span>
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
                <span>{copied ? t.copiedBtn : t.copyTextBtn}</span>
              </button>

            </div>

          </div>

        </div>

        {/* Footer info */}
        <div style={{ padding: '0.65rem 1.25rem', borderTop: 'var(--border-thick)', backgroundColor: 'var(--bg-muted)', fontSize: '0.725rem', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'center' }}>
          {t.shareSupportHint}
        </div>
      </div>
    </div>
  );
}

export default ShareCardModal;
