export type NavigationItem = {
  id: string;
  href: string;
  label: string;
  labelUr: string;
  visible: boolean;
  newTab: boolean;
};

export const defaultNavigationItems: NavigationItem[] = [
  {
    id: 'home',
    href: '/',
    label: 'Home',
    labelUr: 'ابتدا',
    visible: true,
    newTab: false,
  },
  {
    id: 'profile',
    href: '/profile',
    label: 'About Me',
    labelUr: 'میرے بارے میں',
    visible: true,
    newTab: false,
  },
  {
    id: 'services',
    href: '/services',
    label: 'Services & trainings',
    labelUr: 'خدمات و تربیت',
    visible: true,
    newTab: false,
  },
  {
    id: 'research',
    href: '/research',
    label: 'Research & projects',
    labelUr: 'تحقیق و منصوبے',
    visible: true,
    newTab: false,
  },
  {
    id: 'publications',
    href: '/publications',
    label: 'Resources',
    labelUr: 'وسائل',
    visible: true,
    newTab: false,
  },
  {
    id: 'test-survey',
    href: '/test-and-survey',
    label: 'Test and Survey',
    labelUr: 'ٹیسٹ اور سروے',
    visible: true,
    newTab: false,
  },
  {
    id: 'contact',
    href: '/contact',
    label: 'Contact',
    labelUr: 'رابطہ',
    visible: true,
    newTab: false,
  },
];

export const navThemes = [
  ['blue', 'Ocean blue'],
  ['black', 'Black ribbon'],
  ['silver', 'Soft silver'],
  ['green', 'Fresh green'],
  ['orange', 'Orange & green'],
  ['pink', 'Rose pink'],
  ['brown', 'Warm brown'],
] as const;

export const navDesigns = [
  [
    'capsule',
    'Satin capsule',
    'A smooth sliding capsule with a soft layered finish.',
  ],
  [
    'editorial',
    'Editorial rail',
    'A refined accent rail with generous typographic rhythm.',
  ],
  [
    'aurora',
    'Aurora glass',
    'A multicolour glass panel with a moving luminous tab.',
  ],
  [
    'minimal',
    'Minimal underline',
    'Clean typography and a quiet active line.',
  ],
  [
    'pill',
    'Rounded pills',
    'Soft tabs with a clear selected page.',
  ],
  [
    'floating',
    'Floating bar',
    'A raised navigation panel with breathing room.',
  ],
  [
    'glass',
    'Frosted glass',
    'A translucent panel with a subtle border.',
  ],
  [
    'outline',
    'Outline tabs',
    'Individual outlined links with a solid active tab.',
  ],
  [
    'solid',
    'Solid colour',
    'A bold colour band with contrasting selection.',
  ],
  [
    'gradient',
    'Classic gradient',
    'The colourful finish inspired by your reference.',
  ],
] as const;

export const navigationColourFields = [
  ['Menu — Normal', [
    ['Background', 'MenuBackground'],
    ['Text', 'MenuText'],
  ]],
  ['Menu — Hover', [
    ['Background', 'MenuHoverBackground'],
    ['Text', 'MenuHoverText'],
  ]],
  ['Menu — Active page', [
    ['Background', 'MenuActiveBackground'],
    ['Text', 'MenuActiveText'],
  ]],
  ['My Account — Normal', [
    ['Background', 'AccountBackground'],
    ['Text', 'AccountText'],
  ]],
  ['My Account — Hover', [
    ['Background', 'AccountHoverBackground'],
    ['Text', 'AccountHoverText'],
  ]],
] as const;

