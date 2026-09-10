import React, { useState } from 'react';
import {
  Share2,
  Download,
  Copy,
  Check,
  X,
  Flame,
  Wind,
  Sparkles
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

  // Infallible Karhutla resolution
  const activeKarhutla = karhutlaData || (location?.lat ? {
    fdrs: calculateFdrs(weatherData),
    nearest: getNearbyHotspots(location.lat, location.lon).nearest
  } : null);

  const fdrs = activeKarhutla?.fdrs || calculateFdrs(weatherData);
  const nearestFire = activeKarhutla?.nearest || (location?.lat ? getNearbyHotspots(location.lat, location.lon).nearest : null);
  
  // Cross-Correlation Kabut Asap
  const { isHazeActive, isVeryNear } = getHazeStatus(nearestFire, aqi, pm25);

  const hazeStatusText = isHazeActive ? '⚠️ Terpapar Asap Karhutla' : '🟢 Bebas Asap';
  const quakeText = latestEarthquake ? `• Gempa Terkini: M ${latestEarthquake.magnitude} (${latestEarthquake.wilayah})\n` : '';
  const shareText = `📍 Laporan Lingkungan & Cuaca Real-Time: ${locationName}\n🌱 Kualitas Udara: AQI ${aqi} (${health.category})\n🌡️ Cuaca: ${temp}°C • ${weatherVisual.label || 'Cerah'}\n⚠️ Status Asap: ${hazeStatusText}\n${quakeText}\nPantau selengkapnya di Sekitarku: https://sekitarku.vercel.app`;

  // Draw 9:16 high quality story infographic on HTML5 canvas (1080 x 1920)
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
        ctx.strokeStyle = border || '#E2E8F0';
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

      // =========================================================================
      // 2. HEADER
      // =========================================================================
      ctx.fillStyle = '#0F172A';
      ctx.font = '800 68px "Outfit", sans-serif';
      ctx.fillText('Sekitarku', 80, 135);

      ctx.fillStyle = '#64748B';
      ctx.font = '700 30px "Outfit", sans-serif';
      ctx.fillText('Laporan Lingkungan & Cuaca Real-Time', 80, 185);

      // =========================================================================
      // 3. LOCATION HERO CARD
      // =========================================================================
      drawCard(80, 225, 920, 220, '#FFFFFF', '#E2E8F0');

      ctx.fillStyle = '#0F172A';
      ctx.font = '800 52px "Outfit", sans-serif';
      drawWrappedText(locationName, 120, 295, 840, 56, 1);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 28px "Outfit", sans-serif';
      drawWrappedText(locationProvince, 120, 350, 840, 36, 1);

      ctx.fillStyle = '#059669';
      ctx.font = '700 26px "Outfit", sans-serif';
      ctx.fillText(`📅 ${dateFormatted}`, 120, 405);

      // =========================================================================
      // 4. ECO-HEALTH COMPOSITE SCORE CARD
      // =========================================================================
      drawCard(80, 470, 920, 270, '#FFFFFF', '#E2E8F0');

      ctx.fillStyle = '#64748B';
      ctx.font = '800 24px "Outfit", sans-serif';
      ctx.fillText(t.ecoScoreTitle, 120, 525);

      ctx.fillStyle = health.color || '#10B981';
      ctx.font = '800 92px "Outfit", sans-serif';
      ctx.fillText(`${health.score}`, 120, 625);

      ctx.fillStyle = '#64748B';
      ctx.font = '800 42px "Outfit", sans-serif';
      ctx.fillText('/100', 250, 625);

      // Dynamic Score Badge
      const badgeText = health.category || 'Baik';
      ctx.font = '800 30px "Outfit", sans-serif';
      const badgeTextWidth = ctx.measureText(badgeText).width;
      const badgeWidth = Math.min(460, Math.max(240, badgeTextWidth + 50));
      const badgeX = 960 - badgeWidth;

      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(badgeX, 555, badgeWidth, 75, 18);
      else ctx.rect(badgeX, 555, badgeWidth, 75);
      ctx.fillStyle = health.color || '#10B981';
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(badgeText, badgeX + (badgeWidth / 2), 603);
      ctx.textAlign = 'left';

      ctx.fillStyle = '#334155';
      ctx.font = '600 26px "Outfit", sans-serif';
      const cigsNote = `Setara ${health.cigarettesEquivalent || '0'} batang rokok/hari`;
      drawWrappedText(cigsNote, 120, 700, 840, 34, 1);

      // =========================================================================
      // 5. GRID: AQI & WEATHER CARDS
      // =========================================================================
      
      // AQI Card
      drawCard(80, 765, 440, 335, '#FFFFFF', '#E2E8F0');

      ctx.fillStyle = aqiInfo.color || '#10B981';
      ctx.font = '800 24px "Outfit", sans-serif';
      ctx.fillText('KUALITAS UDARA', 120, 820);

      ctx.fillStyle = aqiInfo.color || '#10B981';
      ctx.font = '800 80px "Outfit", sans-serif';
      ctx.fillText(`${aqi}`, 120, 915);

      ctx.fillStyle = '#64748B';
      ctx.font = '700 28px "Outfit", sans-serif';
      ctx.fillText('AQI US', 270, 915);

      ctx.fillStyle = '#0F172A';
      ctx.font = '800 30px "Outfit", sans-serif';
      drawWrappedText(aqiInfo.label, 120, 980, 360, 36, 1);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 24px "Outfit", sans-serif';
      ctx.fillText(`PM2.5: ${pm25} µg/m³`, 120, 1045);

      // Weather Card
      drawCard(560, 765, 440, 335, '#FFFFFF', '#E2E8F0');

      ctx.fillStyle = '#3B82F6';
      ctx.font = '800 24px "Outfit", sans-serif';
      ctx.fillText('CUACA SAAT INI', 600, 820);

      ctx.fillStyle = '#0F172A';
      ctx.font = '800 80px "Outfit", sans-serif';
      ctx.fillText(`${temp}°C`, 600, 915);

      ctx.fillStyle = '#0F172A';
      ctx.font = '800 30px "Outfit", sans-serif';
      drawWrappedText(weatherVisual.label, 600, 980, 360, 36, 1);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 24px "Outfit", sans-serif';
      ctx.fillText(`${t.humidity}: ${humidity}%`, 600, 1045);

      // =========================================================================
      // 6. KARHUTLA & KABUT ASAP ALERT CARD
      // =========================================================================
      const hazeCardBorder = isHazeActive ? '#EF4444' : '#E2E8F0';
      drawCard(80, 1125, 920, 315, '#FFFFFF', hazeCardBorder);

      ctx.fillStyle = '#EA580C';
      ctx.font = '800 24px "Outfit", sans-serif';
      ctx.fillText(t.karhutlaCardHeader, 120, 1175);

      // Status Badges Row
      // Lahan Lokal Badge
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(120, 1200, 270, 52, 14);
      else ctx.rect(120, 1200, 270, 52);
      ctx.fillStyle = fdrs.bg || '#ECFDF5';
      ctx.fill();

      ctx.fillStyle = fdrs.color || '#10B981';
      ctx.font = '800 22px "Outfit", sans-serif';
      ctx.fillText(`${t.landLocalBadge}: ${fdrs.code}`, 140, 1235);

      // Kabut Asap Badge
      const hazeBadgeBg = isHazeActive ? '#FEE2E2' : '#ECFDF5';
      const hazeBadgeColor = isHazeActive ? '#DC2626' : '#059669';
      const hazeBadgeText = isHazeActive ? '⚠️ TERPAPAR KABUT ASAP' : '🟢 Kabut Asap: Bersih';

      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(410, 1200, 470, 52, 14);
      else ctx.rect(410, 1200, 470, 52);
      ctx.fillStyle = hazeBadgeBg;
      ctx.fill();

      ctx.fillStyle = hazeBadgeColor;
      ctx.font = '800 22px "Outfit", sans-serif';
      ctx.fillText(hazeBadgeText, 430, 1235);

      // Plain language advisory
      ctx.fillStyle = isHazeActive ? '#DC2626' : '#334155';
      ctx.font = isHazeActive ? '700 22px "Outfit", sans-serif' : '600 22px "Outfit", sans-serif';
      if (isHazeActive) {
        const hazeWarnText = `⚠️ Terdeteksi paparan kabut asap (${isHazeActive && nearestFire ? `${nearestFire.distanceKm} km dari ${nearestFire.regency}` : 'partikel asap karhutla'}). Gunakan masker N95 / KN95.`;
        drawWrappedText(hazeWarnText, 120, 1290, 840, 32, 2);
      } else {
        const hazeSafeText = 'Kondisi udara bersih dari kabut asap kebakaran hutan dalam jarak dekat.';
        drawWrappedText(hazeSafeText, 120, 1290, 840, 32, 2);
      }

      ctx.fillStyle = '#64748B';
      ctx.font = '600 21px "Outfit", sans-serif';
      if (nearestFire) {
        const hotspotText = `Titik Panas: ${nearestFire.regency} (${nearestFire.distanceKm} km) • Satelit ${nearestFire.satellite || 'SNPP'}`;
        drawWrappedText(hotspotText, 120, 1392, 840, 26, 1);
      } else {
        const noFireText = '📍 Tidak terdeteksi titik panas dalam radius 400 km';
        drawWrappedText(noFireText, 120, 1392, 840, 26, 1);
      }

      // =========================================================================
      // 7. SEISMIC / EARTHQUAKE CARD
      // =========================================================================
      if (latestEarthquake) {
        drawCard(80, 1465, 920, 245, '#FFFFFF', '#E2E8F0');

        ctx.fillStyle = '#EF4444';
        ctx.font = '800 24px "Outfit", sans-serif';
        ctx.fillText('GEMPA TERKINI (BMKG)', 120, 1515);

        // Magnitude Pill Badge
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(120, 1540, 150, 135, 18);
        else ctx.rect(120, 1540, 150, 135);
        ctx.fillStyle = '#FEF2F2';
        ctx.fill();
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#EF4444';
        ctx.font = '800 46px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`M ${latestEarthquake.magnitude}`, 195, 1615);
        ctx.font = '700 20px "Outfit", sans-serif';
        ctx.fillText(t.magnitude.toUpperCase(), 195, 1650);
        ctx.textAlign = 'left';

        // Location & Depth with auto-wrap
        ctx.fillStyle = '#0F172A';
        ctx.font = '700 26px "Outfit", sans-serif';
        const nextY = drawWrappedText(latestEarthquake.wilayah || 'Indonesia', 295, 1575, 665, 34, 2);

        ctx.fillStyle = '#64748B';
        ctx.font = '600 22px "Outfit", sans-serif';
        const depthStr = latestEarthquake.depth || latestEarthquake.kedalaman || '-';
        const quakeDetails = `${t.depth}: ${depthStr} • ${latestEarthquake.potensi || 'Tidak berpotensi tsunami'}`;
        drawWrappedText(quakeDetails, 295, Math.max(1645, nextY + 8), 665, 30, 2);
      } else {
        drawCard(80, 1465, 920, 245, '#FFFFFF', '#E2E8F0');

        ctx.fillStyle = '#10B981';
        ctx.font = '800 24px "Outfit", sans-serif';
        ctx.fillText('INFORMASI KESELAMATAN', 120, 1515);

        ctx.fillStyle = '#0F172A';
        ctx.font = '700 26px "Outfit", sans-serif';
        ctx.fillText('Tidak ada peringatan bencana kritis saat ini.', 120, 1580);

        ctx.fillStyle = '#64748B';
        ctx.font = '600 22px "Outfit", sans-serif';
        ctx.fillText('Tetap pantau pembaruan berkala dari BMKG & Sekitarku.', 120, 1635);
      }

      // =========================================================================
      // 8. FOOTER BRANDING
      // =========================================================================
      ctx.fillStyle = '#0F172A';
      ctx.font = '800 32px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('sekitarku.vercel.app', 540, 1775);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 24px "Outfit", sans-serif';
      ctx.fillText('Data Resmi BMKG, PVMBG & NASA • Dipantau Secara Real-Time', 540, 1825);

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
          maxWidth: '460px',
          maxHeight: '90vh',
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
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.25rem 1.5rem',
          borderBottom: 'var(--border-thick)',
          backgroundColor: 'var(--bg-card)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--color-primary)" />
              {t.shareModalTitle}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0', fontWeight: '500' }}>
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
            <X size={20} />
          </button>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1 }}>
          
          {/* Aesthetic Live Card Preview */}
          <div style={{
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            background: 'var(--bg-muted)',
            border: '1px solid var(--border-flat)',
            position: 'relative'
          }}>
            {/* Top Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Sekitarku • Infografis
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                {dateFormatted}
              </span>
            </div>

            {/* City & Province Header */}
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--text-main)', margin: 0, lineHeight: 1.2 }}>
                {locationName}
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '2px 0 0 0', fontWeight: '600' }}>
                {locationProvince}
              </p>
            </div>

            {/* Eco-Health Score Preview Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-card)',
              marginBottom: '0.85rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}>
              <div>
                <span style={{ fontSize: '0.675rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {t.ecoScoreTitle}
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: '900', color: health.color }}>
                    {health.score}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)' }}>
                    /100
                  </span>
                </div>
              </div>
              <span style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: health.color,
                color: '#ffffff',
                fontWeight: '800',
                fontSize: '0.75rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                {health.category}
              </span>
            </div>

            {/* AQI and Weather Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem', marginBottom: '0.85rem' }}>
              
              {/* AQI */}
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-card)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {t.airQualityTitle}
                </span>
                <div style={{ fontSize: '1.25rem', fontWeight: '900', color: aqiInfo.color, margin: '2px 0' }}>
                  {aqi} <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)' }}>AQI</span>
                </div>
                <span style={{ fontSize: '0.725rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  {aqiInfo.label}
                </span>
              </div>

              {/* Weather */}
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-card)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {t.weatherTitle}
                </span>
                <div style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-main)', margin: '2px 0' }}>
                  {temp}°C
                </div>
                <span style={{ fontSize: '0.725rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  {weatherVisual.label}
                </span>
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
                  <Flame size={13} /> {t.karhutlaCardHeader}
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
                    <Wind size={10} /> {t.hazeActiveBadge}
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
                    {t.hazeCleanBadge}
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
                  {t.landLocalBadge}: {fdrs.code}
                </span>

                <span style={{ fontSize: '0.725rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                  {nearestFire ? `📍 ${nearestFire.regency} (${nearestFire.distanceKm} km)` : t.noHotspotsNearby}
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
                {isHazeActive ? '⚠️ Terpapar Kabut Asap' : '🟢 Bebas Asap'}
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
                    ⚡ {t.quakeTitle.toUpperCase()} (BMKG)
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
                  {t.depth}: {latestEarthquake.depth || latestEarthquake.kedalaman || '10 km'} {latestEarthquake.dateTime || latestEarthquake.time ? `· ${latestEarthquake.dateTime || latestEarthquake.time}` : ''}
                </div>
              </div>
            )}

            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textAlign: 'center', fontWeight: '600' }}>
              {'Data Resmi BMKG, PVMBG & NASA • sekitarku.vercel.app'}
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

        {/* Footer */}
        <div style={{ padding: '0.75rem 1.5rem', borderTop: 'var(--border-thick)', backgroundColor: 'var(--bg-muted)', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'center' }}>
          {t.shareSupportHint}
        </div>
      </div>
    </div>
  );
}

export default ShareCardModal;
