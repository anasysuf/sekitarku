import React, { useState } from 'react';
import { ShieldAlert, PhoneCall, Wind, Waves, X, Activity } from 'lucide-react';

const EMERGENCY_CONTACTS = [
  {
    number: '112',
    name: 'Panggilan Darurat Nasional',
    desc: 'Layanan Terpadu Bebas Pulsa (Polisi, Ambulans, Damkar, Bencana)',
    color: '#ef4444',
    bg: '#fef2f2'
  },
  {
    number: '115',
    name: 'BASARNAS',
    desc: 'Badan Nasional Pencarian & Pertolongan Bencana / Evakuasi',
    color: '#f97316',
    bg: '#fff7ed'
  },
  {
    number: '119',
    name: 'Ambulans & Kemenkes (PSC 119)',
    desc: 'Layanan Gawat Darurat Medis & Ambulans Rumah Sakit',
    color: '#10b981',
    bg: '#ecfdf5'
  },
  {
    number: '113',
    name: 'Pemadam Kebakaran (Damkar)',
    desc: 'Kebakaran, Penyelamatan Runtuhan, & Penanganan Bahaya',
    color: '#dc2626',
    bg: '#fef2f2'
  },
  {
    number: '110',
    name: 'Kepolisian RI',
    desc: 'Layanan Keamanan & Ketertiban Masyarakat',
    color: '#3b82f6',
    bg: '#eff6ff'
  },
  {
    number: '123',
    name: 'PLN Gangguan Listrik',
    desc: 'Lapor Kabel Terputus, Korsleting, & Pemadaman Pascabencana',
    color: '#f59e0b',
    bg: '#fffbeb'
  }
];

