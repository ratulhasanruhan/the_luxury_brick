import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Layers, 
  Volume2, 
  Flame, 
  WifiOff, 
  ArrowRight, 
  X, 
  ShieldCheck, 
  ShoppingBag, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import BriqueCanvas from './components/BriqueCanvas';
import StressLab from './components/StressLab';

export default function App() {
  const [finish, setFinish] = useState('executive');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    networth: 'under_5m',
    intent: 'yacht',
    agree: false
  });

  const slides = [
    {
      title: 'Pedestal at The Louvre',
      desc: 'B R I Q U E resting on a pure Carrara marble pedestal under custom volumetric lighting in Paris, France.',
      imgUrl: '/assets/brique_gallery_1.png'
    },
    {
      title: 'Executive Paperweight',
      desc: 'Anchoring critical multi-million dollar deeds on an obsidian desk next to a bespoke fountain pen.',
      imgUrl: '/assets/brique_gallery_2.png'
    }
  ];

  const finishPrices = {
    sotheby: '$2,499',
    executive: '$1,499',
    standard: '$999'
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const sections = ['home', 'customizer', 'pedigree', 'speculate', 'gallery'];
      const scrollPos = window.scrollY + 200;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('active')),
      { threshold: 0.12 }
    );
    const selector = '.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur';
    document.querySelectorAll(selector).forEach(el => observer.observe(el));
    return () => document.querySelectorAll(selector).forEach(el => observer.unobserve(el));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide(p => (p + 1) % slides.length), 7000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.agree) {
      alert('Please complete all required fields and accept the mineral agreement.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      confetti({ particleCount: 120, spread: 65, colors: ['#C8A96E', '#9B2335', '#FFFFFF'], origin: { y: 0.6 } });
    }, 2000);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', networth: 'under_5m', intent: 'yacht', agree: false });
    setSubmitted(false);
    setCheckoutOpen(false);
  };

  return (
    <>
      {/* ── Fixed Background 3D Canvas ── */}
      <BriqueCanvas finish={finish} scrollChoreography={true} />

      <div id="ui-layer">
        {/* ── Navigation ── */}
        <nav className={`nav-bar ${isScrolled ? 'scrolled' : ''} pointer-events-auto`}>
          <div className="brand">B R I Q U E<span>.</span></div>
          <ul className="nav-links">
            {[
              ['home', 'Home'],
              ['customizer', 'Bespoke'],
              ['pedigree', 'Pedigree'],
              ['speculate', 'Audit'],
              ['gallery', 'Context'],
            ].map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className={activeSection === id ? 'active' : ''}>{label}</a>
              </li>
            ))}
          </ul>
          <button className="nav-cta pointer-events-auto" onClick={() => setCheckoutOpen(true)} id="nav-apply-button">
            Apply for Allocation
          </button>
        </nav>

        {/* ── Hero ── */}
        <section id="home" className="hero">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-eyebrow reveal-up">
                <span className="hero-eyebrow-line" />
                <span className="hero-eyebrow-text">The Monolith Drops · 2026</span>
              </div>
              <h1 className="reveal-up delay-100">B R I Q U E</h1>
              <div className="hero-rule reveal-up delay-200" />
              <p className="hero-tagline reveal-up delay-300">
                The original hand-fired red clay monolith. Three point two kilograms of
                pure physical presence. Unapologetically analogue.
              </p>
              <div className="hero-ctas reveal-up delay-400">
                <a href="#customizer" className="btn-primary pointer-events-auto" id="hero-bespoke-cta">
                  Select Drop Edition
                </a>
                <button className="btn-secondary pointer-events-auto" onClick={() => setCheckoutOpen(true)} id="hero-apply-cta">
                  Request Allocation <ArrowRight size={13} />
                </button>
              </div>
            </div>

            <div className="hero-3d-wrapper" style={{ height: '500px', width: '100%', position: 'relative' }}>
              {/* Choreographed background 3D canvas aligns dynamically here */}
            </div>
          </div>

          <div className="scroll-hint">
            Scroll<span />
          </div>
        </section>

        {/* ── Marquee ── */}
        <div className="marquee-container">
          <div className="marquee-content">
            {[...Array(8)].map((_, i) => (
              <React.Fragment key={i}>
                <div className="marquee-item">
                  <span>Hand-Glazed Mineral Core</span>
                  <span className="marquee-dot" />
                </div>
                <div className="marquee-item">
                  <span style={{ color: 'var(--gold)', opacity: 0.7 }}>Veblen Rating Exempt</span>
                  <span className="marquee-dot" style={{ background: 'var(--gold)' }} />
                </div>
                <div className="marquee-item">
                  <span>Zero Digital Latency</span>
                  <span className="marquee-dot" />
                </div>
                <div className="marquee-item">
                  <span>Eternal Durability</span>
                  <span className="marquee-dot" />
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── Customizer / Registry ── */}
        <section id="customizer" className="customizer">
          {/* Left: Spacer showing the background 3D canvas */}
          <div className="customizer-image-block reveal-left" style={{
            position: 'relative',
            background: 'transparent',
            border: '1px solid var(--border)',
            height: '520px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden'
          }}>
            {/* 3D Model sits behind this transparent slot */}
            <div className="customizer-image-overlay" style={{ background: 'linear-gradient(to top, rgba(5,5,8,0.96) 0%, rgba(5,5,8,0.5) 45%, transparent 100%)' }}>
              <div className="label" style={{ marginBottom: '0.4rem' }}>3D Showcase Review</div>
              <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--serif)', color: 'var(--white)' }}>
                {finish === 'sotheby' ? 'Sotheby Drop #018' : finish === 'executive' ? 'Executive Drop #118' : 'Standard Drop #642'}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--s-500)', marginTop: '0.4rem', lineHeight: '1.5' }}>
                Each drop edition is kiln-embossed with a unique serial, registered permanently in our Swiss physical archive ledger. Drag the background area to inspect.
              </p>
            </div>
          </div>

          {/* Right: Option panel */}
          <div className="customizer-panel reveal-right">
            <div>
              <div className="section-label">Registry & Drop Allocation</div>
              <h2 className="section-title">Serial Registry</h2>
              <p className="section-desc">
                Every B R I Q U E is stamped with an individual serial and logged in
                our physical ledger. Select your allocation drop.
              </p>
            </div>

            <div className="option-cards">
              {[
                {
                  key: 'sotheby',
                  name: 'Sotheby Signature Drop',
                  range: '#001 – #050',
                  desc: 'Gold wax seal of authenticity & custom velvet pedestal.',
                  price: finishPrices.sotheby,
                  gold: true,
                },
                {
                  key: 'executive',
                  name: 'Executive Registry Drop',
                  range: '#051 – #200',
                  desc: 'Premium kiln-embossed serialisation. Delivered in bespoke cardboard.',
                  price: finishPrices.executive,
                },
                {
                  key: 'standard',
                  name: 'Standard Kiln Drop',
                  range: '#201 – #999',
                  desc: 'Kiln-embossed serialisation. Pure red clay heritage.',
                  price: finishPrices.standard,
                },
              ].map(({ key, name, range, desc, price, gold }, index) => (
                <div
                  key={key}
                  className={`option-card ${key} ${finish === key ? 'active' : ''} reveal-up pointer-events-auto`}
                  style={{ transitionDelay: `${100 + index * 100}ms` }}
                  onClick={() => setFinish(key)}
                  id={`finish-${key}`}
                >
                  <div className="option-details">
                    <span className={`option-name ${gold && finish === key ? 'text-gold' : ''}`}>
                      {name}
                      <span style={{ color: 'var(--s-700)', fontWeight: 400, fontSize: '0.7rem', marginLeft: '0.5rem' }}>
                        {range}
                      </span>
                    </span>
                    <span className="option-desc">{desc}</span>
                  </div>
                  <span className="option-price">{price}</span>
                </div>
              ))}
            </div>

            <div className="specs-block reveal-up" style={{ transitionDelay: '400ms' }}>
              <div className="specs-title">Physical Metrics</div>
              <div className="specs-grid">
                {[
                  ['Weight', '3.24 kg'],
                  ['Acoustics', '102 Hz Thud'],
                  ['Thermal', '2000 °F Glazed'],
                ].map(([label, val]) => (
                  <div className="spec-cell" key={label}>
                    <div className="spec-label">{label}</div>
                    <div className="spec-val">{val}</div>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="btn-primary reveal-up pointer-events-auto"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', width: '100%', transitionDelay: '500ms' }}
              onClick={() => setCheckoutOpen(true)}
              id="customizer-apply-button"
            >
              <ShoppingBag size={14} />
              Apply for {finish.charAt(0).toUpperCase() + finish.slice(1)} Allocation
            </button>
          </div>
        </section>

        {/* ── Pedigree / Features ── */}
        <section id="pedigree" style={{ background: 'transparent', maxWidth: '100%', padding: '7rem 5%' }}>
          <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
            <div className="pedigree-header reveal-scale">
              <div className="label" style={{ justifyContent: 'center', display: 'flex', marginBottom: '1.25rem' }}>
                Engineered Inertia
              </div>
              <h2>The Specifications</h2>
              <p>Unlike modern digital devices that deteriorate, B R I Q U E accumulates presence over generations.</p>
            </div>

            <div className="features-grid">
              {[
                {
                  num: '01',
                  icon: <Layers size={24} />,
                  title: 'Solid Clay Core',
                  desc: 'Zero battery degradation, zero hardware obsolescence. Formulated from premium sedimentary silt, fired 48 hours for infinite durability.',
                },
                {
                  num: '02',
                  icon: <Volume2 size={24} />,
                  title: 'Resonant Telemetry',
                  desc: 'Induces high-satisfaction tactile responses. Dropped on solid concrete, it outputs a deep acoustic frequency that commands ambient authority.',
                },
                {
                  num: '03',
                  icon: <Flame size={24} />,
                  title: 'Thermal Equilibrium',
                  desc: 'Built to withstand extreme atmospheric shifts. Maintains cooling properties on modern desks and provides resistance during global panics.',
                },
                {
                  num: '04',
                  icon: <WifiOff size={24} />,
                  title: 'Zero Digital Noise',
                  desc: 'Does not track location, request notifications, or require updates. The ultimate minimalist hardware to anchor your luxury desk space.',
                  accent: true,
                },
              ].map(({ num, icon, title, desc, accent }, index) => (
                <div key={num} className={`feature-card reveal-up ${accent ? 'gold-accent' : ''}`} style={{ transitionDelay: `${index * 120}ms` }}>
                  <div className="feature-num">{num}</div>
                  <div className="feature-icon">{icon}</div>
                  <h3 className="feature-title">{title}</h3>
                  <p className="feature-desc">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Game (Audit Console) ── */}
        <section id="speculate" style={{ paddingBottom: '3rem' }}>
          <div className="reveal-scale pointer-events-auto">
            <StressLab onClaimAllocation={() => setCheckoutOpen(true)} />
          </div>
        </section>

        {/* ── Gallery ── */}
        <section id="gallery" className="gallery">
          <div className="reveal-scale">
            <div className="label" style={{ justifyContent: 'center', display: 'flex', marginBottom: '1.25rem' }}>
              Spatial Projection
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
              B R I Q U E In Situ
            </h2>
            <p style={{ color: 'var(--s-500)', fontFamily: 'var(--serif)', fontStyle: 'italic', maxWidth: '520px', margin: '0 auto' }}>
              Witness how B R I Q U E redefines the energetic field of high-end environments.
            </p>
          </div>

          <div className="gallery-carousel reveal-up delay-200 pointer-events-auto" id="gallery-carousel">
            {slides.map((slide, i) => (
              <div
                key={i}
                className={`carousel-slide ${i === currentSlide ? 'active' : ''}`}
                style={{ backgroundImage: `url(${slide.imgUrl})` }}
              >
                <div className="carousel-overlay">
                  <h3 className="carousel-title">{slide.title}</h3>
                  <p className="carousel-desc">{slide.desc}</p>
                </div>
              </div>
            ))}
            <button className="carousel-btn prev pointer-events-auto" onClick={() => setCurrentSlide(p => (p - 1 + slides.length) % slides.length)} aria-label="Previous">
              <ChevronLeft size={18} />
            </button>
            <button className="carousel-btn next pointer-events-auto" onClick={() => setCurrentSlide(p => (p + 1) % slides.length)} aria-label="Next">
              <ChevronRight size={18} />
            </button>
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <div className="cta-section">
          <div className="reveal-blur" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="label" style={{ justifyContent: 'center', display: 'flex', marginBottom: '1.5rem' }}>
              Limited Kiln Batch
            </div>
            <h2>Acquire the Element</h2>
            <p>Allocations are constrained by kilning batches. Apply today to verify eligibility for the next drop.</p>
            <button className="btn-primary pointer-events-auto" onClick={() => setCheckoutOpen(true)} id="bottom-apply-button">
              Submit Allocation Application
            </button>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="pointer-events-auto">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
            <span>© 2026 B R I Q U E Labs Inc. — Hand-baked in the Earth.</span>
            <span>Copyright by <strong>Ratul Hasan Ruhan</strong>. Portfolio: <a href="https://ratulhasan.web.app" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'var(--gold)' }}>ratulhasan.web.app</a></span>
          </div>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <a href="#">Mineral Safety Sheet</a>
            <a href="#">Weight Certificates</a>
            <a href="#">Terms of Clay</a>
          </div>
        </footer>
      </div>

      {/* ── Allocation Modal ── */}
      {checkoutOpen && (
        <div className="modal-overlay pointer-events-auto" onClick={() => setCheckoutOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close pointer-events-auto" onClick={() => setCheckoutOpen(false)} aria-label="Close" id="close-modal-btn">
              <X size={16} />
            </button>

            {!submitted ? (
              <form onSubmit={handleCheckoutSubmit}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                  <ShieldCheck size={36} style={{ color: 'var(--gold)', marginBottom: '1rem' }} />
                  <div className="label" style={{ justifyContent: 'center', display: 'flex', marginBottom: '0.5rem' }}>
                    Kiln Committee Review
                  </div>
                  <h3 style={{ fontSize: '1.6rem', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>
                    Allocation Verification
                  </h3>
                  <p style={{ color: 'var(--s-500)', fontSize: '0.8rem', fontFamily: 'var(--serif)', fontStyle: 'italic' }}>
                    Due to Veblen pricing criteria and kiln limits, each purchase application is individually reviewed.
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-name">Full Name / Entity</label>
                  <input
                    type="text"
                    id="checkout-name"
                    name="name"
                    required
                    placeholder="e.g. Sterling Sotheby Trust"
                    className="form-input pointer-events-auto"
                    value={formData.name}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-email">Private Correspondence</label>
                  <input
                    type="email"
                    id="checkout-email"
                    name="email"
                    required
                    placeholder="entity@correspondence.luxury"
                    className="form-input pointer-events-auto"
                    value={formData.email}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-networth">Self-Reported Net Worth (USD)</label>
                  <select
                    className="form-select pointer-events-auto"
                    id="checkout-networth"
                    name="networth"
                    value={formData.networth}
                    onChange={handleFormChange}
                  >
                    <option value="under_5m">Below $5,000,000 — Low Allocation Probability</option>
                    <option value="5m_50m">$5M – $50M — Standard Priority</option>
                    <option value="over_50m">$50M+ — Immediate Courier Dispatch</option>
                  </select>
                  {formData.networth === 'under_5m' && (
                    <div style={{ fontSize: '0.68rem', color: 'var(--crimson)', marginTop: '0.5rem', fontWeight: 500, letterSpacing: '0.05em' }}>
                      ⚠ Accounts below $5M are routinely rejected by the kilning committee.
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-intent">Primary Intent of Placement</label>
                  <select
                    className="form-select pointer-events-auto"
                    id="checkout-intent"
                    name="intent"
                    value={formData.intent}
                    onChange={handleFormChange}
                  >
                    <option value="yacht">Holding papers on a sailing yacht in Monaco</option>
                    <option value="gallery">Standalone pedestal in a private penthouse</option>
                    <option value="doorstop">Securing bulletproof door of luxury panic vault</option>
                    <option value="gift">Sarcastic gift for a tech exec who "has everything"</option>
                  </select>
                </div>

                <label className="form-checkbox pointer-events-auto">
                  <input
                    type="checkbox"
                    name="agree"
                    required
                    checked={formData.agree}
                    onChange={handleFormChange}
                    id="checkout-agree-checkbox"
                  />
                  <span>I agree that B R I Q U E is a non-digital, hand-baked mineral and all sales are final.</span>
                </label>

                <button
                  type="submit"
                  className="btn-primary pointer-events-auto"
                  style={{ width: '100%', marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                  disabled={submitting}
                  id="checkout-submit-btn"
                >
                  {submitting ? 'Verifying Assets…' : (<>Submit Allocation Request <ArrowRight size={14} /></>)}
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <ShieldCheck size={52} style={{ color: '#2ECC71', marginBottom: '1.25rem' }} />
                <div className="label" style={{ justifyContent: 'center', display: 'flex', marginBottom: '0.75rem' }}>
                  Application Filed
                </div>
                <h3 style={{ fontSize: '1.75rem', letterSpacing: '0.08em', marginBottom: '1rem' }}>
                  Registry Confirmed
                </h3>
                <p style={{ color: 'var(--s-500)', fontSize: '0.875rem', lineHeight: '1.7', marginBottom: '2.5rem', fontFamily: 'var(--serif)', fontStyle: 'italic' }}>
                  Thank you, <strong style={{ color: 'var(--white)', fontStyle: 'normal' }}>{formData.name}</strong>.{' '}
                  Our allocation committee is verifying your assets. A representative will reach out via secure cryptographic channel.
                </p>
                <button onClick={resetForm} className="btn-primary pointer-events-auto" style={{ width: '100%' }} id="checkout-ok-btn">
                  Return to Registry
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
