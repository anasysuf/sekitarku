/**
 * Layanan data gempa bumi BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)
 */
export async function fetchLatestEarthquake() {
  try {
    const res = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json');
    if (!res.ok) throw new Error(`BMKG Error: ${res.status}`);
    const data = await res.json();
    const gempa = data?.Infogempa?.gempa;
    if (!gempa) return null;

    const [latStr, lonStr] = gempa.Coordinates ? gempa.Coordinates.split(',') : [0, 0];
    return {
      date: gempa.Tanggal,
      time: gempa.Jam,
      dateTime: `${gempa.Tanggal} ${gempa.Jam}`,
      lat: parseFloat(latStr),
      lon: parseFloat(lonStr),
      magnitude: parseFloat(gempa.Magnitude),
      depth: gempa.Kedalaman,
      wilayah: gempa.Wilayah,
      potensi: gempa.Potensi,
      dirasakan: gempa.Dirasakan,
      shakemap: gempa.Shakemap ? `https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}` : null
    };
  } catch (error) {
    console.warn('Gagal memuat gempa terkini BMKG:', error);
    return null;
  }
}

export async function fetchRecentEarthquakes() {
  try {
    const res = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json');
    if (!res.ok) throw new Error(`BMKG Error: ${res.status}`);
    const data = await res.json();
    const list = data?.Infogempa?.gempa || [];
    
    return list.map((g, idx) => {
      const [latStr, lonStr] = g.Coordinates ? g.Coordinates.split(',') : [0, 0];
      return {
        id: `quake-${idx}-${g.Tanggal}-${g.Jam}`,
        date: g.Tanggal,
        time: g.Jam,
        dateTime: `${g.Tanggal} ${g.Jam}`,
        lat: parseFloat(latStr),
        lon: parseFloat(lonStr),
        magnitude: parseFloat(g.Magnitude),
        depth: g.Kedalaman,
        wilayah: g.Wilayah,
        potensi: g.Potensi
      };
    });
  } catch (error) {
    console.warn('Gagal memuat daftar gempa BMKG:', error);
    return [];
  }
}
