import { useState, useEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  animate,
  AnimatePresence,
} from 'framer-motion';
import {

  ArrowUpRight,

  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Crown,
  Sparkles,
  Music,
  Lightbulb,
  Gift,
  Mail,
  HeartHandshake,
  Phone,
  Menu,
  X,
  Instagram,
  Twitter,
  MessageCircle,
  MapPin,
} from 'lucide-react';

// ─── Global styles ───────────────────────────────────────
const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');

@layer components {
  .liquid-glass {
    background: rgba(115, 25, 69, 0.04);
    background-blend-mode: luminosity;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: none;
    box-shadow: inset 0 1px 1px rgba(237,202,63,0.08),
                0 4px 24px rgba(0,0,0,0.35);
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .liquid-glass::before {
    content: '';
    position: absolute; inset: 0; border-radius: inherit; padding: 1px;
    background: linear-gradient(
      180deg,
      rgba(237,202,63,0.25) 0%,
      rgba(237,202,63,0.06) 20%,
      rgba(255,255,255,0) 40%,
      rgba(255,255,255,0) 60%,
      rgba(237,202,63,0.04) 80%,
      rgba(237,202,63,0.18) 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
                  linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
  .liquid-glass-strong {
    background: rgba(115, 25, 69, 0.06);
    background-blend-mode: luminosity;
    backdrop-filter: blur(50px);
    -webkit-backdrop-filter: blur(50px);
    border: none;
    box-shadow: 0 8px 32px rgba(0,0,0,0.45),
                inset 0 1px 1px rgba(237,202,63,0.15);
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .liquid-glass-strong::before {
    content: '';
    position: absolute; inset: 0; border-radius: inherit; padding: 1.2px;
    background: linear-gradient(
      180deg,
      rgba(237,202,63,0.5) 0%,
      rgba(237,202,63,0.12) 20%,
      rgba(255,255,255,0) 40%,
      rgba(255,255,255,0) 60%,
      rgba(237,202,63,0.10) 80%,
      rgba(237,202,63,0.35) 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
                  linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
  html { scroll-behavior: smooth; overflow-x: hidden; }
  body { overflow-x: hidden; width: 100%; }
  #root { overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0D0608; }
  ::-webkit-scrollbar-thumb {
    background: #731945;
    border-radius: 2px;
  }
  ::-webkit-scrollbar-thumb:hover { background: #EDCA3F; }
}

.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

@keyframes scroll-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes scroll-right {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
.animate-scroll-left {
  animation: scroll-left 35s linear infinite;
}
.animate-scroll-right {
  animation: scroll-right 35s linear infinite;
}
@media (max-width: 768px) {
  .animate-scroll-left {
    animation-duration: 25s;
  }
  .animate-scroll-right {
    animation-duration: 25s;
  }
}
`;

// ─── Ease constant ───────────────────────────────────────
const EASE = [0.16, 1, 0.3, 1] as const;

// ─── BlurText Component ──────────────────────────────────
function BlurText({ text, className = '' }: { text: string; className?: string }) {
  const words = text.split(' ');
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.09 } },
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.3em]"
          variants={{
            hidden: { filter: 'blur(14px)', opacity: 0, y: 45 },
            visible: {
              filter: 'blur(0px)',
              opacity: 1,
              y: 0,
              transition: { duration: 0.9, ease: EASE },
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

// ─── ScrollReveal wrapper ────────────────────────────────
function ScrollReveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.85, ease: EASE, delay }}
      viewport={{ once: true, margin: '-50px' }}
    >
      {children}
    </motion.div>
  );
}

// ─── CountUp Component ───────────────────────────────────
function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const motionVal = useMotionValue(0);
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionVal, target, {
        duration: 2,
        ease: EASE as unknown as [number, number, number, number],
        onUpdate: (v: number) => setDisplay(Math.round(v).toLocaleString()),
      });
      return controls.stop;
    }
  }, [isInView, target, motionVal]);

  return (
    <span ref={ref}>
      {display}{suffix}
    </span>
  );
}

// ─── SectionLabel Component ──────────────────────────────
function SectionLabel({ text }: { text: string }) {
  return (
    <ScrollReveal>
      <p className="font-body uppercase tracking-[0.22em] text-xs text-[#C4843B] mb-6 [.text-center_&]:mx-auto">
        {text}
      </p>
    </ScrollReveal>
  );
}

// ─── Data ────────────────────────────────────────────────
const navLinks = ['Home', 'Ceremonies', 'Destinations', 'Our Story', 'Gallery'];

const services = [
  { title: 'Luxury Wedding', icon: Crown, desc: 'End-to-end bespoke wedding orchestration across India\'s most iconic venues.' },
  { title: 'Décor & Styling', icon: Sparkles, desc: 'Thematic décor from royal Rajasthani grandeur to minimalist beachfront elegance.' },
  { title: 'Artist & Entertainment', icon: Music, desc: 'Curated live performances, celebrity appearances, and cultural entertainment.' },
  { title: 'Creative Consulting', icon: Lightbulb, desc: 'Concept-to-execution ideation for couples seeking a truly unique vision.' },
  { title: 'Guest Gifting', icon: Gift, desc: 'Bespoke hampers and couture favour boxes that guests cherish forever.' },
  { title: 'Couture Invitations', icon: Mail, desc: 'Hand-crafted invitation suites that set the tone before the first vow.' },
  { title: 'On-ground Hospitality', icon: HeartHandshake, desc: 'Seamless guest experience management from arrival to farewell.' },
];

const bentoProjects = [
  {
    title: 'Maheshwari–Sharma', location: 'Udaipur', date: 'December 2024',
    img: 'https://www.soulmandal.com/Reception/Reception4.jpg', span: 'md:col-span-2',
    guests: '~800 Guests',
    summary: 'The Maheshwari and Sharma families envisioned a wedding that beautifully combined heritage with elegance. Hosted in Ujjain, this grand celebration welcomed nearly 800 guests, including several international relatives.',
    highlights: [
      'A royal welcome procession inspired by traditional Rajasthani culture.',
      'A lavish sangeet night with choreographed family performances and live music.',
      'Heritage décor using marigolds, brass lamps, and handcrafted mandap design.',
      'Seamless guest hospitality with luxury stays and curated travel arrangements.',
    ],
    closing: 'The event successfully merged cultural authenticity with modern luxury, leaving guests with an unforgettable experience.',
  },
  {
    title: 'Khurana–Malhotra', location: 'Jaipur', date: 'February 2025',
    img: 'https://www.soulmandal.com/Project2.jpg', span: 'col-span-1',
    guests: 'Lakeside Resort',
    summary: 'The Khurana and Malhotra families wanted a hometown celebration with the feel of a modern destination wedding. Held at a lakeside resort in Bhopal, this vibrant wedding reflected the couple\'s youthful energy and global lifestyle.',
    highlights: [
      'Contemporary décor with pastel florals, fairy lights, and a lakeside mandap.',
      'Curated entertainment including celebrity DJs, cocktail evenings, and stand-up comedy.',
      'A fusion menu featuring Indian classics and international cuisines.',
      'Carefully planned guest experiences with personalized itineraries and luxury resort amenities.',
    ],
    closing: 'The result was a lively, stylish, and memorable event that celebrated love while honoring the couple\'s roots.',
  },
  {
    title: 'Mehta–Rao', location: 'Goa', date: 'March 2025',
    img: 'https://www.soulmandal.com/Reception/Reception13.jpg', span: 'md:col-span-3',
    guests: '~600 Guests',
    summary: 'The Mehta and Rao families envisioned a regal celebration in the heart of Jaipur, blending royal grandeur with modern elegance. Hosted at a restored palace, the wedding attracted 600 guests from India and abroad.',
    highlights: [
      'A majestic palace setting with opulent floral installations and royal décor.',
      'Traditional Rajasthani folk performances alongside an international jazz band.',
      'An extravagant mehendi by the palace pool with custom photo booths.',
      'Personalized return gifts including handcrafted Jaipur artifacts.',
    ],
    closing: 'The royal setting, meticulous planning, and fusion of cultural and modern elements made this wedding a timeless memory for everyone involved.',
  },
];

const galleryTabs = ['Haldi', 'Mehandi', 'Sangeet', 'Engagement', 'Reception'] as const;
const galleryImages: Record<string, string[]> = {
  Haldi: [
    'https://www.soulmandal.com/Haldi/Haldi1.webp',
    'https://www.soulmandal.com/Haldi/Haldi2.webp',
    'https://www.soulmandal.com/Haldi/Haldi3.webp',
    'https://www.soulmandal.com/Haldi/Haldi4.webp',
    '/images/gallery/Haldi/Haldi5.jpg',
    '/images/gallery/Haldi/Haldi6.jpg',
    '/images/gallery/Haldi/Haldi8.jpg',
    '/images/gallery/Haldi/Haldi9.jpg',
    '/images/gallery/Haldi/Haldi10.jpg',
    '/images/gallery/Haldi/Haldi11.jpg',
    '/images/gallery/Haldi/Haldi12.jpg',
    '/images/gallery/Haldi/Haldi13.jpg',
    '/images/gallery/Haldi/Haldi14.jpg',
    '/images/gallery/Haldi/Haldi15.jpg',
  ],
  Mehandi: [
    'https://www.soulmandal.com/Mehandi/Me1.jpg',
    'https://www.soulmandal.com/Mehandi/Me2.jpg',
    'https://www.soulmandal.com/Mehandi/Me3.jpg',
    'https://www.soulmandal.com/Mehandi/Me5.jpg',
    '/images/gallery/Mehandi/Me6.jpg',
    '/images/gallery/Mehandi/Me7.jpg',
    '/images/gallery/Mehandi/Me9.jpg',
    '/images/gallery/Mehandi/Me10.jpg',
    '/images/gallery/Mehandi/Me11.jpg',
    '/images/gallery/Mehandi/Me12.jpg',
    '/images/gallery/Mehandi/Me13.jpg',
    '/images/gallery/Mehandi/Me14.jpg',
    '/images/gallery/Mehandi/Me15.jpg',
    '/images/gallery/Mehandi/Me16.jpg',
  ],
  Sangeet: [
    'https://www.soulmandal.com/Sangeet/Sangeet1.webp',
    'https://www.soulmandal.com/Sangeet/Sangeet2.webp',
    'https://www.soulmandal.com/Sangeet/Sangeet3.webp',
    'https://www.soulmandal.com/Sangeet/Sangeet4.webp',
    '/images/gallery/Sangeet/Sangeet6.jpg',
    '/images/gallery/Sangeet/Sangeet7.jpg',
    '/images/gallery/Sangeet/Sangeet8.jpg',
    '/images/gallery/Sangeet/Sangeet9.jpg',
    '/images/gallery/Sangeet/Sangeet10.jpg',
    '/images/gallery/Sangeet/Sangeet11.jpg',
    '/images/gallery/Sangeet/Sangeet12.jpg',
    '/images/gallery/Sangeet/Sangeet13.jpg',
    '/images/gallery/Sangeet/Sangeet14.jpg',
    '/images/gallery/Sangeet/Sangeet15.jpg',
    '/images/gallery/Sangeet/Sangeet16.jpg',
  ],
  Engagement: [
    'https://www.soulmandal.com/Engagement/Eng1.jpg',
    'https://www.soulmandal.com/Engagement/Eng2.jpg',
    'https://www.soulmandal.com/Engagement/Eng3.jpg',
    'https://www.soulmandal.com/Engagement/Eng4.jpg',
    '/images/gallery/Engagement/Eng6.jpg',
    '/images/gallery/Engagement/Eng7.jpg',
    '/images/gallery/Engagement/Eng8.jpg',
    '/images/gallery/Engagement/Eng9.jpg',
    '/images/gallery/Engagement/Eng10.jpg',
    '/images/gallery/Engagement/Eng11.jpg',
    '/images/gallery/Engagement/Eng12.jpg',
    '/images/gallery/Engagement/Eng13.jpg',
    '/images/gallery/Engagement/Eng14.jpg',
    '/images/gallery/Engagement/Eng15.jpg',
  ],
  Reception: [
    'https://www.soulmandal.com/Reception/Reception1.jpg',
    'https://www.soulmandal.com/Reception/Reception4.jpg',
    'https://www.soulmandal.com/Reception/Reception13.jpg',
    'https://www.soulmandal.com/Reception/Reception28.jpg',
    '/images/gallery/Reception/Reception6.jpg',
    '/images/gallery/Reception/Reception7.jpg',
    '/images/gallery/Reception/Reception8.jpg',
    '/images/gallery/Reception/Reception9.jpg',
    '/images/gallery/Reception/Reception10.jpg',
    '/images/gallery/Reception/Reception11.jpg',
    '/images/gallery/Reception/Reception12.jpg',
    '/images/gallery/Reception/Reception13.jpg',
    '/images/gallery/Reception/Reception14.jpg',
    '/images/gallery/Reception/Reception15.jpg',
    '/images/gallery/Reception/Reception16.jpg',
  ],
};

const destinations = [
  { name: 'Jaipur Royal', img: '/images/destinations/jaipur.jpg' },
  { name: 'Udaipur Lakeside', img: '/images/destinations/udaipur.jpg' },
  { name: 'Indore', img: '/images/destinations/indore.jpg' },
  { name: 'Ujjain', img: '/images/destinations/ujjain.jpg' },
  { name: 'Rishikesh', img: '/images/destinations/rishikesh.jpg' },
  { name: 'Bhopal Lakeside', img: '/images/destinations/bhopal.jpg' },
  { name: 'Jodhpur', img: '/images/destinations/jodhpur.jpg' },
  { name: 'Shimla', img: '/images/destinations/shimla.jpg' },
  { name: 'Mussoorie', img: '/images/destinations/mussoorie.jpg' },
];

const testimonials = [
  { quote: 'Mahi, you and Ritesh made it feel so easy. I didn\'t stress for a single second.', name: 'Ritika Jain', location: 'Indore' },
  { quote: 'We were blown away by the décor. Soul Mandal made our wedding stress-free, stunning, and so personal to us.', name: 'Raghav & Ananya Mehta', location: 'Bhopal' },
  { quote: 'I\'ve attended countless weddings, but ours stood out for its warmth and elegance.', name: 'Sana & Aarav Jain', location: 'Ujjain' },
  { quote: 'The execution was flawless, the ambience magical, and every detail reflected our story.', name: 'Meera Joshi', location: 'Indore' },
  { quote: 'Our destination wedding in Jaipur was handled like a dream. We simply enjoyed every moment.', name: 'Aditi Malhotra', location: 'Bhopal' },
  { quote: 'Soul Mandal turned my wedding into a fairytale. The little surprises for guests made it even more memorable.', name: 'Kavya & Rohit Bansal', location: 'Indore' },
];

const faqs = [
  { q: 'What makes Soul Mandal different from other event planners?', a: 'At Soul Mandal, we don\'t just plan events — we craft experiences that feel deeply personal, luxurious, and memorable. Every detail, from décor to hospitality, is curated with soul, not just schedules.' },
  { q: 'Do you only plan weddings?', a: 'No! While luxury weddings are our forte, we also curate corporate events, milestone celebrations, and private gatherings with the same passion and precision.' },
  { q: 'Where do you provide your services?', a: 'Currently, we operate across India with a strong presence in Indore, Bhopal, and Ujjain. However, we also take on projects in other cities on request.' },
  { q: 'Do you work with budgets of all sizes?', a: 'We specialize in luxury and premium events, but we always tailor solutions to make the best use of your budget — ensuring elegance and value in every detail.' },
  { q: 'Can we hire Soul Mandal for just specific services, like décor or hospitality?', a: 'Absolutely. From standalone décor to artist curation or hospitality management — we\'re happy to step in wherever you need us most.' },
  { q: 'How early should we book you for an event?', a: 'The earlier, the better — ideally 6–12 months in advance for weddings, and 2–3 months for corporate or private events. However, we can also pull off flawless planning even within 1 month if needed.' },
  { q: 'Do you handle guest travel and stay arrangements too?', a: 'Yes! From airport pickups to hotel check-ins and on-ground concierge teams, we ensure every guest feels cared for.' },
];

const teamMembers = [
  { name: 'Mahi Pathak', initials: 'MP', role: 'Founder & Creative Director', desc: 'The heart behind Soul Mandal. Mahi blends creativity with precision to transform stories into unforgettable celebrations. With an eye for detail and a flair for aesthetics, Mahi ensures every event feels deeply personal and extraordinary.' },
  { name: 'Ritesh Sharma', initials: 'RS', role: 'Operations Head', desc: 'Ritesh is the backbone of our seamless execution. From vendor coordination to on-ground logistics, he makes sure everything runs like clockwork — ensuring our clients can simply sit back and enjoy their big day.' },
  { name: 'Aditi Mehra', initials: 'AM', role: 'Client Experience Manager', desc: 'With warmth and grace, Aditi takes care of client interactions and guest experiences. She believes in making every person feel special, turning hospitality into heartfelt connections.' },
  { name: 'Sudeep Sharma', initials: 'SS', role: 'Design & Décor Lead', desc: 'The mind behind our magical setups. Sudeep brings visions to life with innovative décor, thematic styling, and artistic touches that make every event visually stunning.' },
  { name: 'Neha Kapoor', initials: 'NK', role: 'Entertainment & Artist Curator', desc: 'From live bands to celebrity performances, Neha handpicks entertainment that elevates every celebration. She has a knack for matching the right vibe with the right talent.' },
  { name: 'Arjun Patel', initials: 'AP', role: 'Hospitality & Guest Relations Head', desc: 'Arjun leads our hospitality teams with warmth and professionalism. Whether it\'s welcoming guests, handling travel, or ensuring comfort, he makes sure every detail feels effortless.' },
];

// ─── Main App ────────────────────────────────────────────
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('Haldi');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [plannerForm, setPlannerForm] = useState({ name: '', phone: '', budget: '', destination: '' });
  const [whatsappHovered, setWhatsappHovered] = useState(false);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [flippedMember, setFlippedMember] = useState<number | null>(null);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 160]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.08]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Preload hero image
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2000&auto=format&fit=crop';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);



  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      if (res.ok) {
        setNewsletterSubmitted(true);
        setNewsletterEmail('');
      }
    } catch (err) {
      console.error('Newsletter error:', err);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const sectionIds: Record<string, string> = {
    Home: 'hero',
    Ceremonies: 'services',
    Destinations: 'destinations',
    'Our Story': 'about',
    Gallery: 'gallery',
  };

  return (
    <div className="min-h-screen bg-[#0D0608] selection:bg-[#731945]/40 selection:text-[#F5EDE7] overflow-x-hidden w-full max-w-[100vw]">
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

      {/* ═══ A. NAVBAR ═══ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-6'
      }`}>
        <div className={`mx-6 lg:mx-14 flex items-center justify-between ${
          scrolled ? 'liquid-glass rounded-2xl px-6 py-3' : ''
        }`}>
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <img src="/images/logo-mark.png" alt="Soul Mandal" className="h-11 sm:h-14 w-auto" />
            <img src="/images/logo-text.png" alt="Soul Mandal" className="h-7 sm:h-9 w-auto" />
          </div>

          {/* Center nav — desktop */}
          <div className="hidden lg:flex items-center rounded-full px-2 py-1.5 bg-[#1A1114]/80 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(237,202,63,0.08)] border border-[#731945]/30">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => scrollToSection(sectionIds[link])}
                className="font-body text-sm text-[#D4B896] hover:text-[#EDCA3F] transition-colors duration-300 px-4 py-2"
              >
                {link}
              </button>
            ))}
          </div>

          {/* Right CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollToSection('hero')}
              className="hidden md:flex items-center gap-2 bg-[#731945] text-[#F5EDE7] rounded-full px-5 py-2 font-body font-medium tracking-[0.12em] text-sm uppercase hover:bg-[#EDCA3F] hover:text-[#0D0608] transition-all duration-300"
            >
              Begin Your Story
              <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
            {/* Mobile hamburger */}
            <button
              className="lg:hidden text-[#F5EDE7] p-2"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-[60]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-[300px] z-[70] liquid-glass-strong p-8 flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <button
                className="self-end text-[#F5EDE7] mb-8"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-6 h-6" strokeWidth={1.5} />
              </button>
              {navLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => scrollToSection(sectionIds[link])}
                  className="font-heading italic text-2xl text-[#F5EDE7] hover:text-[#EDCA3F] transition-colors duration-300 py-3 text-left"
                >
                  {link}
                </button>
              ))}
              <button
                onClick={() => { scrollToSection('hero'); setMobileMenuOpen(false); }}
                className="mt-8 flex items-center gap-2 bg-[#731945] text-[#F5EDE7] rounded-full px-5 py-3 font-body font-medium tracking-[0.12em] text-sm uppercase hover:bg-[#EDCA3F] hover:text-[#0D0608] transition-all duration-300 justify-center"
              >
                Begin Your Story
                <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══ B. HERO ═══ */}
      <section id="hero" className="relative min-h-screen overflow-hidden">
        {/* Parallax image */}
        <motion.div
          className="absolute inset-0"
          style={{ y: heroY, scale: heroScale }}
        >
          <img
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2000&auto=format&fit=crop"
            alt="Luxury Indian Wedding"
            className="object-cover w-full h-full"
          />
        </motion.div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0608]/30 via-[#0D0608]/50 to-[#0D0608]" />

        {/* Ambient glow */}
        <div className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-[#731945] blur-[120px] md:blur-[160px] opacity-[0.18] top-1/3 left-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Content */}
        <motion.div
          className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-24 pb-20"
          style={{ opacity: heroOpacity }}
        >


          {/* H1 */}
          <BlurText
            text="Where Every Love Story Becomes Legend"
            className="font-heading italic tracking-tight text-[#F5EDE7] leading-[1.05] text-[clamp(2.2rem,7vw,6.5rem)] max-w-5xl"
          />

          {/* Subtitle */}
          <motion.p
            className="font-body font-light text-[#D4B896] text-base sm:text-lg leading-relaxed max-w-xl mx-auto mt-4 sm:mt-6 px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.8 }}
          >
            From royal palaces in Rajasthan to beachfront resorts in Goa — Soul Mandal crafts celebrations that your family will retell for generations.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 w-full sm:w-auto px-2 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 1 }}
          >
            <button onClick={() => scrollToSection('talk-to-planner')} className="bg-[#731945] text-[#F5EDE7] rounded-full px-7 sm:px-8 py-3 sm:py-3.5 flex items-center justify-center gap-2.5 font-body font-medium tracking-[0.12em] text-sm uppercase hover:bg-[#EDCA3F] hover:text-[#0D0608] transition-all duration-300 cursor-pointer">
              Begin Your Story
              <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </motion.div>


        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6 text-[#EDCA3F]/50" strokeWidth={1.5} />
        </motion.div>
      </section>

      {/* ═══ C. STATS BAR ═══ */}
      <section className="liquid-glass py-14 px-6 lg:px-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 max-w-6xl mx-auto">
          {[
            { num: 150, suffix: '+', label: 'Weddings Planned' },
            { num: 300, suffix: '+', label: 'Happy Couples' },
            { num: 50, suffix: 'K+', label: 'Guests Hosted' },
            { num: 8, suffix: '', label: 'Dream Destinations' },
          ].map((stat, i) => (
            <div key={i} className={`text-center ${
              i < 3 ? 'lg:border-r lg:border-[#731945]/40' : ''
            }`}>
              <div className="font-heading italic text-[#EDCA3F] text-[clamp(2.8rem,5vw,4.5rem)]">
                <CountUp target={stat.num} suffix={stat.suffix} />
              </div>
              <p className="font-body uppercase tracking-[0.2em] text-xs text-[#D4B896] mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ D. MISSION STATEMENT ═══ */}
      <section className="min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] md:w-[600px] md:h-[300px] bg-[#731945] blur-[100px] md:blur-[160px] opacity-[0.15] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="w-px h-24 mx-auto mb-12 bg-gradient-to-b from-transparent via-[#EDCA3F]/60 to-transparent" />
          <SectionLabel text="Our Philosophy" />
          <BlurText
            text="We don't plan events. We craft the chapter your family will retell for generations. Every diya lit, every mandap adorned, every moment — is a brushstroke in your legacy."
            className="font-heading italic text-[clamp(1.6rem,3.5vw,2.8rem)] text-[#F5EDE7] leading-[1.3]"
          />

        </div>
      </section>

      {/* ═══ E. SERVICES GRID ═══ */}
      <section id="services" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-14 relative">
        <div className="absolute top-0 right-0 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-[#EDCA3F] blur-[100px] md:blur-[140px] opacity-[0.08] rounded-full pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <SectionLabel text="What We Do" />
          <BlurText
            text="Crafted for Every Ceremony"
            className="font-heading italic text-[clamp(2.2rem,5vw,4rem)] tracking-tight text-[#F5EDE7] mb-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, i) => {
              const Icon = service.icon;
              const isLast = i === services.length - 1;
              return (
                <ScrollReveal
                  key={i}
                  delay={i * 0.08}
                  className={isLast ? 'md:col-start-1 lg:col-start-2' : ''}
                >
                  <motion.div
                    className="liquid-glass-strong rounded-2xl p-7 h-full"
                    whileHover={{ y: -4, transition: { duration: 0.35, ease: EASE } }}
                  >
                    <div className="w-11 h-11 rounded-xl border border-[#731945]/40 bg-[#3B1426] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#EDCA3F]" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-heading text-xl text-[#F5EDE7] mt-5">{service.title}</h3>
                    <p className="font-body font-light text-sm text-[#D4B896] leading-relaxed mt-2">{service.desc}</p>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ F. FEATURED PROJECTS — BENTO GRID ═══ */}
      <section id="portfolio" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-14">
        <div className="max-w-6xl mx-auto">
          <SectionLabel text="Our Portfolio" />
          <BlurText
            text="Stories We've Told"
            className="font-heading italic text-[clamp(2.2rem,5vw,4rem)] tracking-tight text-[#F5EDE7] mb-4"
          />
          <ScrollReveal>
            <p className="font-body font-light text-[#D4B896] text-base leading-relaxed mb-12 max-w-xl">
              A glimpse into the celebrations we've had the honour of creating.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bentoProjects.map((project, i) => {
              const isFlipped = flippedCard === i;
              return (
                <ScrollReveal
                  key={i}
                  delay={i * 0.1}
                  className={`${project.span} ${i === 2 ? 'h-[360px] md:h-[380px]' : 'h-[360px] md:h-[520px]'}`}
                >
                  <div
                    className="relative w-full h-full cursor-pointer"
                    style={{ perspective: '1200px' }}
                    onClick={() => setFlippedCard(isFlipped ? null : i)}
                  >
                    {/* Flip container */}
                    <motion.div
                      className="relative w-full h-full"
                      style={{ transformStyle: 'preserve-3d' }}
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ duration: 0.7, ease: EASE }}
                    >
                      {/* FRONT — Photo */}
                      <div
                        className="absolute inset-0 rounded-3xl overflow-hidden group"
                        style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                      >
                        <img
                          src={project.img}
                          alt={project.title}
                          className="object-cover w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0608]/90 via-[#0D0608]/20 to-transparent" />
                        <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6">
                          <span className="liquid-glass inline-block rounded-full font-body text-xs uppercase tracking-[0.18em] text-[#EDCA3F] px-3 py-1 mb-3">
                            {project.location}
                          </span>
                          <h3 className="font-heading italic text-xl sm:text-2xl text-[#F5EDE7]">{project.title}</h3>
                          <p className="font-body text-sm text-[#D4B896]">{project.date}</p>
                        </div>
                        {/* Tap hint */}
                        <div className="absolute top-4 right-4 rounded-full bg-[#731945]/60 backdrop-blur-sm px-3 py-1.5 flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                          <span className="font-body text-[10px] uppercase tracking-[0.15em] text-[#EDCA3F]">Tap to flip</span>
                        </div>
                      </div>

                      {/* BACK — Case Study */}
                      <div
                        className="absolute inset-0 rounded-3xl overflow-hidden liquid-glass-strong"
                        style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        <div className="h-full overflow-y-auto p-5 sm:p-7 flex flex-col scrollbar-hide">
                          {/* Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <span className="font-body text-[10px] uppercase tracking-[0.2em] text-[#C4843B]">{project.location} · {project.date}</span>
                              <h3 className="font-heading italic text-xl sm:text-2xl text-[#F5EDE7] mt-1">{project.title}</h3>
                            </div>
                            <span className="rounded-full bg-[#3B1426] border border-[#731945]/40 px-3 py-1 font-body text-[10px] uppercase tracking-[0.15em] text-[#EDCA3F] whitespace-nowrap">
                              {project.guests}
                            </span>
                          </div>
                          {/* Divider */}
                          <div className="w-12 h-px bg-gradient-to-r from-[#EDCA3F]/60 to-transparent mb-4" />
                          {/* Summary */}
                          <p className="font-body font-light text-sm text-[#D4B896] leading-relaxed mb-4">{project.summary}</p>
                          {/* Highlights */}
                          <p className="font-body text-xs uppercase tracking-[0.18em] text-[#EDCA3F] mb-3">✨ Highlights</p>
                          <ul className="space-y-2 mb-4">
                            {project.highlights.map((h, hi) => (
                              <li key={hi} className="flex items-start gap-2">
                                <span className="text-[#EDCA3F] mt-0.5 text-xs">→</span>
                                <span className="font-body font-light text-xs sm:text-sm text-[#D4B896] leading-relaxed">{h}</span>
                              </li>
                            ))}
                          </ul>
                          {/* Closing */}
                          <p className="font-heading italic text-sm text-[#F5EDE7]/80 leading-relaxed mt-auto">{project.closing}</p>
                          {/* Tap back hint */}
                          <div className="mt-4 text-center">
                            <span className="font-body text-[10px] uppercase tracking-[0.15em] text-[#C4843B]/60">Tap to flip back</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ G. DESTINATIONS ═══ */}
      <section id="destinations" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-14 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#731945]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#EDCA3F]/8 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <SectionLabel text="Dream Destinations" />
            <div className="mt-6">
              <BlurText
                text="Where Dreams Meet Destinations"
                className="text-4xl sm:text-5xl lg:text-6xl font-heading font-medium text-[#F5EDE7] leading-tight"
              />
            </div>
            <p className="mt-6 text-lg text-[#D4B896]/80 max-w-2xl mx-auto font-body">
              From royal palaces to serene lakesides, discover the perfect backdrop for your celebration of love.
            </p>
          </div>

          {/* Destinations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {destinations.map((destination, index) => (
              <ScrollReveal key={destination.name} delay={index * 0.1}>
                <motion.div
                  className="group relative rounded-2xl overflow-hidden cursor-pointer h-80 sm:h-96"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${destination.img})` }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0608] via-[#0D0608]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                  
                  {/* Liquid Glass Card Effect */}
                  <div className="absolute inset-0 liquid-glass opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Gold Accent Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#EDCA3F] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-[#EDCA3F]" />
                      <span className="text-sm font-body text-[#D4B896]/80 uppercase tracking-wider">Location</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-heading font-medium text-[#F5EDE7] group-hover:text-[#EDCA3F] transition-colors duration-300">
                      {destination.name}
                    </h3>
                    <motion.div 
                      className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      <span className="text-sm font-body text-[#C4843B]">Explore Venue</span>
                      <ArrowUpRight className="w-4 h-4 text-[#C4843B]" />
                    </motion.div>
                  </div>
                  
                  {/* Corner Decoration */}
                  <div className="absolute top-4 right-4 w-12 h-12 border border-[#EDCA3F]/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-45">
                    <Sparkles className="w-5 h-5 text-[#EDCA3F]/60" />
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <motion.button
              onClick={() => {
                const message = "Hi! I want to explore more wedding destinations";
                const whatsappUrl = `https://wa.me/917879742700?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
              }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full liquid-glass-strong text-[#F5EDE7] font-body font-medium hover:text-[#EDCA3F] transition-colors duration-300 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Explore All Destinations</span>
              <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* ═══ H. GALLERY ═══ */}
      <section id="gallery" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-14">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel text="Our Gallery" />
            <BlurText
              text="Moments We've Crafted"
              className="font-heading italic text-[clamp(2.2rem,5vw,4rem)] tracking-tight text-[#F5EDE7] mb-4"
            />
            <ScrollReveal>
              <p className="font-body font-light text-[#D4B896] text-base leading-relaxed max-w-xl mx-auto">
                Explore the vibrant ceremonies and timeless memories we've had the honour of creating.
              </p>
            </ScrollReveal>
          </div>

          {/* Tabs */}
          <ScrollReveal>
            <div className="flex flex-wrap gap-2 mb-10 justify-center">
              {galleryTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentSlide(0);
                  }}
                  className={`rounded-full px-5 py-2 font-body text-sm tracking-[0.1em] transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-[#731945] text-[#F5EDE7]'
                      : 'liquid-glass text-[#D4B896] hover:text-[#F5EDE7]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Gallery Slider */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${currentSlide}`}
                className="relative rounded-2xl overflow-hidden h-[400px] sm:h-[500px] md:h-[600px]"
                initial={{ opacity: 0, x: 50, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -50, filter: 'blur(8px)' }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <img
                  src={galleryImages[activeTab][currentSlide]}
                  alt={`${activeTab} ${currentSlide + 1}`}
                  className="object-cover w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                />
                {/* Gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0D0608]/80 to-transparent pointer-events-none" />
                
                {/* Image counter */}
                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                  <div className="liquid-glass-strong px-4 py-2 rounded-full">
                    <span className="text-[#EDCA3F] font-body font-medium">{currentSlide + 1}</span>
                    <span className="text-[#D4B896]/60 font-body mx-1">/</span>
                    <span className="text-[#D4B896]/80 font-body">{galleryImages[activeTab].length}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 sm:px-4 pointer-events-none">
              {/* Previous Button */}
              <motion.button
                onClick={() => setCurrentSlide(prev => prev === 0 ? galleryImages[activeTab].length - 1 : prev - 1)}
                className="pointer-events-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full liquid-glass-strong flex items-center justify-center text-[#F5EDE7] hover:text-[#EDCA3F] transition-colors duration-300 group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 group-hover:-translate-x-0.5 transition-transform duration-300" />
              </motion.button>

              {/* Next Button */}
              <motion.button
                onClick={() => setCurrentSlide(prev => prev === galleryImages[activeTab].length - 1 ? 0 : prev + 1)}
                className="pointer-events-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full liquid-glass-strong flex items-center justify-center text-[#F5EDE7] hover:text-[#EDCA3F] transition-colors duration-300 group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 group-hover:translate-x-0.5 transition-transform duration-300" />
              </motion.button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {galleryImages[activeTab].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentSlide === i 
                      ? 'bg-[#EDCA3F] w-6' 
                      : 'bg-[#D4B896]/30 hover:bg-[#D4B896]/50'
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ I. ABOUT SOUL MANDAL ═══ */}
      <section id="about" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-14 relative">
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-[#731945] blur-[100px] md:blur-[160px] opacity-[0.12] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          {/* About Soul Mandal */}
          <div className="text-center mb-20 sm:mb-28">
            <SectionLabel text="Our Story" />
            <BlurText
              text="About Soul Mandal"
              className="font-heading italic text-[clamp(2.2rem,5vw,4rem)] tracking-tight text-[#F5EDE7] mb-6"
            />
            <ScrollReveal>
              <p className="font-heading italic text-[clamp(1.1rem,2.5vw,1.5rem)] text-[#EDCA3F] leading-relaxed max-w-2xl mx-auto mb-8">
                Every soul has a story. We turn yours into an experience.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="font-body font-light leading-relaxed text-[#D4B896] text-base max-w-2xl mx-auto mb-5">
                At Soul Mandal, we believe events shouldn't just be seen, they should be felt. We don't just plan — we craft emotions, design atmospheres, and build memories that linger long after the lights go out.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="font-body font-light leading-relaxed text-[#D4B896] text-base max-w-2xl mx-auto">
                Rooted in trust, inspired by stories, and driven by detail, Soul Mandal is more than a name — it's a promise to hold your story with care, elevate it with creativity, and deliver it with soul.
              </p>
            </ScrollReveal>
          </div>

          {/* Meet Our Core Team */}
          <div className="text-center mb-12">
            <SectionLabel text="The Team" />
            <BlurText
              text="Meet Our Core Team"
              className="font-heading italic text-[clamp(2.2rem,5vw,4rem)] tracking-tight text-[#F5EDE7] mb-4"
            />
            <ScrollReveal>
              <p className="font-body font-light text-[#D4B896] text-base leading-relaxed max-w-xl mx-auto">
                The minds and hearts behind the magic. We are artisans of atmosphere, dedicated to perfection.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {teamMembers.map((member, i) => {
              const isMemberFlipped = flippedMember === i;
              return (
                <ScrollReveal key={i} delay={i * 0.08}>
                  <div
                    className="cursor-pointer h-[220px]"
                    style={{ perspective: '1000px' }}
                    onClick={() => setFlippedMember(isMemberFlipped ? null : i)}
                  >
                    <motion.div
                      className="relative w-full h-full"
                      style={{ transformStyle: 'preserve-3d' }}
                      animate={{ rotateY: isMemberFlipped ? 180 : 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                    >
                      {/* FRONT — Name & Role */}
                      <div
                        className="absolute inset-0 liquid-glass-strong rounded-2xl p-6 flex flex-col items-center justify-center text-center"
                        style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                      >
                        <div className="w-16 h-16 rounded-full border border-[#731945]/50 bg-[#3B1426] flex items-center justify-center mb-4">
                          <span className="font-heading italic text-[#EDCA3F] text-xl">{member.initials}</span>
                        </div>
                        <h3 className="font-heading italic text-xl text-[#F5EDE7]">{member.name}</h3>
                        <p className="font-body uppercase tracking-[0.18em] text-[10px] text-[#C4843B] mt-1.5">{member.role}</p>
                        <p className="font-body text-[10px] text-[#D4B896]/40 uppercase tracking-[0.15em] mt-3">Tap to know more</p>
                      </div>

                      {/* BACK — Description */}
                      <div
                        className="absolute inset-0 liquid-glass-strong rounded-2xl p-6 flex flex-col items-center justify-center text-center"
                        style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        <p className="font-body uppercase tracking-[0.18em] text-[10px] text-[#EDCA3F] mb-3">{member.name}</p>
                        <div className="w-8 h-px bg-gradient-to-r from-transparent via-[#EDCA3F]/40 to-transparent mx-auto mb-4" />
                        <p className="font-body font-light text-sm text-[#D4B896] leading-relaxed">{member.desc}</p>
                        <p className="font-body text-[10px] text-[#D4B896]/40 uppercase tracking-[0.15em] mt-4">Tap to flip back</p>
                      </div>
                    </motion.div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ J. TESTIMONIALS ═══ */}
      <section className="py-16 sm:py-24 overflow-hidden">
        <div className="px-6 lg:px-14 max-w-6xl mx-auto mb-12">
          <SectionLabel text="Testimonials" />
          <BlurText
            text="Straight From the Heart"
            className="font-heading italic text-[clamp(2.2rem,5vw,4rem)] tracking-tight text-[#F5EDE7]"
          />
        </div>

        {/* Row 1 — scrolls left */}
        <div className="mb-5 overflow-hidden group">
          <div className="flex gap-4 sm:gap-5 w-max animate-scroll-left hover:[animation-play-state:paused]">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="liquid-glass-strong rounded-2xl p-5 sm:p-7 min-w-[280px] sm:min-w-[340px] max-w-[320px] sm:max-w-[380px] flex-shrink-0">
                <span className="font-heading text-4xl sm:text-5xl text-[#EDCA3F]/40 leading-none block mb-2">"</span>
                <p className="font-heading italic text-base sm:text-lg text-[#F5EDE7] leading-relaxed">{t.quote}</p>
                <p className="font-body font-medium text-sm text-[#EDCA3F] mt-4 sm:mt-5">{t.name}</p>
                <p className="font-body text-xs text-[#D4B896]">{t.location}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="overflow-hidden group">
          <div className="flex gap-4 sm:gap-5 w-max animate-scroll-right hover:[animation-play-state:paused]">
            {[...testimonials.slice(3), ...testimonials.slice(0, 3), ...testimonials.slice(3), ...testimonials.slice(0, 3)].map((t, i) => (
              <div key={i} className="liquid-glass-strong rounded-2xl p-5 sm:p-7 min-w-[280px] sm:min-w-[340px] max-w-[320px] sm:max-w-[380px] flex-shrink-0">
                <span className="font-heading text-4xl sm:text-5xl text-[#EDCA3F]/40 leading-none block mb-2">"</span>
                <p className="font-heading italic text-base sm:text-lg text-[#F5EDE7] leading-relaxed">{t.quote}</p>
                <p className="font-body font-medium text-sm text-[#EDCA3F] mt-4 sm:mt-5">{t.name}</p>
                <p className="font-body text-xs text-[#D4B896]">{t.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TALK TO A PLANNER ═══ */}
      <section id="talk-to-planner" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-14 relative">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-[#EDCA3F] blur-[100px] md:blur-[140px] opacity-[0.06] rounded-full pointer-events-none" />
        <div className="max-w-2xl mx-auto relative z-10">
          <SectionLabel text="Get In Touch" />
          <BlurText
            text="Talk to a Planner"
            className="font-heading italic text-[clamp(2.2rem,5vw,4rem)] tracking-tight text-[#F5EDE7] mb-4"
          />
          <ScrollReveal>
            <p className="font-body font-light text-[#D4B896] text-base leading-relaxed mb-10 max-w-xl">
              Tell us a little about your dream wedding and we'll get back to you on WhatsApp within 24 hours.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="liquid-glass-strong rounded-2xl p-5 sm:p-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const message = `Hello Soul Mandal! 👋\nI'd like to talk to a planner.\n\nName: ${plannerForm.name}\nPhone: ${plannerForm.phone}\nBudget: ${plannerForm.budget}\nDestination: ${plannerForm.destination}\n\nPlease get in touch with me.`;
                  const whatsappUrl = `https://wa.me/917879742700?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="space-y-4"
              >
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={plannerForm.name}
                  onChange={(e) => setPlannerForm({ ...plannerForm, name: e.target.value })}
                  className="w-full bg-[#3B1426]/60 border border-[#731945]/30 text-[#F5EDE7] placeholder-[#D4B896]/50 rounded-xl p-3.5 focus:border-[#EDCA3F]/60 focus:outline-none font-body text-sm"
                  required
                />
                <input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={plannerForm.phone}
                  onChange={(e) => setPlannerForm({ ...plannerForm, phone: e.target.value })}
                  className="w-full bg-[#3B1426]/60 border border-[#731945]/30 text-[#F5EDE7] placeholder-[#D4B896]/50 rounded-xl p-3.5 focus:border-[#EDCA3F]/60 focus:outline-none font-body text-sm"
                  required
                />
                <div className="relative">
                  <select
                    value={plannerForm.budget}
                    onChange={(e) => setPlannerForm({ ...plannerForm, budget: e.target.value })}
                    className={`w-full bg-[#3B1426]/60 border border-[#731945]/30 rounded-xl p-3.5 focus:border-[#EDCA3F]/60 focus:outline-none font-body text-sm appearance-none cursor-pointer ${
                      plannerForm.budget ? 'text-[#F5EDE7]' : 'text-[#D4B896]/50'
                    }`}
                    required
                  >
                    <option value="" disabled>Select Your Budget</option>
                    <option value="20 – 30 Lakh">20 – 30 Lakh</option>
                    <option value="30 – 50 Lakh">30 – 50 Lakh</option>
                    <option value="50 – 80 Lakh">50 – 80 Lakh</option>
                    <option value="80 – 100 Lakh">80 – 100 Lakh</option>
                    <option value="1 Crore+">1 Crore+</option>
                    <option value="Let's Discuss">Let's Discuss</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4B896]/50 pointer-events-none" strokeWidth={1.5} />
                </div>
                <div className="relative">
                  <select
                    value={plannerForm.destination}
                    onChange={(e) => setPlannerForm({ ...plannerForm, destination: e.target.value })}
                    className={`w-full bg-[#3B1426]/60 border border-[#731945]/30 rounded-xl p-3.5 focus:border-[#EDCA3F]/60 focus:outline-none font-body text-sm appearance-none cursor-pointer ${
                      plannerForm.destination ? 'text-[#F5EDE7]' : 'text-[#D4B896]/50'
                    }`}
                    required
                  >
                    <option value="" disabled>Select Destination</option>
                    <option value="Rajasthan (Jaipur / Udaipur / Jodhpur)">Rajasthan (Jaipur / Udaipur / Jodhpur)</option>
                    <option value="Madhya Pradesh (Indore / Bhopal / Ujjain)">Madhya Pradesh (Indore / Bhopal / Ujjain)</option>
                    <option value="Goa">Goa</option>
                    <option value="Mumbai / Maharashtra">Mumbai / Maharashtra</option>
                    <option value="Delhi / NCR">Delhi / NCR</option>

                    <option value="Other / Surprise Me">Other / Surprise Me</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4B896]/50 pointer-events-none" strokeWidth={1.5} />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#731945] text-[#F5EDE7] rounded-xl py-3.5 flex items-center justify-center gap-2.5 font-body font-medium tracking-[0.12em] text-sm uppercase hover:bg-[#EDCA3F] hover:text-[#0D0608] transition-all duration-300"
                >
                  Send on WhatsApp
                  <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ K. FAQ ═══ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-14 relative">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-[#731945] blur-[100px] md:blur-[160px] opacity-[0.12] rounded-full pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <SectionLabel text="FAQ" />
          <BlurText
            text="Common Inquiries"
            className="font-heading italic text-[clamp(2.2rem,5vw,4rem)] tracking-tight text-[#F5EDE7] mb-12"
          />
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="liquid-glass rounded-2xl overflow-hidden">
                <button
                  className="w-full flex justify-between items-center p-6 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-heading text-lg text-[#F5EDE7] pr-4">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <ChevronDown className="w-5 h-5 text-[#EDCA3F] flex-shrink-0" strokeWidth={1.5} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                    >
                      <div className="px-6 pb-6 font-body font-light text-sm text-[#D4B896] leading-loose">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ L. FOOTER ═══ */}
      <footer className="border-t border-[#731945]/30">
        <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-14 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Col 1 — Brand */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <img src="/images/logo-mark.png" alt="Soul Mandal" className="h-10 w-auto" />
                <img src="/images/logo-text.png" alt="Soul Mandal" className="h-7 w-auto" />
              </div>
              <p className="font-heading italic text-[#D4B896] text-base mt-2">Your Story. Our Soul.</p>
              <div className="mt-6 space-y-3">
                <a href="tel:+917879742700" className="flex items-center gap-2 font-body text-sm text-[#D4B896] hover:text-[#EDCA3F] transition-colors">
                  <Phone className="w-4 h-4" strokeWidth={1.5} />
                  +91 78797 42700
                </a>
                <a href="tel:+4407944603691" className="flex items-center gap-2 font-body text-sm text-[#D4B896] hover:text-[#EDCA3F] transition-colors">
                  <Phone className="w-4 h-4" strokeWidth={1.5} />
                  +44 079446 03691
                </a>
                <a href="mailto:info@soulmandal.com" className="flex items-center gap-2 font-body text-sm text-[#D4B896] hover:text-[#EDCA3F] transition-colors">
                  <Mail className="w-4 h-4" strokeWidth={1.5} />
                  info@soulmandal.com
                </a>
              </div>
            </div>

            {/* Col 2 — Ceremonies */}
            <div>
              <h4 className="font-body font-medium text-sm text-[#F5EDE7] uppercase tracking-[0.15em] mb-5">Ceremonies</h4>
              {['Haldi', 'Mehandi', 'Sangeet', 'Engagement', 'Reception'].map((item) => (
                <button
                  key={item}
                  onClick={() => { setActiveTab(item); scrollToSection('gallery'); }}
                  className="block font-body text-sm text-[#D4B896] hover:text-[#EDCA3F] transition-colors duration-300 py-1.5"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Col 3 — Explore */}
            <div>
              <h4 className="font-body font-medium text-sm text-[#F5EDE7] uppercase tracking-[0.15em] mb-5">Explore</h4>
              {['Destinations', 'Services', 'Projects', 'Our Story', 'Gallery'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(
                    item === 'Services' ? 'services' :
                    item === 'Projects' ? 'services' :
                    item === 'Our Story' ? 'about' :
                    item === 'Gallery' ? 'gallery' :
                    item.toLowerCase()
                  )}
                  className="block font-body text-sm text-[#D4B896] hover:text-[#EDCA3F] transition-colors duration-300 py-1.5"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Col 4 — Connect */}
            <div>
              <h4 className="font-body font-medium text-sm text-[#F5EDE7] uppercase tracking-[0.15em] mb-5">Connect</h4>
              <a href="https://www.instagram.com/soulmandal" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-body text-sm text-[#D4B896] hover:text-[#EDCA3F] transition-colors duration-300 py-1.5">
                <Instagram className="w-4 h-4" strokeWidth={1.5} />
                @soulmandal
              </a>
              <a href="https://x.com/Soul_Mandal" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-body text-sm text-[#D4B896] hover:text-[#EDCA3F] transition-colors duration-300 py-1.5">
                <Twitter className="w-4 h-4" strokeWidth={1.5} />
                @Soul_Mandal
              </a>
              <div className="mt-6">
                {newsletterSubmitted ? (
                  <p className="font-body text-sm text-[#EDCA3F]">Subscribed! ✦</p>
                ) : (
                  <form onSubmit={handleNewsletter} className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Your email address"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="liquid-glass rounded-xl px-4 py-2.5 text-sm font-body text-[#F5EDE7] placeholder-[#D4B896]/50 focus:outline-none flex-1 min-w-0"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-[#731945] text-[#F5EDE7] rounded-xl px-4 py-2.5 font-body text-sm font-medium hover:bg-[#EDCA3F] hover:text-[#0D0608] transition-all duration-300"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-[#731945]/20 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-body text-xs text-[#D4B896]/50">
              © 2025 Soul Mandal. All rights reserved.
            </p>
            <p className="font-heading italic text-xs text-[#731945]/60">
              Crafted with soul in Indore, India
            </p>
          </div>
        </div>
      </footer>
      {/* ═══ WHATSAPP FLOATING BUTTON ═══ */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center">
        <AnimatePresence>
          {whatsappHovered && (
            <motion.div
              className="mr-3 bg-[#25D366] text-white font-body text-xs px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2, ease: EASE }}
            >
              Chat on WhatsApp
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => window.open('https://wa.me/917879742700', '_blank')}
          onMouseEnter={() => setWhatsappHovered(true)}
          onMouseLeave={() => setWhatsappHovered(false)}
          className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:scale-110 hover:brightness-105 transition-all duration-300"
          aria-label="Chat on WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
