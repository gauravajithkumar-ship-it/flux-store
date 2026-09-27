import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, Menu, X, History, LogOut, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { gsap } from 'gsap';
import AnnouncementBar from './AnnouncementBar';

// Six primary destinations, fanned around the centred logo.
const primaryLinks = [
  { label: 'Products', to: '/products' },
  { label: 'Mobile', to: '/products?category=Mobile' },
  { label: 'Audio', to: '/products?category=Audio' },
  { label: 'TV', to: '/products?category=TV' },
  { label: 'Gift Cards', to: '/gift-cards' },
  { label: 'Contact', to: '/contact' },
];

// Folded away so every original destination stays reachable.
const moreLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Appliances', to: '/products?category=Washing%20Machine' },
  { label: 'B2B Enquiry', to: '/b2b-enquiry' },
];

const leftLinks = primaryLinks.slice(0, 3);
const rightLinks = primaryLinks.slice(3);

const EASE = [0.22, 1, 0.36, 1];

const Logo = () => (
  <Link to="/" className="group flex shrink-0 cursor-pointer items-center gap-2.5 sm:gap-3">
    <img
      src="/favicon-48x48.png"
      alt="Flux Logo"
      className="h-8 w-8 rounded-lg object-fit transition-transform duration-300 group-hover:scale-110 sm:h-9 sm:w-9"
    />
    <span className="text-lg font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-cyan-300 sm:text-xl">
      Flux
    </span>
  </Link>
);

// Self-contained so the desktop and mobile bars each own independent state.
const Actions = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const { user, isAuthenticated, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-4 text-white sm:gap-5">
      {isAuthenticated && (
        <Link
          to="/orders"
          aria-label="Order History"
          title="Order History"
          className="cursor-pointer py-1 text-gray-300 transition-colors duration-300 hover:text-cyan-300"
        >
          <History size={19} strokeWidth={1.5} />
        </Link>
      )}

      <button
        onClick={() => setIsCartOpen(true)}
        aria-label="Open cart"
        title="Cart"
        className="relative cursor-pointer py-1 text-gray-300 transition-colors duration-300 hover:text-cyan-300"
      >
        <ShoppingBag size={19} strokeWidth={1.5} />
        {cartCount > 0 && (
          <span className="absolute -right-1.5 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-[10px] font-bold text-[#0a0a0a]">
            {cartCount}
          </span>
        )}
      </button>

      {isAuthenticated && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Profile menu"
            aria-expanded={isOpen}
            title="Profile"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 transition-colors duration-300 hover:border-cyan-400/60 hover:bg-cyan-400/20 sm:h-9 sm:w-9"
          >
            <span className="text-xs font-bold uppercase text-cyan-300 sm:text-sm">
              {(user?.username || user?.full_name || 'U').slice(0, 1)}
            </span>
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="absolute right-0 top-full z-50 mt-3 w-48 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/95 shadow-2xl backdrop-blur-xl"
              >
                <div className="border-b border-white/10 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-white">
                    {user?.username || user?.full_name || 'Customer'}
                  </p>
                  <p className="truncate text-xs text-gray-400">{user?.email || 'Signed in'}</p>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-3 text-sm text-gray-300 transition-colors duration-300 hover:bg-white/5 hover:text-white"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const location = useLocation();
  const moreRef = useRef(null);

  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMoreOpen(false);
  }, [location.pathname]);

  // Close the More menu when clicking outside of it.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Circular pill hover reveal.
  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        if (!w || !h) return;

        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector('.pill-label');
        const white = pill.querySelector('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease: 'power3.out', overwrite: 'auto' }, 0);

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 2, ease: 'power3.out', overwrite: 'auto' }, 0);
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease: 'power3.out', overwrite: 'auto' }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    window.addEventListener('resize', layout);
    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    return () => window.removeEventListener('resize', layout);
  }, []);

  const handleEnter = (i) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease: 'power3.out',
      overwrite: 'auto'
    });
  };

  const handleLeave = (i) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease: 'power3.out',
      overwrite: 'auto'
    });
  };

  const renderLink = (link, index) => (
    <Link
      key={link.to}
      to={link.to}
      className="pill-nav-item px-6 py-3 text-sm font-medium text-gray-200 transition-colors duration-200"
      onMouseEnter={() => handleEnter(index)}
      onMouseLeave={() => handleLeave(index)}
    >
      <span className="hover-circle bg-cyan-400" ref={(el) => { circleRefs.current[index] = el; }} />
      <span className="label-stack">
        <span className="pill-label">{link.label}</span>
        <span className="pill-label-hover font-semibold text-[#0a0a0a]">{link.label}</span>
      </span>
    </Link>
  );

  return (
    <nav className={`fixed top-0 z-50 flex w-full flex-col transition-all duration-300 ${
      isScrolled
        ? 'border-b border-white/10 bg-[#0a0a0a]/80 shadow-lg shadow-black/30 backdrop-blur-xl'
        : 'bg-transparent'
    }`}>
      <AnnouncementBar />

      <div className={`transition-all duration-300 ${isScrolled ? 'py-3 sm:py-4' : 'py-4 sm:py-5'}`}>
        <style>{`
          .pill-nav-item {
            position: relative;
            overflow: hidden;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .hover-circle {
            position: absolute;
            left: 50%;
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
          }
          .label-stack {
            position: relative;
            display: block;
            z-index: 10;
            pointer-events: none;
          }
          .pill-label {
            display: block;
          }
          .pill-label-hover {
            position: absolute;
            left: 0;
            top: 0;
            display: block;
            white-space: nowrap;
          }
        `}</style>

        {/* ---------- Desktop: split around a centred logo ---------- */}
        <div className="relative mx-auto hidden max-w-7xl px-6 xl:block xl:px-12">
          <div className="flex items-center justify-between gap-4">
            <nav className="flex items-center gap-2">
              {leftLinks.map((link, i) => renderLink(link, i))}
            </nav>

            <div className="flex items-center gap-2">
              {rightLinks.map((link, i) => renderLink(link, i + leftLinks.length))}

              <div className="relative" ref={moreRef}>
                <button
                  onClick={() => setIsMoreOpen((prev) => !prev)}
                  aria-expanded={isMoreOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-1.5 px-6 py-3 text-sm font-medium text-gray-200 transition-colors duration-300 hover:text-cyan-300"
                >
                  More
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${isMoreOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {isMoreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.2, ease: EASE }}
                      className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-white/10 bg-[#0a0a0a]/95 p-1.5 shadow-2xl backdrop-blur-xl"
                    >
                      {moreLinks.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          className="block rounded-xl px-4 py-2.5 text-sm text-gray-300 transition-colors duration-300 hover:bg-white/5 hover:text-white"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <span className="mx-4 h-4 w-px bg-white/10" />

              <Actions />
            </div>
          </div>

          {/* Logo stays optically centred regardless of side widths */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="pointer-events-auto">
              <Logo />
            </div>
          </div>
        </div>

        {/* ---------- Compact bar ---------- */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 xl:hidden">
          <Logo />

          <div className="flex items-center gap-4 sm:gap-5">
            <Actions />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              className="cursor-pointer text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ---------- Mobile dropdown ---------- */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 top-full max-h-[calc(100vh-80px)] w-full overflow-y-auto border-t border-white/10 bg-[#0a0a0a]/95 px-4 py-6 shadow-2xl backdrop-blur-xl sm:px-6 xl:hidden">
            <div className="flex flex-col gap-1">
              {[...primaryLinks, ...moreLinks].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="rounded-xl px-3 py-3 text-base font-medium text-white transition-colors duration-300 hover:bg-white/5 hover:text-cyan-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
