import React from 'react';
import { Sun, Moon, MapPin, RefreshCw, Compass, Bell, BellRing, Globe, Search } from 'lucide-react';
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
  onRequestNotification
}) {
  const t = translations[lang] || translations.id;

  return (
    <header style={{ marginBottom: '2rem' }}>
      <div className="header-wrapper">
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--accent-brand-bg)',
            border: '1px solid var(--accent-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-brand)',
            flexShrink: 0
          }}>
            <Compass size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.025em', margin: 0, color: 'var(--text-primary)' }}>
                {t.appTitle}
              </h1>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: '700',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: 'var(--accent-brand-bg)',
                color: 'var(--accent-brand)',
                border: '1px solid var(--accent-brand)'
              }}>
                {t.liveBadge}
              </span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="header-controls">
          
          {/* City Search Button */}
          <button
            onClick={onOpenSearch}
            className="city-select-container"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: '44px',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              textAlign: 'left',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
              <MapPin size={16} color="var(--accent-brand)" style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {location.name}
                </span>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {location.province}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.75rem', backgroundColor: 'var(--bg-primary)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
              <Search size={13} />
              <span>{t.searchCity}</span>
            </div>
          </button>

          {/* GPS */}
          <button
            onClick={onGpsClick}
            disabled={gpsLoading}
            aria-label={t.gps}
            title={t.gps}
            className={`btn-icon ${location.isGps ? 'active' : ''}`}
          >
            <Compass size={16} className={gpsLoading ? 'animate-spin' : ''} />
            <span>GPS</span>
          </button>

          {/* Notification */}
          <button
            onClick={onRequestNotification}
            aria-label={notificationsEnabled ? t.notifyActive : t.notifyEnable}
            title={notificationsEnabled ? t.notifyActive : t.notifyEnable}
            className={`btn-icon ${notificationsEnabled ? 'active' : ''}`}
          >
            {notificationsEnabled ? <BellRing size={16} color="var(--accent-brand)" /> : <Bell size={16} />}
          </button>

          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            aria-label={t.langToggle}
            title="Ganti Bahasa (ID / EN)"
            className="btn-icon"
          >
            <Globe size={15} />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            aria-label={t.refresh}
            title={t.refresh}
            className="btn-icon"
          >
            <RefreshCw size={16} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDark}
            aria-label={t.themeToggle}
            title={t.themeToggle}
            className="btn-icon"
          >
            {isDark ? <Sun size={16} color="#d29922" /> : <Moon size={16} color="#58a6ff" />}
          </button>

        </div>

      </div>
    </header>
  );
}
