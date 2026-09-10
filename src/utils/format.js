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

export function formatFullCurrentDate(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const dayName = days[d.getDay()];
  const dayNum = d.getDate();
  const monthName = months[d.getMonth()];
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');

  return `${dayName}, ${dayNum} ${monthName} ${year} • ${hours}.${minutes} WIB`;
}

export function formatShortDate(dateStr) {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    }).format(date);
  } catch (e) {
    return dateStr;
  }
}
