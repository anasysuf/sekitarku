import React from 'react';
import { Sun, Moon, MapPin, RefreshCw, Compass, Bell, BellRing, Globe, Search, Calendar, Share2, ShieldAlert } from 'lucide-react';
import { formatFullCurrentDate } from '../../utils/format';
import { translations } from '../../utils/i18n';

export function Header({
  location,
  onOpenSearch,
  onGpsClick,
  gpsLoading,
  isDark,
  onToggleDark,
  onRefresh,
  lastUpdated,
  lang,
  onToggleLang,
  notificationsEnabled,
  onRequestNotification,
  onOpenShare,
  onOpenEmergency
}) {
  const t = translations[lang] || translations.id;

  return (
    <header>
      <div className="header-wrapper">
        
        {/* Brand & Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            flexShrink: 0
          }}>
            <Compass size={24} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.02em', margin: 0, color: 'var(--text-main)' }}>
                {t.appTitle}
              </h1>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: '800',
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-secondary)',
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {t.liveBadge}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, fontWeight: '500' }}>
              {t.appSubtitle}
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginTop: '0.35rem',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-muted)',
              border: 'var(--border-thick)',
              fontSize: '0.75rem',
              fontWeight: '700',
              color: 'var(--text-main)'
            }}>
              <Calendar size={13} color="var(--color-primary)" strokeWidth={2.5} />
              <span>{formatFullCurrentDate(lastUpdated, lang)}</span>
            </div>
          </div>
        </div>

        {/* Flat Controls */}
        <div className="header-controls">
          
          {/* City Search Button */}
          <button
            onClick={onOpenSearch}
            className="flat-btn-secondary"
            style={{
              flex: '1 1 200px',
              justifyContent: 'space-between',
              padding: '0.65rem 1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
              <MapPin size={18} color="var(--color-secondary)" style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0, textAlign: 'left' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {location.name}
                </span>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {location.province}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.75rem', backgroundColor: 'var(--bg-canvas)', padding: '3px 7px', borderRadius: 'var(--radius-sm)', border: 'var(--border-thick)' }}>
              <Search size={13} />
              <span>{t.searchCity}</span>
            </div>
          </button>

          {/* Share Button */}
          <button
            onClick={onOpenShare}
            aria-label="Bagikan Laporan"
            title="Bagikan Gambar & Laporan Kondisi Lingkungan"
            className="flat-btn-secondary"
            style={{ color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }}
          >
            <Share2 size={16} strokeWidth={2.5} />
            <span>Bagikan</span>
          </button>

          {/* Emergency Guide Button */}
          <button
            onClick={onOpenEmergency}
            aria-label="Kontak Darurat & Tanggap Bencana"
            title="Nomor Darurat Indonesia & Mitigasi Gempa/Polusi"
            className="flat-btn-secondary"
            style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
          >
            <ShieldAlert size={16} strokeWidth={2.5} />
            <span>Darurat 112</span>
          </button>

          {/* GPS */}
          <button
            onClick={onGpsClick}
            disabled={gpsLoading}
            aria-label={t.gps}
            title={t.gps}
            className={`flat-btn-secondary ${location.isGps ? 'active' : ''}`}
          >
            <Compass size={17} strokeWidth={2.2} className={gpsLoading ? 'animate-spin' : ''} />
            <span>GPS</span>
          </button>

          {/* Notification */}
          <button
            onClick={onRequestNotification}
            aria-label={notificationsEnabled ? t.notifyActive : t.notifyEnable}
            title={notificationsEnabled ? t.notifyActive : t.notifyEnable}
            className={`flat-btn-secondary ${notificationsEnabled ? 'active' : ''}`}
          >
            {notificationsEnabled ? <BellRing size={17} color="var(--color-secondary)" strokeWidth={2.2} /> : <Bell size={17} strokeWidth={2.2} />}
          </button>

          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            aria-label={t.langToggle}
            title="Ganti Bahasa (ID / EN)"
            className="flat-btn-secondary"
          >
            <Globe size={16} strokeWidth={2.2} />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            aria-label={t.refresh}
            title={t.refresh}
            className="flat-btn-secondary"
          >
            <RefreshCw size={16} strokeWidth={2.2} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDark}
            aria-label={t.themeToggle}
            title={isDark ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
            className="flat-btn-secondary"
          >
            {isDark ? (
              <>
                <Sun size={16} color="var(--color-accent)" strokeWidth={2.5} />
                <span>Terang</span>
              </>
            ) : (
              <>
                <Moon size={16} color="var(--color-primary)" strokeWidth={2.5} />
                <span>Gelap</span>
              </>
            )}
          </button>

        </div>

      </div>
    </header>
  );
}
