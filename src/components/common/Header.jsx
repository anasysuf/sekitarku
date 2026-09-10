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
      {/* Top Section: Brand & Primary Action Buttons */}
      <div className="header-top-row">
        {/* Brand Information */}
        <div className="header-brand-box">
          <div className="header-logo-icon">
            <Compass size={24} strokeWidth={2.5} />
          </div>
          <div className="header-brand-text">
            <div className="header-title-wrap">
              <h1 className="header-title">{t.appName}</h1>
              <span className="header-live-badge">{t.liveBadge}</span>
            </div>
            <div className="header-subtitle-wrap">
              <span className="header-subtitle">{t.appSubtitle}</span>
              <span className="header-dot-sep">•</span>
              <div className="header-date-badge">
                <Calendar size={12} strokeWidth={2.5} />
                <span>{formatFullCurrentDate(lastUpdated)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Actions: Bagikan & Darurat 112 */}
        <div className="header-action-buttons">
          <button
            onClick={onOpenShare}
            aria-label="Bagikan Laporan"
            className="flat-btn-secondary header-action-btn header-share-btn"
          >
            <Share2 size={16} strokeWidth={2.5} />
            <span>{t.share || 'Bagikan'}</span>
          </button>

          <button
            onClick={onOpenEmergency}
            aria-label="Kontak Darurat & Tanggap Bencana"
            className="flat-btn-secondary header-action-btn header-emergency-btn"
          >
            <ShieldAlert size={16} strokeWidth={2.5} />
            <span>{t.emergency || 'Darurat 112'}</span>
          </button>
        </div>
      </div>

      {/* Bottom Section: City Search & Unified Toolbar */}
      <div className="header-bottom-row">
        {/* City Search Button */}
        <div className="header-search-container">
          <button
            onClick={onOpenSearch}
            className="flat-btn-secondary header-search-btn"
            aria-label="Cari Kota atau Lokasi"
          >
            <div className="header-search-left">
              <MapPin size={17} color="var(--color-secondary)" className="header-pin-icon" />
              <div className="header-city-details">
                <span className="header-city-name">{displayName}</span>
                <span className="header-province-name">{displayProvince}</span>
              </div>
            </div>
            <div className="header-search-pill">
              <Search size={12} />
              <span>{t.searchCity}</span>
            </div>
          </button>
        </div>

        {/* Unified Utility Toolbar (GPS, Notification, Refresh, Dark Mode) */}
        <div className="header-utility-toolbar">
          {/* GPS Location Trigger */}
          <button
            onClick={onGpsClick}
            disabled={gpsLoading}
            aria-label={t.gps}
            title={t.gps}
            className={`header-tool-btn ${location?.isGps ? 'active' : ''}`}
          >
            <Compass size={16} strokeWidth={2.2} className={gpsLoading ? 'animate-spin' : ''} />
            <span className="header-tool-label">GPS</span>
          </button>

          {/* Notifications */}
          <button
            onClick={onRequestNotification}
            aria-label={notificationsEnabled ? t.notifyActive : t.notifyEnable}
            title={notificationsEnabled ? t.notifyActive : t.notifyEnable}
            className={`header-tool-btn ${notificationsEnabled ? 'active-notify' : ''}`}
          >
            {notificationsEnabled ? <BellRing size={16} strokeWidth={2.5} /> : <Bell size={16} strokeWidth={2.2} />}
          </button>

          {/* Manual Refresh */}
          <button
            onClick={onRefresh}
            aria-label={t.refresh}
            title={t.refresh}
            className="header-tool-btn"
          >
            <RefreshCw size={15} strokeWidth={2.2} />
          </button>

          {/* Dark/Light Mode Switcher */}
          <button
            onClick={onToggleDark}
            aria-label={t.themeToggle}
            title={isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
            className="header-tool-btn header-theme-btn"
          >
            {isDark ? (
              <>
                <Sun size={15} strokeWidth={2.5} />
                <span>{t.lightMode || 'Terang'}</span>
              </>
            ) : (
              <>
                <Moon size={15} strokeWidth={2.5} />
                <span>{t.darkMode || 'Gelap'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
