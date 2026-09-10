import React from 'react';
import { Sun, Moon, MapPin, RefreshCw, Compass, Bell, BellRing, Search, Calendar, Share2, ShieldAlert } from 'lucide-react';
import { formatFullCurrentDate } from '../../utils/format';
import { i18n } from '../../utils/i18n';

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
    <header style={{ marginBottom: '1.75rem' }}>
      
      {/* Top Bar: Brand & Primary Action Badges */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        
        {/* Brand & Subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
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
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: '900', letterSpacing: '-0.03em', margin: 0, color: 'var(--text-main)' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                {t.appSubtitle}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>•</span>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.75rem',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={onOpenShare}
            aria-label="Bagikan Laporan"
            className="flat-btn-secondary"
            style={{
              padding: '0.5rem 0.95rem',
              minHeight: '38px',
              color: 'var(--color-primary)',
              borderColor: 'var(--color-primary)',
              backgroundColor: 'var(--color-primary-bg)',
              fontWeight: '700'
            }}
          >
            <Share2 size={16} strokeWidth={2.5} />
            <span>{t.share || 'Bagikan'}</span>
          </button>

          <button
            onClick={onOpenEmergency}
            aria-label="Kontak Darurat & Tanggap Bencana"
            className="flat-btn-secondary"
            style={{
              padding: '0.5rem 0.95rem',
              minHeight: '38px',
              color: 'var(--color-danger)',
              borderColor: 'var(--color-danger)',
              backgroundColor: 'var(--color-danger-bg)',
              fontWeight: '700'
            }}
          >
            <ShieldAlert size={16} strokeWidth={2.5} />
            <span>{t.emergency || 'Darurat 112'}</span>
          </button>
        </div>

      </div>

      {/* Bottom Bar: Search & Compact Utility Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginTop: '1rem'
      }}>
        
        {/* City Search Bar with integrated GPS trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 280px', minWidth: 0 }}>
          
          <button
            onClick={onOpenSearch}
            className="flat-btn-secondary"
            style={{
              flex: 1,
              justifyContent: 'space-between',
              padding: '0.6rem 0.9rem',
              minHeight: '40px',
              backgroundColor: 'var(--bg-card)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
              <MapPin size={16} color="var(--color-secondary)" style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0, textAlign: 'left' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {displayName}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {displayProvince}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.725rem', backgroundColor: 'var(--bg-muted)', padding: '2px 7px', borderRadius: 'var(--radius-sm)', border: 'var(--border-thick)' }}>
              <Search size={12} />
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
          gap: '0.4rem',
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
              width: '36px',
              height: '36px',
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
            {notificationsEnabled ? <BellRing size={16} strokeWidth={2.5} /> : <Bell size={16} strokeWidth={2.2} />}
          </button>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            aria-label={t.refresh}
            title={t.refresh}
            style={{
              width: '36px',
              height: '36px',
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
            <RefreshCw size={15} strokeWidth={2.2} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDark}
            aria-label={t.themeToggle}
            title={isDark ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
            style={{
              height: '36px',
              padding: '0 10px',
              borderRadius: 'var(--radius-sm)',
              border: isDark ? '1px solid var(--color-accent)' : '1px solid var(--color-primary)',
              backgroundColor: isDark ? 'var(--color-accent-bg)' : 'var(--color-primary-bg)',
              color: isDark ? 'var(--color-accent)' : 'var(--color-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              fontWeight: '800'
            }}
          >
            {isDark ? (
              <>
                <Sun size={15} strokeWidth={2.5} />
                <span>Terang</span>
              </>
            ) : (
              <>
                <Moon size={15} strokeWidth={2.5} />
                <span>Gelap</span>
              </>
            )}
          </button>

        </div>

      </div>

    </header>
  );
}