export const navigationColourDefaults = {
  navLightMenuBackground: '#ffffff',
  navLightMenuText: '#183c39',
  navLightMenuHoverBackground: '#e1eee9',
  navLightMenuHoverText: '#123d32',
  navLightMenuActiveBackground: '#183c39',
  navLightMenuActiveText: '#ffffff',
  navLightAccountBackground: '#183c39',
  navLightAccountText: '#ffffff',
  navLightAccountHoverBackground: '#286457',
  navLightAccountHoverText: '#ffffff',

  navDarkMenuBackground: '#172321',
  navDarkMenuText: '#edf5f1',
  navDarkMenuHoverBackground: '#304b43',
  navDarkMenuHoverText: '#ffffff',
  navDarkMenuActiveBackground: '#99d9bd',
  navDarkMenuActiveText: '#10251c',
  navDarkAccountBackground: '#99d9bd',
  navDarkAccountText: '#10251c',
  navDarkAccountHoverBackground: '#b9ebd4',
  navDarkAccountHoverText: '#10251c',
};

function navigationColourOptions(input: any) {
  const source = input ?? {};
  const result: Record<string, string> = {};

  for (const [key, fallback] of Object.entries(
    navigationColourDefaults
  )) {
    result[key] =
      typeof source[key] === 'string' &&
      /^#[a-f\d]{6}$/i.test(source[key])
        ? source[key]
        : fallback;
  }

  return result;
}

function navigationColourStyle(input: any) {
  const values = navigationColourOptions(input);
  const styles: Record<string, string> = {};

  for (const mode of ['Light', 'Dark']) {
    for (const [, fields] of navigationColourFields) {
      for (const [, suffix] of fields) {
        styles[`--nav-${mode.toLowerCase()}-${suffix}`] =
          values[`nav${mode}${suffix}`];
      }
    }
  }

  return styles;
}

export const navigationDefaults = {
  ...navigationColourDefaults,
  navLabelsV2: false,
  navUseThemeColors: true,
  navWidth: 900,
  navShowMenuSocial: true,
  navSurveyConfigured: false,
  navTheme: 'blue',
  navCorners: 'rounded',
  navEffect: 'contrast',
  navFont: 'sans',
  navSticky: true,
  navDesign: 'minimal',
  navLayout: 'stacked',
  navAlign: 'center',
  navFontSize: 13,
  navItemPadding: 18,
  navBarHeight: 48,
  navRadius: 14,
  navShadow: true,
  navBackground: '#ffffff',
  navText: '#183c39',
  navActiveBackground: '#183c39',
  navActiveText: '#ffffff',
  navHoverText: '#ffffff',
  navAccountBackground: '#183c39',
  navAccountText: '#ffffff',
  navAccountHoverBackground: '#245c57',
  navAccountHoverText: '#ffffff',
  navBorder: '#dce2d7',
  navItemsJson: JSON.stringify(defaultNavigationItems),
  navMonogram: 'AW',
  navLogo: '',
  navShowMark: true,
  navSubtitle: 'EDUCATION · MENTORSHIP · RESEARCH',
  navSubtitleUr: 'تعلیم · تربیت · تحقیق',
  navShowSubtitle: false,
  navCtaAction: 'account',
  navCtaLabel: 'Connect',
  navCtaLabelUr: 'کنیکٹ کریں',
  navCtaHref: '/contact',
  navShowCTA: true,
};

const trim = (value: any, max = 200): string =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

const choice = (
  value: any,
  values: readonly string[],
  fallback: string,
): string => (values.includes(value) ? value : fallback);

const number = (
  value: any,
  min: number,
  max: number,
  fallback: number,
): number =>
  value !== null &&
  value !== undefined &&
  value !== '' &&
  Number.isFinite(Number(value))
    ? Math.min(max, Math.max(min, Number(value)))
    : fallback;

const color = (value: any, fallback: string): string =>
  typeof value === 'string' && /^#[a-f\d]{6}$/i.test(value)
    ? value
    : fallback;

export function navigationURL(value: any): string {
  const text = trim(value, 1000);

  if (!text || /[\\\u0000-\u0020]/.test(text)) {
    return '';
  }

  try {
    const url = new URL(text, 'https://site.local');

    if (
      text.startsWith('/') &&
      !text.startsWith('//') &&
      url.origin === 'https://site.local'
    ) {
      return url.pathname + url.search + url.hash;
    }

    if (
      url.protocol === 'https:' &&
      !url.username &&
      !url.password
    ) {
      return url.href;
    }
  } catch {
    return '';
  }

  return '';
}

