export const config = {
  runtime: 'edge',
};

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .slice(0, 50); // ponytail: max 50 chars to prevent DoS
}

export default function handler(request) {
  const { searchParams } = new URL(request.url);

  const rawCity = searchParams.get('city') || 'Nusantara';
  const rawAqi = searchParams.get('aqi') || '42';
  const rawStatus = searchParams.get('status') || 'Baik';
  const rawTemp = searchParams.get('temp') || '30';

  const city = escapeXml(rawCity);
  const aqiNum = Math.min(Math.max(parseInt(rawAqi, 10) || 0, 0), 999);
  const aqiStatus = escapeXml(rawStatus);
  const temp = Math.min(Math.max(parseInt(rawTemp, 10) || 0, -50), 60);

  let aqiColor = '#10b981'; // Baik
  if (aqiNum > 300) aqiColor = '#881337'; // Berbahaya
  else if (aqiNum > 200) aqiColor = '#a855f7'; // Sangat Tidak Sehat
  else if (aqiNum > 150) aqiColor = '#ef4444'; // Tidak Sehat
  else if (aqiNum > 100) aqiColor = '#f97316'; // Sensitif
  else if (aqiNum > 50) aqiColor = '#d97706'; // Sedang

  // Hitung lebar dinamis tiap segmen badge
  const brandText = '🌿 Sekitarku';
  const cityText = `${city} (${temp}°C)`;
  const statusText = `AQI ${aqiNum} • ${aqiStatus}`;

  const wBrand = 88;
  const wCity = Math.max(90, Math.round(cityText.length * 7.2) + 20);
  const wStatus = Math.max(105, Math.round(statusText.length * 7.2) + 20);
  const totalWidth = wBrand + wCity + wStatus;

  const xCity = wBrand;
  const xStatus = wBrand + wCity;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="32" viewBox="0 0 ${totalWidth} 32" fill="none">
  <defs>
    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="100%" stop-color="#047857" />
    </linearGradient>
    <clipPath id="pillClip">
      <rect width="${totalWidth}" height="32" rx="6" />
    </clipPath>
  </defs>
  
  <g clip-path="url(#pillClip)">
    <rect x="0" y="0" width="${wBrand}" height="32" fill="url(#brandGrad)" />
    <text x="10" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#ffffff">${brandText}</text>
    
    <rect x="${xCity}" y="0" width="${wCity}" height="32" fill="#1e293b" />
    <text x="${xCity + 10}" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#f8fafc">${cityText}</text>
    
    <rect x="${xStatus}" y="0" width="${wStatus}" height="32" fill="${aqiColor}" />
    <text x="${xStatus + 10}" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" fill="#ffffff">${statusText}</text>
  </g>
  
  <rect x="0.5" y="0.5" width="${totalWidth - 1}" height="31" rx="5.5" stroke="rgba(255,255,255,0.15)" fill="none" />
</svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=120, s-maxage=600, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
