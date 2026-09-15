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
  const offset = d.getTimezoneOffset();
  const tzName = offset === -420 ? 'WIB' : offset === -480 ? 'WITA' : offset === -540 ? 'WIT' : 'WIB';

  return `${dayName}, ${dayNum} ${monthName} ${year} • ${hours}.${minutes} ${tzName}`;
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
  } catch {
    return dateStr;
  }
}
