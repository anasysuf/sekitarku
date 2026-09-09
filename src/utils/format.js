export function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  } catch (e) {
    return dateStr;
  }
}

export function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMin = Math.round((now - date) / 60000);
    if (diffMin < 1) return 'Baru saja';
    if (diffMin < 60) return `${diffMin} menit yang lalu`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    return formatDateTime(dateStr);
  } catch (e) {
    return dateStr;
  }
}

export function formatFullCurrentDate(date = new Date(), lang = 'id') {
  try {
    const locale = lang === 'en' ? 'en-US' : 'id-ID';
    const dayStr = new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
    const timeStr = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
    return `${dayStr} • ${timeStr} WIB`;
  } catch (e) {
    return date.toLocaleString();
  }
}

export function formatShortDate(dateStr, lang = 'id') {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const locale = lang === 'en' ? 'en-US' : 'id-ID';
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short'
    }).format(d);
  } catch (e) {
    return dateStr;
  }
}

export function formatWeatherCode(code) {
  const codes = {
    0: { label: 'Cerah', icon: 'Sun' },
    1: { label: 'Cerah Berawan', icon: 'SunMedium' },
    2: { label: 'Sebagian Berawan', icon: 'CloudSun' },
    3: { label: 'Berawan Mendung', icon: 'Cloud' },
    45: { label: 'Berkabut', icon: 'CloudFog' },
    48: { label: 'Kabut Tebal', icon: 'CloudFog' },
    51: { label: 'Gerimis', icon: 'CloudDrizzle' },
    53: { label: 'Gerimis Sedang', icon: 'CloudDrizzle' },
    55: { label: 'Gerimis Lebat', icon: 'CloudDrizzle' },
    61: { label: 'Hujan Ringan', icon: 'CloudRain' },
    63: { label: 'Hujan Sedang', icon: 'CloudRain' },
    65: { label: 'Hujan Lebat', icon: 'CloudRainWind' },
    80: { label: 'Hujan Lokal Ringan', icon: 'CloudRain' },
    81: { label: 'Hujan Lokal Sedang', icon: 'CloudRain' },
    82: { label: 'Hujan Lokal Lebat', icon: 'CloudRainWind' },
    95: { label: 'Badai Petir', icon: 'CloudLightning' },
    96: { label: 'Badai Petir Ringan', icon: 'CloudLightning' },
    99: { label: 'Badai Petir Kuat', icon: 'CloudLightning' }
  };
  return codes[code] || { label: 'Berawan', icon: 'Cloud' };
}
