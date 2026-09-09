export const config = {
  runtime: 'edge',
};

export default function handler(request) {
  const { searchParams } = new URL(request.url);

  const city = searchParams.get('city') || 'Nusantara';
  const aqi = searchParams.get('aqi') || '42';
  const aqiStatus = searchParams.get('status') || 'Baik';
  const temp = searchParams.get('temp') || '30';

  const aqiNum = parseInt(aqi, 10) || 0;
  let aqiColor = '#10b981'; // Green (Baik)
  let statusTextColor = '#ffffff';

  if (aqiNum > 300) {
    aqiColor = '#881337'; // Hazardous
  } else if (aqiNum > 200) {
    aqiColor = '#a855f7'; // Very Unhealthy
  } else if (aqiNum > 150) {
    aqiColor = '#ef4444'; // Unhealthy
  } else if (aqiNum > 100) {
    aqiColor = '#f97316'; // Sensitive
  } else if (aqiNum > 50) {
    aqiColor = '#d97706'; // Moderate
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="310" height="32" viewBox="0 0 310 32" fill="none">
  <defs>
    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="100%" stop-color="#047857" />
    </linearGradient>
    <clipPath id="pillClip">
      <rect width="310" height="32" rx="6" />
    </clipPath>
  </defs>
  
  <g clip-path="url(#pillClip)">
    <!-- Brand Left -->
    <rect x="0" y="0" width="85" height="32" fill="url(#brandGrad)" />
    <text x="10" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#ffffff">🌿 Sekitarku</text>
    
    <!-- City Middle -->
    <rect x="85" y="0" width="115" height="32" fill="#1e293b" />
    <text x="95" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#f8fafc">${city} (${temp}°C)</text>
    
    <!-- AQI Right -->
    <rect x="200" y="0" width="110" height="32" fill="${aqiColor}" />
    <text x="210" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" fill="${statusTextColor}">AQI ${aqi} • ${aqiStatus}</text>
  </g>
  
  <rect x="0.5" y="0.5" width="309" height="31" rx="5.5" stroke="rgba(255,255,255,0.15)" fill="none" />
</svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