export function EmergencyGuideModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('kontak');

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        className="flat-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '640px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-card)',
          border: 'var(--border-thick)',
          overflow: 'hidden',
          padding: 0
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: 'var(--border-thick)', backgroundColor: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-danger)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldAlert size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                Tanggap Bencana & Kontak Darurat
              </h3>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', margin: 0, fontWeight: '600' }}>
                Panduan Kesiapsiagaan & Hotline Bencana Resmi Indonesia
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="flat-btn-secondary"
            style={{ minHeight: '32px', padding: '4px 8px' }}
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Tab Navigation with Clean Vector Icons */}
        <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem 1.25rem', borderBottom: 'var(--border-thick)', backgroundColor: 'var(--bg-muted)', overflowX: 'auto', scrollbarWidth: 'none' }}>
          
          <button
            onClick={() => setActiveTab('kontak')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1rem',
              minHeight: '38px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.825rem',
              fontWeight: '800',
              cursor: 'pointer',
              border: activeTab === 'kontak' ? '2px solid var(--color-danger)' : 'var(--border-thick)',
              backgroundColor: activeTab === 'kontak' ? 'var(--color-danger)' : 'var(--bg-card)',
              color: activeTab === 'kontak' ? '#ffffff' : 'var(--text-main)',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            <PhoneCall size={15} strokeWidth={2.5} />
            <span>Kontak Darurat</span>
          </button>

          <button
            onClick={() => setActiveTab('gempa')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1rem',
              minHeight: '38px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.825rem',
              fontWeight: '800',
              cursor: 'pointer',
              border: activeTab === 'gempa' ? '2px solid var(--color-accent)' : 'var(--border-thick)',
              backgroundColor: activeTab === 'gempa' ? 'var(--color-accent)' : 'var(--bg-card)',
              color: activeTab === 'gempa' ? '#ffffff' : 'var(--text-main)',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            <Activity size={15} strokeWidth={2.5} />
            <span>Mitigasi Gempa</span>
          </button>

          <button
            onClick={() => setActiveTab('polusi')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1rem',
              minHeight: '38px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.825rem',
              fontWeight: '800',
              cursor: 'pointer',
              border: activeTab === 'polusi' ? '2px solid var(--color-secondary)' : 'var(--border-thick)',
              backgroundColor: activeTab === 'polusi' ? 'var(--color-secondary)' : 'var(--bg-card)',
              color: activeTab === 'polusi' ? '#ffffff' : 'var(--text-main)',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            <Wind size={15} strokeWidth={2.5} />
            <span>Polusi Udara</span>
          </button>

          <button
            onClick={() => setActiveTab('tsunami')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1rem',
              minHeight: '38px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.825rem',
              fontWeight: '800',
              cursor: 'pointer',
              border: activeTab === 'tsunami' ? '2px solid var(--color-primary)' : 'var(--border-thick)',
              backgroundColor: activeTab === 'tsunami' ? 'var(--color-primary)' : 'var(--bg-card)',
              color: activeTab === 'tsunami' ? '#ffffff' : 'var(--text-main)',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            <Waves size={15} strokeWidth={2.5} />
            <span>Tsunami & UV</span>
          </button>

        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', backgroundColor: 'var(--bg-card)' }}>
          
          {/* TAB 1: KONTAK DARURAT */}
          {activeTab === 'kontak' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.65rem' }}>
              <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-danger-bg)', border: '1px solid var(--color-danger)', fontSize: '0.8rem', color: 'var(--color-danger)', fontWeight: '700' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={13} style={{ flexShrink: 0 }} /> Panggilan 112 dapat dihubungi dari semua operator seluler bebas pulsa, bahkan saat ponsel terkunci.</span>
              </div>

              {EMERGENCY_CONTACTS.map((c) => (
                <div
                  key={c.number}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-muted)',
                    border: 'var(--border-thick)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: c.color,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      fontWeight: '800'
                    }}>
                      {c.number}
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)', display: 'block' }}>
                        {c.name}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                        {c.desc}
                      </span>
                    </div>
                  </div>

                  <a
                    href={`tel:${c.number}`}
                    className="flat-btn-primary"
                    style={{
                      minHeight: '36px',
                      padding: '0 0.85rem',
                      fontSize: '0.8rem',
                      textDecoration: 'none',
                      backgroundColor: c.color
                    }}
                  >
                    <PhoneCall size={14} strokeWidth={2.5} /> Hubungi
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: MITIGASI GEMPA */}
          {activeTab === 'gempa' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-muted)', border: 'var(--border-thick)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-accent)', marginBottom: '0.5rem' }}>
                  1. Saat Guncangan Terjadi (DROP, COVER, HOLD ON)
                </h4>
                <ul style={{ fontSize: '0.85rem', color: 'var(--text-main)', paddingLeft: '1.25rem', lineHeight: 1.6, fontWeight: '500' }}>
                  <li><strong>Merunduk (Drop)</strong> ke lantai sebelum guncangan merobohkan keseimbangan Anda.</li>
                  <li><strong>Lindungi Kepala (Cover)</strong> di bawah meja yang kokoh atau lindungi kepala dengan tas/bantal/lengan.</li>
                  <li><strong>Bertahan (Hold On)</strong> pegang kaki meja hingga guncangan benar-benar reda.</li>
                  <li>Jauhi kaca jendela, cermin, lemari tinggi, dan benda yang berisiko jatuh.</li>
                </ul>
              </div>

              <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-muted)', border: 'var(--border-thick)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-danger)', marginBottom: '0.5rem' }}>
                  2. Jika Berada di Gedung Bertingkat
                </h4>
                <ul style={{ fontSize: '0.85rem', color: 'var(--text-main)', paddingLeft: '1.25rem', lineHeight: 1.6, fontWeight: '500' }}>
                  <li><strong>JANGAN gunakan lift / elevator</strong>. Selalu gunakan tangga darurat.</li>
                  <li>Jangan panik berebut keluar pintu secara bersamaan untuk mencegah penumpukan massa.</li>
                </ul>
              </div>

              <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-muted)', border: 'var(--border-thick)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>
                  3. Pasca Guncangan Mereda
                </h4>
                <ul style={{ fontSize: '0.85rem', color: 'var(--text-main)', paddingLeft: '1.25rem', lineHeight: 1.6, fontWeight: '500' }}>
                  <li>Segera matikan kompor gas dan saklar listrik utama untuk mencegah kebakaran.</li>
                  <li>Evakuasi ke titik kumpul terbuka yang jauh dari tiang listrik, baliho, dan tembok retak.</li>
                  <li>Pantau pembaruan gempa susulan resmi BMKG di aplikasi Sekitarku.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: POLUSI UDARA */}
          {activeTab === 'polusi' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-muted)', border: 'var(--border-thick)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-danger)', marginBottom: '0.5rem' }}>
                  Saat Kualitas Udara Tidak Sehat (AQI &gt; 150)
                </h4>
                <ul style={{ fontSize: '0.85rem', color: 'var(--text-main)', paddingLeft: '1.25rem', lineHeight: 1.6, fontWeight: '500' }}>
                  <li><strong>Wajib Masker Respirator</strong>: Gunakan masker standar N95, KN95, atau KF94 saat keluar ruangan. Masker kain tipis tidak mampu menyaring partikel mikro PM2.5.</li>
                  <li><strong>Tutup Jendela & Ventilasi</strong>: Cegah masuknya polusi luar ruangan ke dalam kamar dan ruang keluarga.</li>
                  <li><strong>Gunakan Pembersih Udara</strong>: Nyalakan HEPA Air Purifier jika tersedia di dalam ruangan.</li>
                  <li><strong>Batasi Aktivitas Berat</strong>: Hindari jogging atau bersepeda di pinggir jalan raya utama pada jam sibuk.</li>
                  <li><strong>Lindungi Anak & Lansia</strong>: Kelompok rentan pernapasan/asma sebaiknya tetap berada di dalam ruangan.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: TSUNAMI & UV */}
          {activeTab === 'tsunami' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-muted)', border: 'var(--border-thick)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                  Mitigasi Ancaman Tsunami (Pedoman BMKG)
                </h4>
                <ul style={{ fontSize: '0.85rem', color: 'var(--text-main)', paddingLeft: '1.25rem', lineHeight: 1.6, fontWeight: '500' }}>
                  <li><strong>Metode 20-20-20</strong>: Jika merasakan gempa selama lebih dari <strong>20 detik</strong> di wilayah pantai, Anda memiliki waktu sekitar <strong>20 menit</strong> untuk evakuasi ke ketinggian minimal <strong>20 meter</strong>.</li>
                  <li>Jika air laut surut secara tiba-tiba setelah gempa, <strong>SEGERA lari menjauhi pantai</strong> menuju perbukitan atau gedung tinggi evakuasi.</li>
                </ul>
              </div>

              <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-muted)', border: 'var(--border-thick)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-accent)', marginBottom: '0.5rem' }}>
                  Perlindungan Radiasi UV Ekstrem (UV 8+)
                </h4>
                <ul style={{ fontSize: '0.85rem', color: 'var(--text-main)', paddingLeft: '1.25rem', lineHeight: 1.6, fontWeight: '500' }}>
                  <li>Gunakan tabir surya (*Sunscreen SPF 30+*) setiap 2 jam saat terpapar sinar matahari.</li>
                  <li>Gunakan topi bertepi lebar, pakaian lengan panjang, dan kacamata anti-UV.</li>
                  <li>Hindari paparan sinar langsung di jam puncak (10.00 – 15.00 WIB).</li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{ padding: '0.85rem 1.5rem', borderTop: 'var(--border-thick)', backgroundColor: 'var(--bg-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>
          <span>Pedoman Resmi BNPB, BMKG & Kemenkes RI</span>
          <span>Bebas Pulsa 112</span>
        </div>
      </div>
    </div>
  );
}