export function navigationItems(settings: any): NavigationItem[] {
  let raw: any;

  try {
    raw = JSON.parse(settings.navItemsJson);
  } catch {
    return defaultNavigationItems.map((item) => ({ ...item }));
  }

  if (!Array.isArray(raw)) {
    return defaultNavigationItems.map((item) => ({ ...item }));
  }

  const ids = new Set<string>();

  if (
    !settings.navSurveyConfigured &&
    raw.length < 12 &&
    !raw.some((item: any) => item?.href === '/test-and-survey')
  ) {
    const surveyItem = defaultNavigationItems.find(
      (item) => item.id === 'test-survey',
    )!;

    const contactIndex = raw.findIndex(
      (item: any) => item?.href === '/contact',
    );

    raw.splice(
      contactIndex < 0 ? raw.length : contactIndex,
      0,
      { ...surveyItem },
    );
  }

  return raw.slice(0, 12).flatMap((item: any): NavigationItem[] => {
    if (!item || typeof item !== 'object') {
      return [];
    }

    const id = trim(item.id, 100);
    const href = navigationURL(item.href);

    let label = trim(item.label, 60);

    if (
      !settings.navLabelsV2 &&
      item.label === 'Profile' &&
      href === '/profile'
    ) {
      label = 'About Me';
    }

    if (
      item.label === 'Publications' &&
      href === '/publications'
    ) {
      label = 'Resources';
    }

    if (!id || !href || !label || ids.has(id)) {
      return [];
    }

    ids.add(id);

    return [
      {
        id,
        href,
        label,
        labelUr:
          item.label === 'Publications' &&
          href === '/publications'
            ? 'وسائل'
            : trim(item.labelUr, 100),
        visible: item.visible !== false,
        newTab: item.newTab === true,
      },
    ];
  });
}

export function navigationError(settings: any): string {
  if (settings.navItemsJson === undefined) {
    return '';
  }

  let items: any;

  try {
    items = JSON.parse(settings.navItemsJson);
  } catch {
    return 'Menu data is invalid. Please reset the menu and try again.';
  }

  if (!Array.isArray(items) || items.length > 12) {
    return 'Use up to 12 menu items.';
  }

  const normalized = navigationItems({
    ...settings,
    navSurveyConfigured: true,
  });

  if (normalized.length !== items.length) {
    return 'Each menu item needs a unique ID, a name and a valid internal or HTTPS link.';
  }

  if (!normalized.some((item) => item.visible)) {
    return 'Keep at least one menu item visible.';
  }

  return '';
}

