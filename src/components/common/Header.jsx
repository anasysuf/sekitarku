import React from 'react';
import { formatFullCurrentDate } from '../../utils/format';
import { i18n } from '../../utils/i18n';
import {
  Compass,
  MapPin,
  Search,
  RefreshCw,
  Bell,
  BellRing,
  Moon,
  Sun,
  Share2,
  ShieldAlert,
  Calendar
} from 'lucide-react';

export function Header({
  location,
  onOpenSearch,
  onGpsClick,
  gpsLoading,
  isDark,
  onToggleDark,
  onRefresh,
  lastUpdated,
  notificationsEnabled,
  onRequestNotification,
  onOpenShare,
  onOpenEmergency
}) {
  const t = i18n.id;

  const displayName = location?.name || 'Jakarta Pusat';
  const displayProvince = (location?.province && location?.province !== displayName)
    ? location.province
    : (displayName.includes('Jakarta') ? 'DKI Jakarta' : (location?.province || 'Indonesia'));

  return (
    <header className="app-header">
      {/* Top Bar: Brand, Live Indicator & Primary Actions */}
      <div className="header-top-row" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem'
      }}>
        
        {/* Brand & Subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              backgroundColor: 'var(--color-secondary)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-inverse)',
              flexShrink: 0
            }}
          >
            <Compass size={24} strokeWidth={2.5} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: '900', letterSpacing: '-0.03em', margin: 0, color: 'var(--text-main)' }}>
                {t.appName}
              </h1>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: '900',
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-secondary)',
                color: 'var(--text-inverse)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                {t.liveBadge}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '2px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                {t.appSubtitle}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>•</span>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.725rem',
                fontWeight: '700',
                color: 'var(--color-primary)'
              }}>
                <Calendar size={12} strokeWidth={2.5} />
                <span>{formatFullCurrentDate(lastUpdated)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Actions: Share & Emergency */}
        <div className="header-action-buttons" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={onOpenShare}
            aria-label="Bagikan Laporan"
            className="flat-btn-secondary header-btn"
            style={{
              padding: '0.45rem 0.85rem',
              minHeight: '38px',
              color: 'var(--color-primary)',
              borderColor: 'var(--color-primary)',
              backgroundColor: 'var(--color-primary-bg)',
              fontWeight: '700'
            }}
          >
            <Share2 size={15} strokeWidth={2.5} />
            <span>{t.share || 'Bagikan'}</span>
          </button>

          <button
            onClick={onOpenEmergency}
            aria-label="Kontak Darurat & Tanggap Bencana"
            className="flat-btn-secondary header-btn"
            style={{
              padding: '0.45rem 0.85rem',
              minHeight: '38px',
              color: 'var(--color-danger)',
              borderColor: 'var(--color-danger)',
              backgroundColor: 'var(--color-danger-bg)',
              fontWeight: '700'
            }}
          >
            <ShieldAlert size={15} strokeWidth={2.5} />
            <span>{t.emergency || 'Darurat 112'}</span>
          </button>
        </div>

      </div>

      {/* Bottom Bar: Search & Compact Utility Toolbar */}
      <div className="header-bottom-row" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.65rem',
        marginTop: '0.85rem'
      }}>
        
        {/* City Search Bar with integrated GPS trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 280px', minWidth: 0 }}>
          
          <button
            onClick={onOpenSearch}
            className="flat-btn-secondary"
            style={{
              flex: 1,
              justifyContent: 'space-between',
              padding: '0.5rem 0.85rem',
              minHeight: '40px',
              backgroundColor: 'var(--bg-card)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
              <MapPin size={16} color="var(--color-secondary)" style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0, textAlign: 'left' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {displayName}
                </span>
                <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {displayProvince}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.7rem', backgroundColor: 'var(--bg-muted)', padding: '2px 7px', borderRadius: 'var(--radius-sm)', border: 'var(--border-thick)' }}>
              <Search size={11} />
              <span>{t.searchCity}</span>
            </div>
          </button>

          <button
            onClick={onGpsClick}
            disabled={gpsLoading}
            aria-label={t.gps}
            title={t.gps}
            className={`flat-btn-secondary ${location?.isGps ? 'active' : ''}`}
            style={{
              minWidth: '40px',
              minHeight: '40px',
              padding: '0',
              flexShrink: 0
            }}
          >
            <Compass size={17} strokeWidth={2.2} className={gpsLoading ? 'animate-spin' : ''} />
          </button>

        </div>

        {/* Compact Utility Icons Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          backgroundColor: 'var(--bg-muted)',
          padding: '3px',
          borderRadius: 'var(--radius-md)',
          border: 'var(--border-thick)'
        }}>
          
          {/* Notification */}
          <button
            onClick={onRequestNotification}
            aria-label={notificationsEnabled ? t.notifyActive : t.notifyEnable}
            title={notificationsEnabled ? t.notifyActive : t.notifyEnable}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-sm)',
              border: notificationsEnabled ? '1px solid var(--color-secondary)' : 'none',
              backgroundColor: notificationsEnabled ? 'var(--color-secondary-bg)' : 'transparent',
              color: notificationsEnabled ? 'var(--color-secondary)' : 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform var(--anim-fast)'
            }}
          >
            {notificationsEnabled ? <BellRing size={15} strokeWidth={2.5} /> : <Bell size={15} strokeWidth={2.2} />}
          </button>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            aria-label={t.refresh}
            title={t.refresh}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <RefreshCw size={14} strokeWidth={2.2} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDark}
            aria-label={t.themeToggle}
            title={isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
            style={{
              height: '34px',
              padding: '0 9px',
              borderRadius: 'var(--radius-sm)',
              border: isDark ? '1px solid var(--color-accent)' : '1px solid var(--color-primary)',
              backgroundColor: isDark ? 'var(--color-accent-bg)' : 'var(--color-primary-bg)',
              color: isDark ? 'var(--color-accent)' : 'var(--color-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.725rem',
              fontWeight: '800'
            }}
          >
            {isDark ? (
              <>
                <Sun size={14} strokeWidth={2.5} />
                <span>{t.lightMode || 'Terang'}</span>
              </>
            ) : (
              <>
                <Moon size={14} strokeWidth={2.5} />
                <span>{t.darkMode || 'Gelap'}</span>
              </>
            )}
          </button>

        </div>

      </div>

    </header>
  );
}
