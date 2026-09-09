import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters with smart fallbacks
    const city = searchParams.get('city') || 'Nusantara';
    const province = searchParams.get('province') || 'Indonesia';
    const aqi = searchParams.get('aqi') || '42';
    const aqiStatus = searchParams.get('status') || 'Baik';
    const temp = searchParams.get('temp') || '30';
    const weather = searchParams.get('weather') || 'Cerah Berawan';
    const quake = searchParams.get('quake') || 'M 4.9 (BMKG)';

    // Dynamic AQI badge color
    const aqiNum = parseInt(aqi, 10) || 0;
    let aqiBg = '#10b981'; // Good (Green)
    let aqiTextColor = '#ffffff';

    if (aqiNum > 300) {
      aqiBg = '#881337'; // Hazardous
    } else if (aqiNum > 200) {
      aqiBg = '#a855f7'; // Very Unhealthy
    } else if (aqiNum > 150) {
      aqiBg = '#ef4444'; // Unhealthy
    } else if (aqiNum > 100) {
      aqiBg = '#f97316'; // Sensitive
    } else if (aqiNum > 50) {
      aqiBg = '#eab308'; // Moderate
      aqiTextColor = '#000000';
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#0b1120',
            backgroundImage:
              'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(16, 185, 129, 0.1) 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            padding: '48px 56px',
            fontFamily: 'sans-serif',
            color: '#ffffff',
          }}
        >
          {/* Top Bar: Brand + Live Badge */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {/* Logo + Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '24px',
                  fontWeight: 'bold',
                }}
              >
                🌿
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-0.5px' }}>
                  Sekitarku
                </span>
                <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '600' }}>
                  Dashboard Pantauan Lingkungan Real-Time
                </span>
              </div>
            </div>

            {/* Live Indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '999px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
              }}
            >
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                }}
              />
              <span style={{ fontSize: '15px', fontWeight: '700', color: '#10b981' }}>
                LIVE DATA
              </span>
            </div>
          </div>

          {/* Center: City & Metrics Grid */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '32px',
              margin: '20px 0',
            }}
          >
            {/* Left: City Info */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span
                style={{
                  fontSize: '18px',
                  color: '#10b981',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '4px',
                }}
              >
                📍 {province}
              </span>
              <span
                style={{
                  fontSize: '56px',
                  fontWeight: '900',
                  color: '#ffffff',
                  letterSpacing: '-1.5px',
                  lineHeight: '1.1',
                }}
              >
                {city}
              </span>
              <p
                style={{
                  fontSize: '18px',
                  color: '#94a3b8',
                  marginTop: '8px',
                  fontWeight: '500',
                }}
              >
                Pantau AQI, BMKG, Seismik Gempa & Gunung Api PVMBG
              </p>
            </div>

            {/* Right: Metrics Cards */}
            <div style={{ display: 'flex', gap: '16px' }}>
              {/* AQI Metric Card */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '20px 24px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  minWidth: '210px',
                }}
              >
                <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '700' }}>
                  KUALITAS UDARA
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '6px 0' }}>
                  <span style={{ fontSize: '48px', fontWeight: '900', color: aqiBg }}>
                    {aqi}
                  </span>
                  <span style={{ fontSize: '16px', color: '#64748b', fontWeight: '700' }}>AQI</span>
                </div>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    backgroundColor: aqiBg,
                    color: aqiTextColor,
                    fontSize: '13px',
                    fontWeight: '800',
                    textAlign: 'center',
                  }}
                >
                  {aqiStatus}
                </span>
              </div>

              {/* Weather Metric Card */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '20px 24px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  minWidth: '210px',
                }}
              >
                <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '700' }}>
                  CUACA BMKG
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '6px 0' }}>
                  <span style={{ fontSize: '48px', fontWeight: '900', color: '#38bdf8' }}>
                    {temp}°
                  </span>
                  <span style={{ fontSize: '20px', color: '#64748b', fontWeight: '700' }}>C</span>
                </div>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    fontSize: '13px',
                    fontWeight: '800',
                    textAlign: 'center',
                  }}
                >
                  {weather}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Earthquake alert + Website URL */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>🔴</span>
              <span style={{ fontSize: '15px', color: '#f87171', fontWeight: '700' }}>
                Auto-Gempa: {quake}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px', color: '#ffffff', fontWeight: '800' }}>
                sekitarku.vercel.app
              </span>
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                • 500+ Kota Terhubung
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    return new Response('Failed to generate OG image', { status: 500 });
  }
}