export function navigationOptions(input: any) {
  const settings = {
    ...navigationDefaults,
    ...input,
  };

  const logo = trim(settings.navLogo, 1000);
  const externalLogo = navigationURL(logo);

  return {
    ...navigationColourOptions(input),
    navLabelsV2: true,
    navUseThemeColors: settings.navUseThemeColors !== false,
    navShowMenuSocial: settings.navShowMenuSocial !== false,
    navSurveyConfigured: true,

    navWidth: number(settings.navWidth, 100, 1600, 900),

    navTheme: choice(
      settings.navTheme,
      navThemes.map((theme) => theme[0]),
      'blue',
    ),

    navCorners: choice(
      settings.navCorners,
      ['rounded', 'square', 'ribbon'],
      'rounded',
    ),

    navEffect: choice(
      settings.navEffect,
      ['contrast', 'underline', 'glow'],
      'contrast',
    ),

    navFont: choice(
      settings.navFont,
      ['sans', 'serif'],
      'sans',
    ),

    navSticky: settings.navSticky !== false,

    navDesign: choice(
      settings.navDesign,
      navDesigns.map((design) => design[0]),
      'minimal',
    ),

    navLayout: choice(
      settings.navLayout,
      ['stacked', 'inline'],
      'stacked',
    ),

    navAlign: choice(
      settings.navAlign,
      ['start', 'center', 'end'],
      'center',
    ),

    navFontSize: number(settings.navFontSize, 11, 18, 13),
    navItemPadding: number(settings.navItemPadding, 8, 30, 18),
    navBarHeight: number(settings.navBarHeight, 40, 70, 48),
    navRadius: number(settings.navRadius, 0, 30, 14),

    navShadow: settings.navShadow !== false,

    navBackground: color(settings.navBackground, '#ffffff'),
    navText: color(settings.navText, '#183c39'),

    navActiveBackground: color(
      settings.navActiveBackground,
      '#183c39',
    ),

    navActiveText: color(settings.navActiveText, '#ffffff'),

    navHoverText: color(settings.navHoverText, '#ffffff'),

    navAccountBackground: color(settings.navAccountBackground, '#183c39'),
    navAccountText: color(settings.navAccountText, '#ffffff'),
    navAccountHoverBackground: color(settings.navAccountHoverBackground, '#245c57'),
    navAccountHoverText: color(settings.navAccountHoverText, '#ffffff'),
    navBorder: color(settings.navBorder, '#dce2d7'),

    navItemsJson: JSON.stringify(navigationItems(settings)),

    navMonogram: trim(settings.navMonogram, 6) || 'AW',

    navLogo: /^\/api\/files\?id=[\w-]+$/.test(logo)
      ? logo
      : externalLogo.startsWith('https://')
        ? externalLogo
        : '',

    navShowMark: settings.navShowMark !== false,
    navSubtitle: trim(settings.navSubtitle, 100),
    navSubtitleUr: trim(settings.navSubtitleUr, 140),
    navShowSubtitle: settings.navShowSubtitle !== false,

    navCtaAction: choice(
      settings.navCtaAction,
      ['account', 'link'],
      'account',
    ),

    navCtaLabel:
      trim(settings.navCtaLabel, 50) || 'Let’s connect',

    navCtaLabelUr:
      trim(settings.navCtaLabelUr, 70) || 'رابطہ کریں',

    navCtaHref: navigationURL(settings.navCtaHref) || '/contact',
    navShowCTA: settings.navShowCTA !== false,
  };
}

export function navigationClass(settings: any): string {
  const options = navigationOptions(settings);

  return [
    'styled-nav',
    `nav-theme-${options.navTheme}`,
    `nav-corners-${options.navCorners}`,
    `nav-effect-${options.navEffect}`,
    `nav-font-${options.navFont}`,
    `nav-design-${options.navDesign}`,
    `nav-align-${options.navAlign}`,
    options.navShadow ? 'nav-has-shadow' : 'nav-no-shadow',
  ].join(' ');
}

export function navigationStyle(
  settings: any,
): Record<string, string> {
  const options = navigationOptions(settings);

  return {
    ...navigationColourStyle(settings),
    '--menu-width': `${options.navWidth}px`,

    '--menu-bg':
      settings.themeConfigured && options.navUseThemeColors
        ? 'var(--paper)'
        : options.navBackground,

    '--menu-text':
      settings.themeConfigured && options.navUseThemeColors
        ? 'var(--ink)'
        : options.navText,

    '--menu-active-bg':
      settings.themeConfigured && options.navUseThemeColors
        ? 'var(--primary)'
        : options.navActiveBackground,

    '--menu-active-text':
      settings.themeConfigured && options.navUseThemeColors
        ? 'var(--on-primary,#fff)'
        : options.navActiveText,

    '--menu-hover-text': options.navHoverText,

    '--account-bg': options.navAccountBackground,
    '--account-text': options.navAccountText,
    '--account-hover-bg': options.navAccountHoverBackground,
    '--account-hover-text': options.navAccountHoverText,
    '--menu-border': options.navBorder,
    '--menu-font-size': `${options.navFontSize}px`,
    '--menu-item-padding': `${options.navItemPadding}px`,
    '--menu-height': `${options.navBarHeight}px`,
    '--menu-radius': `${options.navRadius}px`,
  };
}