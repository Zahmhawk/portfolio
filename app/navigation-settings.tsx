'use client';

import { useState, type ChangeEvent, type CSSProperties } from 'react';
import {
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Upload,
  X,
  RotateCcw,
} from 'lucide-react';

import { useMovingIndicator } from './moving-indicator';
import SmartSelect from './smart-select';
import {
  navigationColourFields,
  navigationColourDefaults,
} from '../lib/navigation';

import AutoUrdu from './admin/auto-urdu';

import {
  navigationClass,
  navigationStyle,
  navigationOptions,
  navigationDefaults,
  defaultNavigationItems,
  navThemes,
  navDesigns,
  type NavigationItem,
} from '../lib/navigation';

type NavigationSettingsProps = {
  value: any;
  onChange: (key: string, value: any) => void;
  onUploading?: (busy: boolean) => void;
};

export default function NavigationSettings({
  value,
  onChange,
  onUploading,
}: NavigationSettingsProps) {
  const n = navigationOptions(value);

  const indicator = useMovingIndicator(
    true,
    'button.active',
    n.navDesign === 'minimal' || n.navDesign === 'editorial',
  );

  const [previewUr, setPreviewUr] = useState(false);
  const [active, setActive] = useState('profile');

  let items: NavigationItem[];

  try {
    items = JSON.parse(n.navItemsJson);

    if (!Array.isArray(items)) {
      throw new Error('Invalid menu');
    }
  } catch {
    items = defaultNavigationItems.map((item) => ({ ...item }));
  }

  function updateItems(next: NavigationItem[]) {
    onChange('navLabelsV2', true);
    onChange('navItemsJson', JSON.stringify(next));
  }

  function updateItem<K extends keyof NavigationItem>(
    id: string,
    key: K,
    nextValue: NavigationItem[K],
  ) {
    updateItems(
      items.map((item) =>
        item.id === id ? { ...item, [key]: nextValue } : item,
      ),
    );
  }

  function move(index: number, by: number) {
    const destination = index + by;

    if (destination < 0 || destination >= items.length) {
      return;
    }

    const next = [...items];

    [next[index], next[destination]] = [
      next[destination],
      next[index],
    ];

    updateItems(next);
  }

  return (
    <section className="navigation-settings navigation-controls">
      <div className="navigation-editor-heading">
        <div>
          <h3>Navigation & header</h3>
          <p>
            Rename, reorder and style your menu without coding.
            Changing a label does not change its page address.
          </p>
        </div>

        <button
          className="small-button"
          type="button"
          onClick={() => {
            for (const [key, defaultValue] of Object.entries(
              navigationDefaults,
            )) {
              onChange(key, defaultValue);
            }
          }}
        >
          <RotateCcw size={14} />
          Reset navigation
        </button>
      </div>

      <section className="nav-editor-section">
        <div className="admin-row">
          <div>
            <h3>Menu labels & order</h3>
            <p className="quiet-note">
              For example, change Profile to About Me. Urdu follows
              English automatically; you can review or change it.
            </p>
          </div>

          <span className="pill">{items.length} / 12 links</span>
        </div>

        <div className="menu-editor-list">
          {items.map((item, index) => (
            <div
              className={
                'menu-editor-item ' +
                (!item.visible ? 'menu-item-hidden' : '')
              }
              key={item.id}
            >
              <div className="menu-item-top">
                <strong>
                  {index + 1}. {item.label || 'Menu item'}
                </strong>

                <div>
                  <button
                    type="button"
                    className="icon-button"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    aria-label={'Move ' + item.label + ' earlier'}
                  >
                    <ArrowUp size={15} />
                  </button>

                  <button
                    type="button"
                    className="icon-button"
                    disabled={index === items.length - 1}
                    onClick={() => move(index, 1)}
                    aria-label={'Move ' + item.label + ' later'}
                  >
                    <ArrowDown size={15} />
                  </button>

                  <button
                    type="button"
                    className="icon-button"
                    onClick={() =>
                      updateItems(
                        items.filter((entry) => entry.id !== item.id),
                      )
                    }
                    aria-label={'Remove ' + item.label + ' from menu'}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="settings-grid">
                <label>
                  English menu name
                  <input
                    maxLength={60}
                    value={item.label}
                    onChange={(event) =>
                      updateItem(item.id, 'label', event.target.value)
                    }
                    placeholder="About Me"
                    required
                  />
                </label>

                <label>
                  Urdu menu name
                  <input
                    maxLength={100}
                    dir="rtl"
                    value={item.labelUr}
                    onChange={(event) =>
                      updateItem(item.id, 'labelUr', event.target.value)
                    }
                    placeholder="میرے بارے میں"
                  />

                  <AutoUrdu
                    source={item.label}
                    value={item.labelUr}
                    onChange={(text) =>
                      updateItem(item.id, 'labelUr', text)
                    }
                    maxLength={100}
                  />
                </label>
              </div>

              <label className="menu-destination">
                Link destination
                <input
                  list="existing-site-pages"
                  value={item.href}
                  onChange={(event) =>
                    updateItem(item.id, 'href', event.target.value)
                  }
                  placeholder="/profile or https://…"
                  required
                />
              </label>

              <div className="menu-item-toggles">
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={item.visible}
                    onChange={(event) =>
                      updateItem(item.id, 'visible', event.target.checked)
                    }
                  />
                  Show in navigation
                </label>

                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={item.newTab}
                    onChange={(event) =>
                      updateItem(item.id, 'newTab', event.target.checked)
                    }
                  />
                  Open in new tab
                </label>
              </div>
            </div>
          ))}
        </div>

        <datalist id="existing-site-pages">
          {defaultNavigationItems.map((item) => (
            <option value={item.href} key={item.id}>
              {item.label}
            </option>
          ))}
          <option value="/services#trainings">
            Training programmes
          </option>
        </datalist>

        <div className="button-row">
          <button
            type="button"
            className="small-button"
            disabled={items.length >= 12}
            onClick={() =>
              updateItems([
                ...items,
                {
                  id: crypto.randomUUID(),
                  label: 'New link',
                  labelUr: 'نیا لنک',
                  href: '/contact',
                  visible: true,
                  newTab: false,
                },
              ])
            }
          >
            <Plus size={15} />
            Add menu link
          </button>

          <button
            type="button"
            className="small-button"
            onClick={() =>
              updateItems(
                defaultNavigationItems.map((item) => ({ ...item })),
              )
            }
          >
            Restore default menu
          </button>
        </div>

        <p className="quiet-note">
          Hiding or removing a link keeps the page and its content
          intact. Keep at least one link visible. Links can point to an
          existing page, a page section or an HTTPS website; adding a
          link does not create a new page.
        </p>
      </section>

      <section className="nav-editor-section">
        <h3>Choose a navigation design</h3>

        <div className="nav-design-grid">
          {navDesigns.map(([id, label, description]) => (
            <button
              key={id}
              type="button"
              aria-pressed={n.navDesign === id}
              className={
                'nav-design-card ' +
                (n.navDesign === id ? 'chosen' : '')
              }
              onClick={() => onChange('navDesign', id)}
            >
              <div className={'design-demo demo-' + id}>
                <span>Home</span>
                <span className="selected">About</span>
                <span>Work</span>
              </div>

              <strong>{label}</strong>
              <small>{description}</small>
            </button>
          ))}
        </div>

        {n.navDesign === 'gradient' && (
          <fieldset className="theme-picker">
            <legend>Classic gradient colours</legend>

            {navThemes.map(([id, label]) => (
              <label
                key={id}
                className={n.navTheme === id ? 'chosen' : ''}
              >
                <input
                  type="radio"
                  name="navTheme"
                  value={id}
                  checked={n.navTheme === id}
                  onChange={() => onChange('navTheme', id)}
                />
                <span className={`theme-swatch nav-theme-${id}`} />
                {label}
              </label>
            ))}
          </fieldset>
        )}

        <div className="settings-grid">
          <label>
            Header layout
            <SmartSelect
              value={n.navLayout}
              onChange={(event) =>
                onChange('navLayout', event.target.value)
              }
            >
              <option value="stacked">
                Spacious — brand above navigation
              </option>
              <option value="inline">Compact — one row</option>
            </SmartSelect>
          </label>

          <label>
            Menu alignment
            <SmartSelect
              value={n.navAlign}
              onChange={(event) =>
                onChange('navAlign', event.target.value)
              }
            >
              <option value="start">Start</option>
              <option value="center">Centre</option>
              <option value="end">End</option>
            </SmartSelect>
          </label>

          <label>
            Corners and edges
            <SmartSelect
              value={n.navCorners}
              onChange={(event) =>
                onChange('navCorners', event.target.value)
              }
            >
              <option value="rounded">Rounded</option>
              <option value="square">Square</option>
              <option value="ribbon">
                Ribbon folds — classic gradient
              </option>
            </SmartSelect>
          </label>

          <label>
            Active and hover effect
            <SmartSelect
              value={n.navEffect}
              onChange={(event) =>
                onChange('navEffect', event.target.value)
              }
            >
              <option value="contrast">Contrasting tab</option>
              <option value="underline">Underlined tab</option>
              <option value="glow">Soft glow</option>
            </SmartSelect>
          </label>

          <label>
            Menu typeface
            <SmartSelect
              value={n.navFont}
              onChange={(event) =>
                onChange('navFont', event.target.value)
              }
            >
              <option value="sans">Clean sans serif</option>
              <option value="serif">Classic italic serif</option>
            </SmartSelect>
          </label>

          <label>
            Navigation width — {n.navWidth}px
            <input
              type="range"
              min="100"
              max="1600"
              step="10"
              value={n.navWidth}
              onChange={(event) =>
                onChange('navWidth', Number(event.target.value))
              }
            />
          </label>

          <label>
            Font size — {n.navFontSize}px
            <input
              type="range"
              min="11"
              max="18"
              value={n.navFontSize}
              onChange={(event) =>
                onChange('navFontSize', Number(event.target.value))
              }
            />
          </label>

          <label>
            Link spacing — {n.navItemPadding}px
            <input
              type="range"
              min="8"
              max="30"
              value={n.navItemPadding}
              onChange={(event) =>
                onChange('navItemPadding', Number(event.target.value))
              }
            />
          </label>

          <label>
            Tab height — {n.navBarHeight}px
            <input
              type="range"
              min="40"
              max="70"
              value={n.navBarHeight}
              onChange={(event) =>
                onChange('navBarHeight', Number(event.target.value))
              }
            />
          </label>

          <label>
            Corner radius — {n.navRadius}px
            <input
              type="range"
              min="0"
              max="30"
              value={n.navRadius}
              onChange={(event) =>
                onChange('navRadius', Number(event.target.value))
              }
            />
          </label>
        </div>

        <p className="quiet-note">
          Navigation width controls the preferred bar width. Available
          screen space still limits its size.
        </p>

        <div className="nav-color-grid">
          {[
  ['navBackground', 'Bar background'],
  ['navText', 'Menu text'],
  ['navActiveBackground', 'Active background / line'],
  ['navHoverText', 'Hover text'],
  ['navActiveText', 'Active text'],
  ['navAccountBackground', 'My Account background'],
  ['navAccountText', 'My Account text'],
  ['navAccountHoverBackground', 'My Account hover background'],
  ['navAccountHoverText', 'My Account hover text'],
  ['navBorder', 'Border'],
].map(([key, label]) => (
            <label key={key}>
              {label}
              <input
                type="color"
                value={(n as any)[key]}
                onChange={(event) =>
                  onChange(key, event.target.value)
                }
              />
            </label>
          ))}
        </div>

        <p className="quiet-note">
          Use clearly contrasting text and background colours. The
          Classic gradient design uses its selected colour theme;
          modern designs use the colours above.
        </p>

        <div className="menu-item-toggles">
          <label className="check-label">
            <input
              type="checkbox"
              checked={n.navSticky}
              onChange={(event) =>
                onChange('navSticky', event.target.checked)
              }
            />
            Keep header visible while scrolling
          </label>

          <label className="check-label">
            <input
              type="checkbox"
              checked={n.navShadow}
              onChange={(event) =>
                onChange('navShadow', event.target.checked)
              }
            />
            Show navigation shadow
          </label>
        </div>
      </section>

      <section className="nav-editor-section">
        <h3>Brand & Connect button</h3>

        <div className="settings-grid">
          <label>
            Monogram text
            <input
              maxLength={6}
              value={value.navMonogram ?? n.navMonogram}
              onChange={(event) =>
                onChange('navMonogram', event.target.value)
              }
            />
          </label>

          <div>
            <HeaderLogo
              value={n.navLogo}
              onChange={(url) => onChange('navLogo', url)}
              onUploading={onUploading}
            />
          </div>

          <label>
            Subtitle in English
            <input
              maxLength={100}
              value={value.navSubtitle ?? n.navSubtitle}
              onChange={(event) =>
                onChange('navSubtitle', event.target.value)
              }
            />
          </label>

          <label>
            Subtitle in Urdu
            <input
              dir="rtl"
              maxLength={140}
              value={value.navSubtitleUr ?? n.navSubtitleUr}
              onChange={(event) =>
                onChange('navSubtitleUr', event.target.value)
              }
            />

            <AutoUrdu
              source={value.navSubtitle ?? n.navSubtitle}
              value={value.navSubtitleUr ?? n.navSubtitleUr}
              onChange={(text) => onChange('navSubtitleUr', text)}
              maxLength={140}
            />
          </label>

          <label>
            Connect button action
            <SmartSelect
              value={n.navCtaAction}
              onChange={(event) =>
                onChange('navCtaAction', event.target.value)
              }
            >
              <option value="account">
                Account sign-in — Connect / My account
              </option>
              <option value="link">
                Custom link — use labels and destination below
              </option>
            </SmartSelect>
          </label>

          <label>
            Custom link button text
            <input
              maxLength={50}
              value={value.navCtaLabel ?? n.navCtaLabel}
              onChange={(event) =>
                onChange('navCtaLabel', event.target.value)
              }
            />
          </label>

          <label>
            Contact button in Urdu
            <input
              maxLength={70}
              dir="rtl"
              value={value.navCtaLabelUr ?? n.navCtaLabelUr}
              onChange={(event) =>
                onChange('navCtaLabelUr', event.target.value)
              }
            />

            <AutoUrdu
              source={value.navCtaLabel ?? n.navCtaLabel}
              value={value.navCtaLabelUr ?? n.navCtaLabelUr}
              onChange={(text) => onChange('navCtaLabelUr', text)}
              maxLength={70}
            />
          </label>

          <label>
            Contact button destination
            <input
              list="existing-site-pages"
              value={value.navCtaHref ?? n.navCtaHref}
              onChange={(event) =>
                onChange('navCtaHref', event.target.value)
              }
            />
          </label>
        </div>

        <div className="menu-item-toggles">
          <label className="check-label">
            <input
              type="checkbox"
              checked={n.navShowMark}
              onChange={(event) =>
                onChange('navShowMark', event.target.checked)
              }
            />
            Show logo or monogram
          </label>

          <label className="check-label">
            <input
              type="checkbox"
              checked={n.navShowSubtitle}
              onChange={(event) =>
                onChange('navShowSubtitle', event.target.checked)
              }
            />
            Show brand subtitle
          </label>

          <label className="check-label">
            <input
              type="checkbox"
              checked={n.navShowCTA}
              onChange={(event) =>
                onChange('navShowCTA', event.target.checked)
              }
            />
            Show additional custom button beside navigation
          </label>
        </div>

        <label className="check-label">
          <input
            type="checkbox"
            checked={n.navUseThemeColors}
            onChange={(event) =>
              onChange('navUseThemeColors', event.target.checked)
            }
          />
          Use the shared website theme colours (turn off for custom
          header colours)
        </label>

        <p className="quiet-note">
          Your name comes from Profile & identity. Navigation switches
          to a full-screen menu whenever the links no longer fit
          beside the name. My Account and the theme cycle are always
          available. Social icons appear only in the footer.
        </p>
      </section>

<section className="nav-editor-section">
  <h3>Light & Dark navigation colours</h3>

  <p>
    Set menu and My Account colours separately for each mode.
    These colours override the shared navigation colours.
  </p>

  {(['Light', 'Dark'] as const).map(mode => (
    <fieldset key={mode} className="navigation-colour-mode">
      <legend>{mode} Mode</legend>

      {navigationColourFields.map(([heading, fields]) => (
        <div key={heading} className="navigation-colour-group">
          <h4>{heading}</h4>

          <div className="settings-grid">
            {fields.map(([label, suffix]) => {
              const key =
                `nav${mode}${suffix}` as keyof typeof navigationColourDefaults;

              const selected =
                value[key] ?? navigationColourDefaults[key];

              return (
                <label key={key}>
                  <span>{label}</span>

                  <input
                    type="color"
                    value={selected}
                    onChange={event =>
                      onChange(key, event.target.value)
                    }
                  />

                  <small>{selected}</small>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </fieldset>
  ))}
</section>

      <div className="navigation-preview modern-preview">
        <div className="admin-row">
          <small>LIVE MENU PREVIEW</small>

          <button
            type="button"
            className="small-button"
            onClick={() => setPreviewUr((current) => !current)}
          >
            {previewUr ? 'Preview in English' : 'اردو میں پیش نظارہ'}
          </button>
        </div>

        <div
          dir={previewUr ? 'rtl' : 'ltr'}
          className={'navigation-preview-bar ' + navigationClass(n)}
          style={navigationStyle(value) as CSSProperties}
          ref={(element) => {
            indicator.ref.current = element;
          }}
          onPointerLeave={() => indicator.reset()}
          role="group"
          aria-label="Navigation style preview"
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
                  indicator.position.height + 'px',
                width: indicator.position.width,
                height: indicator.position.height,
                transform: `translate(${indicator.position.x}px,${indicator.position.y}px)`,
              } as CSSProperties
            }
          />

          {items
            .filter((item) => item.visible)
            .map((item) => (
              <button
                key={item.id}
                type="button"
                className={active === item.id ? 'active' : ''}
                aria-pressed={active === item.id}
                onPointerEnter={(event) =>
                  indicator.move(event.currentTarget)
                }
                onFocus={(event) =>
                  indicator.move(event.currentTarget)
                }
                onClick={() => setActive(item.id)}
              >
                {previewUr
                  ? item.labelUr || item.label
                  : item.label}
              </button>
            ))}
        </div>

        <p>
          Click a tab to preview the active state. Save changes below
          to apply the complete header to your website.
        </p>
      </div>
    </section>
  );
}

type HeaderLogoProps = {
  value: string;
  onChange: (url: string) => void;
  onUploading?: (busy: boolean) => void;
};

function HeaderLogo({
  value,
  onChange,
  onUploading,
}: HeaderLogoProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const element = event.currentTarget;
    const file = element.files?.[0];

    if (!file) return;

    setError('');

    if (
      !['image/png', 'image/jpeg', 'image/webp'].includes(file.type) ||
      file.size > 8 * 1024 * 1024
    ) {
      setError('Choose PNG, JPEG or WebP under 8 MB.');
      element.value = '';
      return;
    }

    setBusy(true);
    onUploading?.(true);

    try {
      const formData = new FormData();
      formData.set('file', file);
      formData.set('public', 'true');

      const response = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      });

      const result: any = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Logo upload failed.');
      }

      onChange(result.url);
    } catch (cause: unknown) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Logo upload failed.',
      );
    } finally {
      setBusy(false);
      onUploading?.(false);
      element.value = '';
    }
  }

  return (
    <div className="header-logo-upload">
      <span>Header logo — optional</span>

      <div>
        {value && (
          <img src={value} alt="Selected header logo" />
        )}

        <label className="small-button photo-choose">
          <Upload size={14} />
          {busy ? 'Uploading…' : 'Upload logo'}

          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            disabled={busy}
            onChange={upload}
          />
        </label>

        {value && (
          <button
            type="button"
            className="icon-button"
            disabled={busy}
            aria-label="Remove header logo"
            onClick={() => onChange('')}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}