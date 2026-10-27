import React, { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams, Navigate } from 'react-router-dom';
import { ArrowRight, Menu, X, ChevronDown, ShieldCheck, GraduationCap, Globe2, Users, ClipboardCheck, CheckCircle2, Clock3, MapPin, Phone, Mail, ChevronRight, BookOpen, HeartHandshake, BriefcaseBusiness, Search, LogIn, LayoutDashboard, FileText, LogOut, Save, AlertCircle } from 'lucide-react';
import { adminLogin, adminLogout, isAdminSession, fetchStats, fetchRegistrations, updateStatus, exportRegistrationsCsv, PAGE_SIZE } from './services/supabase.js';
import { fetchNews, createNews, deleteNews } from './services/admin.js';
import { programs, countries, faqs, navGroups } from './utils/content.js';

const asset = { logo: null };
function Brand({light=false}) { return <Link to="/" className={`brand ${light?'brand-light':''}`} aria-label="LPK Bulan Berkah Senyum beranda"><span className="brand-mark">B<span>.</span></span><span className="brand-copy"><b>BULAN BERKAH SENYUM</b><small>LEMBAGA PELATIHAN KERJA</small></span></Link>; }
function Header() {
 const [mobile,setMobile]=useState(false); const [drop,setDrop]=useState(''); const location=useLocation();
 useEffect(()=>{setMobile(false);setDrop('');},[location.pathname]);
 return <header className="site-header"><div className="container nav-wrap"><Brand/><nav className={`main-nav ${mobile?'nav-open':''}`} aria-label="Navigasi utama"><Link className="mobile-home" to="/">Beranda</Link>{navGroups.map(g=><div className="nav-group" key={g.label} onMouseEnter={()=>setDrop(g.label)} onMouseLeave={()=>setDrop('')}><button className={`nav-trigger ${location.pathname===g.to||location.pathname.startsWith(g.to+'/')?'nav-active':''}`} onClick={()=>setDrop(drop===g.label?'':g.label)} aria-expanded={drop===g.label}>{g.label}<ChevronDown size={14}/></button>{drop===g.label&&<div className="nav-dropdown">{g.items.map(([label,to])=><Link key={to} to={to}>{label}<ChevronRight size={14}/></Link>)}</div>}</div>)}<Link className="nav-apply" to="/pendaftaran">Pendaftaran <ArrowRight size={16}/></Link></nav><button className="mobile-toggle" onClick={()=>setMobile(!mobile)} aria-label={mobile?'Tutup menu':'Buka menu'}>{mobile?<X/>:<Menu/>}</button></div></header>
}
function Footer(){return <footer className="site-footer"><div className="container footer-grid"><div className="footer-brand"><Brand light/><p>Mendukung pengembangan kompetensi melalui informasi pelatihan dan persiapan kerja yang jelas, bertanggung jawab, dan mudah diakses.</p><span className="footer-note">Informasi pada website ini perlu dikonfirmasi kepada pengelola sebelum dijadikan dasar keputusan.</span></div><div><h4>Jelajahi</h4><Link to="/profil">Profil Lembaga</Link><Link to="/lpk">Program Pelatihan</Link><Link to="/pt-mardel">Negara Tujuan</Link><Link to="/pendaftaran">Pendaftaran</Link></div><div><h4>Program</h4>{programs.map(p=><Link key={p.slug} to={`/program/${p.slug}`}>{p.name}</Link>)}</div><div><h4>Kontak</h4><p className="contact-line"><MapPin size={16}/> Alamat kantor: perlu dikonfirmasi</p><p className="contact-line"><Phone size={16}/> Nomor kontak: perlu dikonfirmasi</p><p className="contact-line"><Mail size={16}/> Email resmi: perlu dikonfirmasi</p><Link className="privacy-link" to="/kebijakan-privasi">Kebijakan Privasi</Link></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} LPK Bulan Berkah Senyum & PT. Mardel Mitra Sejahtera</span><span>Dibangun untuk akses informasi yang lebih baik.</span></div></footer>}
function Layout({children}){return <><Header/><main>{children}</main><Footer/></>}
function Eyebrow({children}){return <div className="eyebrow"><span/>{children}</div>}
function PageHero({eyebrow,title,description,image,compact=false,children}){return <section className={`page-hero ${compact?'page-hero-compact':''}`} style={image?{'--hero-image':`url(${image})`}:{}}><div className="container page-hero-content"><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1>{description&&<p>{description}</p>}{children}</div></section>}
function SectionHeading({eyebrow,title,description,center=false}){return <div className={`section-heading ${center?'text-center':''}`}><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2>{description&&<p>{description}</p>}</div>}
function ProgramCard({item}){return <article className="program-card"><Link to={`/program/${item.slug}`} className="program-image"><img src={item.image} alt={`Ilustrasi program ${item.name}`} loading="lazy"/><span className="image-chip">{item.category}</span></Link><div className="program-card-body"><div className="program-icon">{item.icon}</div><h3><Link to={`/program/${item.slug}`}>{item.name}</Link></h3><p>{item.description}</p><Link className="text-link" to={`/program/${item.slug}`}>Pelajari program <ArrowRight size={16}/></Link></div></article>}
function CountryCard({item}){return <article className="country-card"><Link to={`/negara/${item.slug}`} className="country-image"><img src={item.image} alt={`Ilustrasi ${item.name}`} loading="lazy"/><span className="country-flag">{item.flag}</span></Link><div className="country-body"><h3><Link to={`/negara/${item.slug}`}>{item.name}</Link></h3><p>{item.description}</p><Link className="text-link" to={`/negara/${item.slug}`}>Lihat informasi <ArrowRight size={16}/></Link></div></article>}
function Home(){return <Layout><section className="home-hero"><div className="hero-shape shape-one"/><div className="hero-shape shape-two"/><div className="container home-hero-grid"><div className="hero-copy"><Eyebrow>Langkah awal masa depan Anda</Eyebrow><h1>Membangun Kompetensi, <em>Membuka Peluang Masa Depan</em></h1><p>Temukan informasi program pelatihan kerja dan persiapan menuju peluang kerja dengan proses yang lebih terarah, transparan, dan bertanggung jawab.</p><div className="hero-actions"><Link to="/lpk" className="btn btn-primary">Lihat Program <ArrowRight size={17}/></Link><Link to="/pendaftaran" className="btn btn-outline">Daftar Sekarang</Link></div><div className="hero-assurance"><span><CheckCircle2 size={16}/> Informasi yang mudah diakses</span><span><CheckCircle2 size={16}/> Proses pendaftaran terarah</span></div></div><div className="hero-visual"><div className="hero-photo"><img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=90" alt="Tim berdiskusi dan belajar bersama"/><div className="photo-overlay"/></div><div className="floating-note"><span className="floating-icon"><GraduationCap size={22}/></span><div><b>Kompetensi untuk masa depan</b><small>Belajar · Bertumbuh · Bersiap</small></div></div><div className="hero-stamp"><span>YOUR</span><b>NEXT</b><span>CHAPTER</span></div></div></div><div className="container hero-bottom"><span>PELATIHAN KERJA</span><i/><span>PERSIAPAN KOMPETENSI</span><i/><span>INFORMASI PENDAFTARAN</span></div></section>
<section className="intro-section section-pad"><div className="container intro-grid"><div className="intro-visual"><img src="https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1000&q=85" alt="Peserta belajar dalam lingkungan pelatihan" loading="lazy"/><div className="intro-caption"><span className="caption-mark">B.</span><span><b>Belajar dengan arah</b><small>Persiapkan langkah berikutnya</small></span></div></div><div className="intro-copy"><Eyebrow>Tentang lembaga</Eyebrow><h2>Setiap masa depan besar dimulai dari <em>persiapan yang tepat.</em></h2><p>LPK Bulan Berkah Senyum dan PT. Mardel Mitra Sejahtera hadir dalam ekosistem informasi pelatihan dan persiapan kerja. Website ini menjadi pintu awal untuk mengenal program, memahami persyaratan, dan menyampaikan minat pendaftaran.</p><div className="value-list"><div><span><BookOpen/></span><div><b>Informasi program</b><small>Kenali materi dan kompetensi yang dipelajari.</small></div></div><div><span><Globe2/></span><div><b>Wawasan negara tujuan</b><small>Pelajari gambaran awal dan proses yang perlu dikonfirmasi.</small></div></div><div><span><HeartHandshake/></span><div><b>Pendampingan informasi</b><small>Mulai dengan konsultasi dan verifikasi kebutuhan.</small></div></div></div><Link to="/profil" className="btn btn-dark">Kenali lembaga <ArrowRight size={17}/></Link></div></div></section>
<section className="section-pad soft-section"><div className="container"><div className="section-row"><SectionHeading eyebrow="Program pilihan" title="Bekali diri dengan keterampilan baru" description="Jelajahi pilihan program. Rincian durasi, jadwal, dan biaya dikonfirmasi kepada pengelola."/><Link to="/lpk" className="text-link section-more">Semua program <ArrowRight size={16}/></Link></div><div className="program-grid">{programs.map(p=><ProgramCard key={p.slug} item={p}/>)}</div></div></section>
<section className="section-pad"><div className="container"><div className="section-row"><SectionHeading eyebrow="Wawasan global" title="Kenali negara tujuan" description="Informasi umum untuk membantu calon peserta memulai pencarian informasi secara bertanggung jawab."/><Link to="/pt-mardel" className="text-link section-more">Lihat semua negara <ArrowRight size={16}/></Link></div><div className="country-grid">{countries.slice(0,3).map(c=><CountryCard key={c.slug} item={c}/>)}</div></div></section>
<section className="process-section section-pad"><div className="container"><SectionHeading eyebrow="Langkah pendaftaran" title="Mulai dari langkah yang sederhana" description="Ikuti tahapan awal berikut. Pengiriman formulir belum berarti diterima atau dijamin mendapat penempatan." center/><div className="process-grid">{[{n:'01',icon:ClipboardCheck,title:'Pilih Jalur',desc:'Pilih pendaftaran via WhatsApp atau Google Form.'},{n:'02',icon:Users,title:'Kirim Data',desc:'Lengkapi informasi melalui platform yang dipilih.'},{n:'03',icon:Phone,title:'Tindak lanjut',desc:'Tim pengelola akan menghubungi Anda segera.'},{n:'04',icon:GraduationCap,title:'Persiapan lanjutan',desc:'Ikuti arahan resmi yang telah dikonfirmasi.'}].map(s=><div className="process-item" key={s.n}><div className="process-top"><span>{s.n}</span><s.icon size={23}/></div><h3>{s.title}</h3><p>{s.desc}</p></div>)}</div><div className="process-cta"><div><b>Siap mengambil langkah pertama?</b><p>Pilih jalur pendaftaran yang paling mudah bagi Anda.</p></div><Link to="/pendaftaran" className="btn btn-gold">Daftar Sekarang <ArrowRight size={17}/></Link></div></div></section>
<section className="section-pad"><div className="container faq-layout"><div><Eyebrow>Pertanyaan umum</Eyebrow><h2>Hal yang perlu Anda ketahui</h2><p>Belum menemukan jawaban? Hubungi kami melalui jalur pendaftaran yang tersedia.</p><Link to="/pendaftaran" className="text-link">Tanya melalui pendaftaran <ArrowRight size={16}/></Link></div><FAQList items={faqs.slice(0,4)}/></div></section>
<ContactBand/></Layout>}
function ContactBand(){return <section className="contact-band"><div className="container contact-band-inner"><div><Eyebrow>Hubungi pengelola</Eyebrow><h2>Butuh informasi lebih lanjut?</h2><p>Silakan ajukan minat pendaftaran melalui jalur resmi kami.</p></div><Link to="/pendaftaran" className="btn btn-white">Hubungi Kami <ArrowRight size={17}/></Link></div></section>}
function FAQList({items}){const [open,setOpen]=useState(0);return <div className="faq-list">{items.map((f,i)=><div className={`faq-item ${open===i?'faq-open':''}`} key={f.q}><button onClick={()=>setOpen(open===i?-1:i)} aria-expanded={open===i}><span>{f.q}</span><ChevronDown size={18}/></button>{open===i&&<p>{f.a}</p>}</div>)}</div>}
function ProfileLanding(){return <Layout><PageHero eyebrow="Profil lembaga" title="Mengenal lembaga dan arah pengembangan" description="Informasi profil, unit program, visi misi, struktur organisasi, dan fungsi kerja."/><section className="section-pad"><div className="container"><SectionHeading eyebrow="Profil" title="Kenali bagian-bagian lembaga" description="Pilih bagian yang ingin Anda ketahui lebih lanjut."/><div className="feature-grid">{[{icon:BookOpen,title:'Unit Program',desc:'Gambaran unit dan ruang lingkup program.',to:'/profil/unit-program'},{icon:Globe2,title:'Visi dan Misi',desc:'Arah dan tujuan pengembangan lembaga.',to:'/profil/visi-misi'},{icon:Users,title:'Struktur Organisasi',desc:'Gambaran struktur organisasi.',to:'/profil/struktur-organisasi'},{icon:BriefcaseBusiness,title:'Tugas dan Fungsi',desc:'Peran dan tanggung jawab setiap bagian.',to:'/profil/tugas-fungsi'}].map(x=><Link className="feature-card" to={x.to} key={x.title}><span className="feature-icon"><x.icon/></span><h3>{x.title}</h3><p>{x.desc}</p><span className="text-link">Buka halaman <ArrowRight size={15}/></span></Link>)}</div></div></section><ContactBand/></Layout>}
function ProfileDetail(){const {slug}=useParams();return <Layout><PageHero eyebrow="Profil" title="Halaman Profil" description="Detail informasi profil lembaga."/><section className="section-pad"><div className="container text-center"><p>Informasi detail sedang disiapkan oleh pengelola.</p><Link to="/profil" className="btn btn-primary mt-4">Kembali ke Profil</Link></div></section></Layout>}
function LpkLanding(){return <Layout><PageHero eyebrow="LPK Bulan Berkah Senyum" title="Belajar keterampilan, persiapkan masa depan" description="Kenali program pelatihan dan materi pembelajaran." image="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1800&q=85"/><section className="section-pad"><div className="container"><SectionHeading eyebrow="Program pelatihan" title="Pilih bidang yang ingin Anda pelajari" description="Setiap halaman program memuat gambaran materi dan persyaratan awal."/><div className="program-grid">{programs.map(p=><ProgramCard key={p.slug} item={p}/>)}</div></div></section><ContactBand/></Layout>}
function ProgramDetail(){const {slug}=useParams();const p=programs.find(x=>x.slug===slug);if(!p)return <NotFound/>;return <Layout><PageHero eyebrow="Program pelatihan" title={p.name} description={p.description} image={p.image}><Link to={`/pendaftaran?program=${p.slug}`} className="btn btn-gold">Daftar Sekarang <ArrowRight size={17}/></Link></PageHero><section className="section-pad"><div className="container detail-grid"><div className="detail-main"><Eyebrow>Gambaran program</Eyebrow><h2>Tujuan pelatihan</h2><p>{p.objective}</p><h2>Materi yang dipelajari</h2><ul className="check-list">{p.materials.map(m=><li key={m}><CheckCircle2 size={18}/>{m}</li>)}</ul><h2>Kompetensi yang dikembangkan</h2><div className="skill-tags">{p.skills.map(s=><span key={s}>{s}</span>)}</div><h2>Persyaratan awal</h2><ul className="check-list">{p.requirements.map(r=><li key={r}><CheckCircle2 size={18}/>{r}</li>)}</ul></div><aside className="detail-aside"><div className="info-panel"><span className="panel-icon"><GraduationCap/></span><h3>Informasi program</h3><div className="info-row"><span>Durasi pelatihan</span><b>Konfirmasi ke admin</b></div><div className="info-row"><span>Biaya</span><b>Konfirmasi ke admin</b></div><Link to={`/pendaftaran?program=${p.slug}`} className="btn btn-primary btn-full">Daftar Sekarang <ArrowRight size={16}/></Link></div></aside></div></section><ContactBand/></Layout>}
function MardelLanding(){return <Layout><PageHero eyebrow="PT. Mardel Mitra Sejahtera" title="Informasi dan persiapan peluang kerja lintas negara" description="Jelajahi informasi umum negara tujuan." image="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1800&q=85"/><section className="section-pad"><div className="container"><SectionHeading eyebrow="Negara tujuan" title="Kenali negara, pahami prosesnya" description="Halaman berikut berisi gambaran awal."/><div className="country-grid">{countries.map(c=><CountryCard key={c.slug} item={c}/>)}</div></div></section><ContactBand/></Layout>}
function CountryDetail(){const {slug}=useParams();const c=countries.find(x=>x.slug===slug);if(!c)return <NotFound/>;return <Layout><PageHero eyebrow="Informasi negara tujuan" title={`${c.flag} ${c.name}`} description={c.description} image={c.image}><Link to={`/pendaftaran?country=${c.slug}`} className="btn btn-gold">Daftar Sekarang <ArrowRight size={17}/></Link></PageHero><section className="section-pad"><div className="container text-center"><h2>Peluang kerja di {c.name}</h2><p>Informasi detail sedang disiapkan. Silakan hubungi admin untuk konsultasi.</p><Link to="/pendaftaran" className="btn btn-primary mt-4">Hubungi Kami</Link></div></section><ContactBand/></Layout>}
function Registration(){
  const params=new URLSearchParams(window.location.search);
  const preselectedProgram=programs.find(p=>p.slug===params.get('program'));
  return <Layout>
    <PageHero eyebrow="Pendaftaran" title="Mulai langkah pertama Anda" description="Pilih opsi pendaftaran di bawah." compact/>
    <section className="section-pad">
      <div className="container">
        <div style={{maxWidth:'600px', margin:'0 auto', background:'white', padding:'2rem', borderRadius:'1rem', boxShadow:'0 10px 30px rgba(0,0,0,0.1)'}}>
          <h2 style={{textAlign:'center', marginBottom:'1.5rem'}}>Pilih Jalur Pendaftaran</h2>
          <div style={{display:'grid', gap:'1rem'}}>
            <a href="https://wa.me/62812345678" target="_blank" rel="noreferrer" className="btn btn-primary btn-full" style={{background:'#25D366', borderColor:'#25D366', color:'white', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', height:'60px', fontSize:'1.1rem', textDecoration:'none'}}>
              <Phone size={20}/> Daftar via WhatsApp
            </a>
            <a href="#" target="_blank" rel="noreferrer" className="btn btn-outline btn-full" style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', height:'60px', fontSize:'1.1rem', textDecoration:'none'}}>
              <FileText size={20}/> Daftar via Google Form
            </a>
          </div>
          {preselectedProgram && <div style={{marginTop:'1.5rem', textAlign:'center', padding:'1rem', background:'#f0f7ff', borderRadius:'8px'}}>Program terpilih: <strong>{preselectedProgram.name}</strong></div>}
        </div>
      </div>
    </section>
  </Layout>
}
function Privacy(){return <Layout><PageHero eyebrow="Privasi" title="Kebijakan Privasi" compact/><section className="section-pad"><div className="container legal-copy"><h2>Kebijakan Privasi</h2><p>Dengan mengunjungi dan menggunakan website ini, Anda menyetujui pengumpulan dan penggunaan informasi sesuai dengan kebijakan yang berlaku.</p></div></section></Layout>}

function AdminDashboardLanding(){return <Layout><PageHero eyebrow="Admin" title="Panel Administrasi" description="Kelola konten website: berita, foto, dokumen, dan pengaturan."/><section className="section-pad"><div className="container"><div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:'1.5rem'}}>
<div className="card hover-lift transition-all" style={{padding:'1.5rem', borderRadius:'12px', background:'white', boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
<Link to="/admin/news" style={{display:'block', textDecoration:'none', color:'inherit'}}>
<div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
<div style={{width:'48px', height:'48px', background:'#eff6ff', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center'}}>
<FileText size={24} style={{color:'#2563eb'}}/>
</div>
<div>
<h3 style={{margin:'0 0 0.25rem 0', fontSize:'1.125rem'}}>Berita</h3>
<p style={{margin:0, fontSize:'0.875rem', color:'#6b7280'}}>Kelola berita dan artikel</p>
</div>
</div>
</Link>
</div>
<div className="card hover-lift transition-all" style={{padding:'1.5rem', borderRadius:'12px', background:'white', boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
<Link to="/admin/photos" style={{display:'block', textDecoration:'none', color:'inherit'}}>
<div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
<div style={{width:'48px', height:'48px', background:'#f0fdf4', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center'}}>
<ChevronRight size={24} style={{color:'#16a34a'}}/>
</div>
<div>
<h3 style={{margin:'0 0 0.25rem 0', fontSize:'1.125rem'}}>Foto</h3>
<p style={{margin:0, fontSize:'0.875rem', color:'#6b7280'}}>Kelola galeri foto</p>
</div>
</div>
</Link>
</div>
<div className="card hover-lift transition-all" style={{padding:'1.5rem', borderRadius:'12px', background:'white', boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
<Link to="/admin/documents" style={{display:'block', textDecoration:'none', color:'inherit'}}>
<div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
<div style={{width:'48px', height:'48px', background:'#fef3c7', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center'}}>
<BookOpen size={24} style={{color:'#d97706'}}/>
</div>
<div>
<h3 style={{margin:'0 0 0.25rem 0', fontSize:'1.125rem'}}>Dokumen</h3>
<p style={{margin:0, fontSize:'0.875rem', color:'#6b7280'}}>Kelola file dan sumber daya</p>
</div>
</div>
</Link>
</div>
<div className="card hover-lift transition-all" style={{padding:'1.5rem', borderRadius:'12px', background:'white', boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
<Link to="/admin/thumbnails" style={{display:'block', textDecoration:'none', color:'inherit'}}>
<div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
<div style={{width:'48px', height:'48px', background:'#f3e8ff', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center'}}>
<ArrowRight size={24} style={{color:'#a855f7'}}/>
</div>
<div>
<h3 style={{margin:'0 0 0.25rem 0', fontSize:'1.125rem'}}>Thumbnail</h3>
<p style={{margin:0, fontSize:'0.875rem', color:'#6b7280'}}>Kelola gambar hero</p>
</div>
</div>
</Link>
</div>
</div>

<div style={{marginTop:'2rem', padding:'1.5rem', background:'#f9fafb', borderRadius:'12px'}}>
<h3 style={{marginTop:0, fontSize:'1.125rem'}}>Statistik Konten</h3>
<p style={{color:'#6b7280'}}>Sistem administrasi website untuk mengelola konten publik.</p>
</div>

</div></section></Layout>}

function AdminNews(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews().then(setItems).finally(() => setLoading(false));
  }, []);

  async function handleAdd() {
    const title = prompt('Judul Berita:');
    if (!title) return;
    try {
      const newItem = await createNews({ title, content: 'Isi berita baru...' });
      setItems([newItem, ...items]);
    } catch (e) { alert(e.message); }
  }

  async function handleDelete(id) {
    if (!confirm('Hapus berita ini?')) return;
    try {
      await deleteNews(id);
      setItems(items.filter(i => i.id !== id));
    } catch (e) { alert(e.message); }
  }

  return <Layout>
    <PageHero eyebrow="Admin" title="Kelola Berita" description="Tambah, edit, dan kelola berita website."/>
    <section className="section-pad">
      <div className="container">
        <div style={{marginBottom:'1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h2 style={{margin:0}}>Daftar Berita</h2>
          <button onClick={handleAdd} className="btn btn-primary">Tambah Berita</button>
        </div>
        <div className="card" style={{padding:'1.5rem', background:'white', borderRadius:'12px'}}>
          {loading ? <p>Memuat...</p> : (
            <table style={{width:'100%', borderCollapse:'collapse'}}>
              <thead>
                <tr style={{borderBottom:'2px solid #eee'}}>
                  <th style={{textAlign:'left', padding:'1rem'}}>Judul</th>
                  <th style={{textAlign:'right', padding:'1rem'}}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} style={{borderBottom:'1px solid #eee'}}>
                    <td style={{padding:'1rem'}}>{item.title}</td>
                    <td style={{padding:'1rem', textAlign:'right'}}>
                      <button onClick={() => handleDelete(item.id)} style={{color:'red', border:'none', background:'none', cursor:'pointer'}}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  </Layout>
}

function AdminPhotos(){return <Layout><PageHero eyebrow="Admin" title="Kelola Foto" description="Tambah, edit, dan kelola galeri foto website."/><section className="section-pad"><div className="container"><div style={{marginBottom:'1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem'}}><h2 style={{margin:0}}>Galeri Foto</h2><button className="btn btn-primary" style={{display:'flex', alignItems:'center', gap:'0.5rem'}}><ChevronRight size={16}/> Upload Foto</button></div><div className="card" style={{padding:'1.5rem', borderRadius:'12px', background:'white', boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}><p style={{color:'#6b7280', textAlign:'center', padding:'3rem'}}>Kelola foto (CRUD) - hubungkan ke Supabase photos table</p></div></div></section></Layout>}

function AdminDocuments(){return <Layout><PageHero eyebrow="Admin" title="Kelola Dokumen" description="Tambah, edit, dan kelola file dokumentasi website."/><section className="section-pad"><div className="container"><div style={{marginBottom:'1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem'}}><h2 style={{margin:0}}>Dokumentasi</h2><button className="btn btn-primary" style={{display:'flex', alignItems:'center', gap:'0.5rem'}}><BookOpen size={16}/> Upload Dokumen</button></div><div className="card" style={{padding:'1.5rem', borderRadius:'12px', background:'white', boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}><p style={{color:'#6b7280', textAlign:'center', padding:'3rem'}}>Kelola dokumen (CRUD) - hubungkan ke Supabase documents table</p></div></div></section></Layout>}

function AdminThumbnails(){return <Layout><PageHero eyebrow="Admin" title="Kelola Thumbnail" description="Tambah, edit, dan kelola gambar hero/thumbnail website."/><section className="section-pad"><div className="container"><div style={{marginBottom:'1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem'}}><h2 style={{margin:0}}>Thumbnail & Hero</h2><button className="btn btn-primary" style={{display:'flex', alignItems:'center', gap:'0.5rem'}}><ArrowRight size={16}/> Upload Gambar</button></div><div className="card" style={{padding:'1.5rem', borderRadius:'12px', background:'white', boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}><p style={{color:'#6b7280', textAlign:'center', padding:'3rem'}}>Kelola thumbnail (CRUD) - hubungkan ke Supabase thumbnails table</p></div></div></section></Layout>}

function NotFound(){return <Layout><section className="not-found"><span>404</span><h1>Halaman tidak ditemukan</h1><Link to="/" className="btn btn-primary">Kembali ke Beranda <ArrowRight size={16}/></Link></section></Layout>}

function AdminLogin(){
  const navigate=useNavigate();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  
  async function login(e){
    e.preventDefault();
    setBusy(true);
    setError('');
    try{
      await adminLogin(email,password);
      navigate('/admin/dashboard');
    }catch(e){
      setError(e.message||'Login gagal.');
    }finally{
      setBusy(false);
    }
  }
  
  return <div className="admin-auth" style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f3f4f6'}}>
    <div className="auth-card" style={{background:'white', padding:'2.5rem', borderRadius:'1rem', boxShadow:'0 10px 40px rgba(0,0,0,0.1)', width:'100%', maxWidth:'420px'}}>
      <Brand/>
      <div style={{textAlign:'center', margin:'2rem 0 1.5rem'}}>
        <div style={{width:'64px', height:'64px', background:'#eff6ff', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem'}}>
          <ShieldCheck size={32} style={{color:'#2563eb'}}/>
        </div>
        <h1 style={{fontSize:'1.5rem', margin:'0 0 0.5rem 0'}}>Masuk ke Dashboard</h1>
        <p style={{color:'#6b7280', margin:0}}>Area khusus admin untuk kelola konten</p>
      </div>
      <form onSubmit={login} style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
        <label style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
          <span style={{fontSize:'0.875rem', fontWeight:'500'}}>Email Admin</span>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="username" style={{padding:'0.75rem', border:'1px solid #d1d5db', borderRadius:'0.5rem', fontSize:'1rem'}}/>
        </label>
        <label style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
          <span style={{fontSize:'0.875rem', fontWeight:'500'}}>Kata Sandi</span>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password" style={{padding:'0.75rem', border:'1px solid #d1d5db', borderRadius:'0.5rem', fontSize:'1rem'}}/>
        </label>
        {error&&<div style={{padding:'0.75rem', background:'#fee2e2', color:'#991b1b', borderRadius:'0.5rem', fontSize:'0.875rem'}}><AlertCircle size={16} style={{verticalAlign:'middle', marginRight:'0.5rem'}}/>{error}</div>}
        <button className="btn btn-primary btn-full" disabled={busy} style={{padding:'0.875rem', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem'}}>
          {busy?'Memeriksa...':'Masuk'} <LogIn size={18}/>
        </button>
      </form>
      <div style={{marginTop:'1.5rem', textAlign:'center'}}>
        <Link to="/" style={{color:'#6b7280', fontSize:'0.875rem'}}>← Kembali ke website publik</Link>
      </div>
      <p style={{marginTop:'1.5rem', fontSize:'0.75rem', color:'#9ca3af', textAlign:'center'}}>Akun admin dibuat oleh super admin.</p>
    </div>
  </div>
}
function useNoIndex(){useEffect(()=>{let m=document.querySelector('meta[name="robots"]');if(!m){m=document.createElement('meta');m.name='robots';document.head.appendChild(m);}m.content='noindex, nofollow';},[]);}

function AdminGuard({children}){
  useNoIndex();
  const [checking,setChecking]=useState(true);
  const [valid,setValid]=useState(false);
  
  useEffect(()=>{
    isAdminSession().then(setValid).catch(()=>setValid(false)).finally(()=>setChecking(false));
  },[]);
  
  if(checking)return <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}><p>Memeriksa sesi admin...</p></div>;
  return valid?children:<Navigate to="/admin" replace/>;
}
function AdminDashboard(){return <AdminDashboardLanding/>}
export default function App(){return <Routes><Route path="/" element={<Home/>}/><Route path="/profil" element={<ProfileLanding/>}/><Route path="/profil/:slug" element={<ProfileDetail/>}/><Route path="/lpk" element={<LpkLanding/>}/><Route path="/program/:slug" element={<ProgramDetail/>}/><Route path="/pt-mardel" element={<MardelLanding/>}/><Route path="/negara/:slug" element={<CountryDetail/>}/><Route path="/pendaftaran" element={<Registration/>}/><Route path="/kebijakan-privasi" element={<Privacy/>}/><Route path="/admin" element={<AdminLogin/>}/><Route path="/admin/dashboard" element={<AdminGuard><AdminDashboard/></AdminGuard>}/><Route path="/admin/news" element={<AdminGuard><AdminNews/></AdminGuard>}/><Route path="/admin/photos" element={<AdminGuard><AdminPhotos/></AdminGuard>}/><Route path="/admin/documents" element={<AdminGuard><AdminDocuments/></AdminGuard>}/><Route path="/admin/thumbnails" element={<AdminGuard><AdminThumbnails/></AdminGuard>}/><Route path="*" element={<NotFound/>}/></Routes>}
