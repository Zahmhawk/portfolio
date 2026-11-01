'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Globe, LogOut, Menu, X } from 'lucide-react';
import { useMovingIndicator } from './moving-indicator';
import {
  navigationClass,
  navigationItems,
  navigationOptions,
  navigationStyle,
} from '../lib/navigation';
import ThemeControls from './theme-controls';

type NavigationHeaderProps = {
  signedIn?: boolean;
  settings: any;
  page: string;
  ur: boolean;
  onLanguage: () => void;
};

const pagePaths: Record<string, string> = {
  home: '/',
  profile: '/profile',
  services: '/services',
  research: '/research',
  publications: '/publications',
  'test-survey': '/test-and-survey',
  contact: '/contact',
};

export default function NavigationHeader({
  settings: s,
  page,
  ur,
  onLanguage,
  signedIn = false,
}: NavigationHeaderProps) {
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const header = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  const n = navigationOptions(s);
  const items = navigationItems(n).filter((item) => item.visible);

  const indicator = useMovingIndicator(
    true,
    'a[aria-current="page"]',
    n.navDesign === 'minimal' || n.navDesign === 'editorial',
  );

  const navigationKey = JSON.stringify(n);

  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    };

    document.addEventListener('pointerdown', outside);

    return () => {
      document.removeEventListener('pointerdown', outside);
    };
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      header.current
        ?.querySelector<HTMLElement>(
          'nav a[aria-current="page"], nav a',
        )
        ?.focus();
    }
  }, [mobileOpen]);

  useEffect(() => {
    const element = header.current;
    if (!element) return;
    let frame = 0;
    let disposed = false;
    const numeric = (value: string) => parseFloat(value) || 0;
    const important = (node: HTMLElement, values: Record<string, string>) => {
      for (const [key, value] of Object.entries(values)) {
        node.style.setProperty(key, value, 'important');
      }
    };

    function measure() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (disposed || !element) return;
        const style = getComputedStyle(element);
        const innerWidth = element.clientWidth - numeric(style.paddingLeft) - numeric(style.paddingRight);
        // Always measure a separate DESKTOP header. Never measure links styled
        // by the current collapsed state, which caused refresh-dependent results.
        const probe = element.cloneNode(true) as HTMLElement;
        probe.dataset.collapsed = 'false';
        probe.classList.remove('mobile-nav-open');
        probe.classList.add('navigation-measurement');
        probe.setAttribute('aria-hidden', 'true');
        probe.inert = true;
        probe.removeAttribute('id');
        probe.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
        probe.querySelector('.public-menu-toggle')?.remove();
        probe.querySelector('.menu-glider')?.remove();
        important(probe, {
          position: 'fixed', inset: '0 auto auto 0', visibility: 'hidden',
          'pointer-events': 'none', width: 'max-content', 'max-width': 'none',
          'min-width': '0', height: 'auto', display: 'flex',
          'flex-direction': 'row', 'flex-wrap': 'nowrap', padding: '0',
          margin: '0', transform: 'none', transition: 'none',
        });
        const stage = probe.querySelector<HTMLElement>('.public-nav-stage');
        const nav = probe.querySelector<HTMLElement>('nav');
        const brand = probe.querySelector<HTMLElement>('.brand');
        const tools = probe.querySelector<HTMLElement>('.inline-header-tools');
        if (!stage || !nav || !brand || !tools) return;
        important(stage, {display: 'flex', position: 'static', width: 'max-content', 'max-width': 'none', flex: 'none', margin: '0'});
        important(nav, {display: 'flex', position: 'relative', width: 'max-content', 'min-width': 'max-content', 'max-width': 'none', height: 'auto', 'flex-direction': 'row', 'flex-wrap': 'nowrap', flex: 'none', transition: 'none'});
        important(brand, {width: 'max-content', 'max-width': 'none', flex: 'none'});
        important(tools, {width: 'max-content', 'max-width': 'none', flex: 'none'});
        element.parentElement?.appendChild(probe);
        if (!probe.isConnected) return;
        try {
          const headerGap = numeric(style.columnGap);
          const available = Math.max(0, Math.floor(innerWidth - brand.getBoundingClientRect().width - tools.getBoundingClientRect().width - headerGap * 2 - 8));
          const rawWidth = Number((n as any).navWidth);
          const preferred = Number.isFinite(rawWidth) ? Math.max(100, Math.min(1600, rawWidth)) : 900;
          // Width also controls density: a smaller value compacts the links.
          const baseScale = Math.max(0.65, Math.min(1.25, preferred / 900));
          const scales = [...new Set([baseScale, Math.min(baseScale, 0.85), Math.min(baseScale, 0.7)])];
          let natural = 0;
          let chosen: Record<string, string> = {};
          for (const scale of scales) {
            chosen = {
              '--fit-font': `${Math.max(11, Math.min(18, n.navFontSize * scale)).toFixed(2)}px`,
              '--fit-padding': `${Math.max(2, Math.min(30, n.navItemPadding * scale)).toFixed(2)}px`,
              '--fit-gap': `${Math.max(1, 3 * scale).toFixed(2)}px`,
              '--fit-account-font': `${Math.max(11, Math.min(13, n.navFontSize * scale)).toFixed(2)}px`,
              '--fit-account-padding': `${Math.max(5, 10 * scale).toFixed(2)}px`,
            };
            for (const [key, value] of Object.entries(chosen)) probe.style.setProperty(key, value);
            natural = Math.ceil(nav.getBoundingClientRect().width);
            if (natural <= Math.min(preferred, available)) break;
          }
          for (const [key, value] of Object.entries(chosen)) element.style.setProperty(key, value);
          const mobile = window.matchMedia('(max-width: 767px)').matches;
          setCollapsed(mobile || natural > available);
          element.style.setProperty('--resolved-menu-width', `${Math.max(0, Math.min(available, Math.max(natural, preferred)))}px`);
          element.style.setProperty('--public-header-height', `${Math.ceil(element.getBoundingClientRect().height)}px`);
        } finally {
          probe.remove();
        }
      });
    }
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    const brand = element.querySelector('.brand');
    const tools = element.querySelector('.inline-header-tools');
    if (brand) observer.observe(brand);
    if (tools) observer.observe(tools);
    element.addEventListener('load', measure, true);
    window.addEventListener('resize', measure);
    document.fonts?.addEventListener('loadingdone', measure);
    document.fonts?.ready.then(() => { if (!disposed) measure(); });
    measure();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      element.removeEventListener('load', measure, true);
      window.removeEventListener('resize', measure);
      document.fonts?.removeEventListener('loadingdone', measure);
    };
  }, [navigationKey, s.name, s.nameUr, ur, signedIn]);



  useEffect(() => {
    if (!collapsed) {
      setMobileOpen(false);
    }
  }, [collapsed]);

  useEffect(() => {
    if (!mobileOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const accountHref = signedIn
    ? '/account'
    : '/signin-with-chatgpt?return_to=%2Faccount';

  function remember() {
    try {
      sessionStorage.setItem(
        'portfolio-return-path',
        location.pathname + location.search + location.hash,
      );
    } catch {
      // Navigation still works when session storage is unavailable.
    }
  }

  return (
    <header
      ref={header}
      data-collapsed={collapsed ? 'true' : 'false'}
      data-nav-design={n.navDesign}
      style={navigationStyle(s) as CSSProperties}
      className={
        'header portfolio-header inline-site-header ' +
        (mobileOpen ? 'mobile-nav-open ' : '') +
        (n.navSticky ? 'nav-sticky' : '')
      }
      onKeyDown={(event) => {
        if (mobileOpen && event.key === 'Tab') {
          const nodes = Array.from(
            header.current?.querySelectorAll<HTMLElement>(
              'a[href], button:not(:disabled)',
            ) || [],
          ).filter((node) => node.getClientRects().length > 0);

          const first = nodes[0];
          const last = nodes[nodes.length - 1];

          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (
            !event.shiftKey &&
            document.activeElement === last
          ) {
            event.preventDefault();
            first?.focus();
          }
        }

        if (event.key === 'Escape') {
          setMobileOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <a className="brand" href="/">
        {n.navShowMark &&
          (n.navLogo ? (
            <img className="navbar-logo" src={n.navLogo} alt="" />
          ) : (
            <span className="monogram" aria-label={n.navMonogram}>
              <span className="monogram-letters">
                {n.navMonogram
                  .replace(/\s+/g, '')
                  .split('')
                  .map((letter, index) => (
                    <span key={index}>{letter}</span>
                  ))}
              </span>

              <span className="monogram-dot" aria-hidden="true">
                •
              </span>
            </span>
          ))}

        <span>
          {ur ? s.nameUr || s.name : s.name}

          {n.navShowSubtitle && (
            <small>
              {ur
                ? n.navSubtitleUr || n.navSubtitle
                : n.navSubtitle}
            </small>
          )}
        </span>
      </a>

      <div className="public-nav-stage">
        <nav
          id="public-navigation"
          className={'inline-site-links ' + navigationClass(n)}
          data-indicator-ready={
            indicator.position.ready ? 'true' : 'false'
          }
          aria-label={ur ? 'مرکزی مینیو' : 'Main navigation'}
          ref={(element) => {
            indicator.ref.current = element;
          }}
          onPointerMove={(event) => {
            const link = (event.target as Element).closest('a');
            if (link) indicator.move(link);
          }}
          onPointerLeave={() => indicator.reset()}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              indicator.reset();
            }
          }}
          onClick={() => setMobileOpen(false)}
        >
          <span
            aria-hidden="true"
            className={
              'menu-glider ' +
              (indicator.position.ready ? 'ready' : '')
            }
            style={
              {
                '--indicator-height':
                  `${indicator.position.height}px`,
                width: indicator.position.width,
                height: indicator.position.height,
                transform: `translate(${indicator.position.x}px,${indicator.position.y}px)`,
              } as CSSProperties
            }
          />

          {items.map((item) => (
            <a
              key={item.id}
              aria-current={
                item.href === pagePaths[page] ? 'page' : undefined
              }
              href={item.href}
              target={item.newTab ? '_blank' : undefined}
              rel={item.newTab ? 'noopener noreferrer' : undefined}
              onPointerEnter={(event) =>
                indicator.move(event.currentTarget)
              }
              onFocus={(event) =>
                indicator.move(event.currentTarget)
              }
            >
              {ur ? item.labelUr || item.label : item.label}
            </a>
          ))}

          <a
            href={accountHref}
            onClick={remember}
            target="_top"
            className="inline-account"
          >
            {ur ? 'میرا اکاؤنٹ' : 'My Account'}
          </a>

          {n.navShowCTA && n.navCtaAction === 'link' && (
            <a href={n.navCtaHref}>
              {ur ? n.navCtaLabelUr : n.navCtaLabel}
            </a>
          )}
        </nav>
      </div>

      <div className="inline-header-tools">
        <button
          type="button"
          className="language"
          onClick={onLanguage}
        >
          <Globe size={14} />
          {ur ? 'EN' : 'اردو'}
        </button>

        <ThemeControls ur={ur} compact />

        {signedIn && (
          <a
            className="header-logout"
            href="/signout-with-chatgpt?return_to=%2F"
            target="_top"
            aria-label="Logout"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </a>
        )}

        <button
          type="button"
          ref={trigger}
          className="public-menu-toggle icon-button"
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          aria-controls="public-navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((current) => !current)}
        >
          {mobileOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
    </header>
  );
}