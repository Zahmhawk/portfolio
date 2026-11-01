'use client';

import ChatCommandWindow, {commandHelp} from './chat-command-window';
import ChatDictation from './chat-dictation';
import SmartSelect from './smart-select';
import {commandAliases} from '../lib/chat-commands';
import {readChatAttachment} from '../lib/attachment-client';
import {
  EditPreview,
  assistantRequest,
} from './admin/assistant-history';
import AIConnections from './ai-connections';
import AIVoice from './ai-voice';
import {useEffect, useRef, useState} from 'react';
import type {FormEvent, KeyboardEvent} from 'react';
import {
  MessageCircle,
  Settings,
  SquarePen,
  Send,
  X,
  Trash2,
  Paperclip,
  ArrowLeft,
  Loader2,
  LogIn,
} from 'lucide-react';

type Message = {
  id: string;
  role: string;
  body: string;
  provider?: string;
  model?: string;
  proposal?: any;
};

export default function AIChat() {
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [hideSuggestions, setHideSuggestions] = useState(false);
  const [command, setCommand] = useState('');
  const [planning, setPlanning] = useState(false);

  const requestAbort = useRef<AbortController | null>(null);
  const lastFailed = useRef<any>(null);
  const refreshGeneration = useRef(0);

  const [open, setOpen] = useState(false);
  const [mode, setMode] =
    useState<'chat' | 'settings' | 'voice'>('chat');

  const [account, setAccount] = useState<any>(null);
  const [thread, setThread] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [image, setImage] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [ur, setUr] = useState(false);
  const [, setHistoryTick] = useState(0);

  const file = useRef<HTMLInputElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  const t = (en: string, u: string) => ur ? u : en;

  const suggestions =
    account?.isAdmin === true &&
    !hideSuggestions &&
    /^\/[a-z]*$/i.test(draft)
      ? commandHelp
          .filter(([name]) =>
            name.startsWith(draft.toLowerCase())
          )
          .sort((a, b) => a[0].localeCompare(b[0]))
      : [];

  function selectSuggestion(name: string) {
    setDraft(name);
    setHideSuggestions(true);
    setSuggestionIndex(0);

    requestAnimationFrame(() => {
      document.getElementById('ai-draft')?.focus();
    });
  }

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get('chat') === 'open') {
      setOpen(true);

      if (params.get('chatSettings') === '1') {
        setMode('settings');
      }
    }

    const sync = () => {
      setUr(document.documentElement.lang === 'ur');
    };

    sync();

    const observer = new MutationObserver(sync);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (open) {
      wasOpen.current = true;

      if (!panel.current?.open) {
        panel.current?.showModal();
      }

      void refresh();
    } else {
      panel.current?.close();

      if (wasOpen.current) {
        trigger.current?.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (image?.url) {
        URL.revokeObjectURL(image.url);
      }
    };
  }, [image?.url]);

  useEffect(() => {
    bottom.current?.scrollIntoView({block: 'nearest'});
  }, [messages, busy]);

  useEffect(() => {
    if (!open) return;

    const check = () => {
      if (document.visibilityState === 'visible') {
        void refresh();
      }
    };

    window.addEventListener('focus', check);
    document.addEventListener('visibilitychange', check);

    return () => {
      window.removeEventListener('focus', check);
      document.removeEventListener('visibilitychange', check);
    };
  }, [open]);

  async function refresh() {
    const generation = ++refreshGeneration.current;

    setLoading(true);
    setAccount((current: any) =>
      current ? {...current, isAdmin: false} : current
    );

    try {
      const response = await fetch('/api/chat', {
        cache: 'no-store',
      });

      const data: any = await response.json();

      if (!response.ok) {
        throw Error(data.error || 'Could not load chat');
      }

      if (generation !== refreshGeneration.current) return;

      setAccount(data);

      if (data.isAdmin !== true) {
        setCommand('');
        setPlanning(false);
      }
    } catch (cause: any) {
      if (generation !== refreshGeneration.current) return;

      setAccount(null);
      setCommand('');
      setPlanning(false);
      setError(cause.message || 'Could not load chat');
    } finally {
      if (generation === refreshGeneration.current) {
        setLoading(false);
      }
    }
  }

  async function post(body: any, signal?: AbortSignal) {
    const response = await fetch('/api/chat', {
      signal,
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body),
    });

    const data: any = await response.json();

    if (!response.ok) {
      throw Error(data.error || 'Please try again');
    }

    return data;
  }

  function newChat() {
    lastFailed.current = null;
    setPlanning(false);
    setThread('');
    setMessages([]);
    setDraft('');
    setImage(null);
    setError('');
    setNotice('');
    setMode('chat');
  }

  async function chooseChat(id: string) {
    lastFailed.current = null;
    setPlanning(false);
    setBusy(true);
    setError('');

    try {
      const response = await fetch(
        '/api/chat?thread=' + encodeURIComponent(id),
        {cache: 'no-store'}
      );

      const data: any = await response.json();

      if (!response.ok) {
        throw Error(data.error || 'Could not load conversation');
      }

      setThread(id);
      setMessages(data.messages);
      setDraft('');
      setImage(null);
      setMode('chat');
    } catch (cause: any) {
      setError(cause.message);
    } finally {
      setBusy(false);
    }
  }

  async function attach(selected?: File) {
    if (!selected) return;

    setError('');

    try {
      const attachment = await readChatAttachment(selected);

      if (
        !account?.isAdmin &&
        !attachment.mime.startsWith('image/')
      ) {
        setError(t(
          'Document attachments are available in the administrator assistant.',
          'دستاویزات صرف ایڈمن معاون میں شامل کر سکتے ہیں۔'
        ));
        return;
      }

      setImage({...attachment, original: selected});
    } catch (cause: any) {
      setError(cause.message);
    }
  }

  function stop() {
    requestAbort.current?.abort();
    setBusy(false);

    setNotice(t(
      'Stopped waiting. The provider may finish an already-started request; check the conversation before retrying.',
      'انتظار روک دیا۔ جاری درخواست Provider پر مکمل ہوسکتی ہے؛ دوبارہ بھیجنے سے پہلے گفتگو دیکھیں۔'
    ));
  }

  function handleDraftKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.nativeEvent.isComposing ||
      event.nativeEvent.keyCode === 229
    ) {
      return;
    }

    // Shift + Enter inserts a new line.
    if (event.key === 'Enter' && event.shiftKey) {
      return;
    }

    if (suggestions.length) {
      if (
        event.key === 'ArrowDown' ||
        event.key === 'ArrowUp'
      ) {
        event.preventDefault();

        setSuggestionIndex(index =>
          (
            index +
            (event.key === 'ArrowDown' ? 1 : -1) +
            suggestions.length
          ) % suggestions.length
        );

        return;
      }

      if (event.key === 'Tab') {
        event.preventDefault();

        selectSuggestion(
          suggestions[
            suggestionIndex % suggestions.length
          ][0]
        );

        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        setHideSuggestions(true);
        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();

        if (event.repeat) return;

        const typedCommand = draft.trim().toLowerCase();

        const exactCommand = commandHelp.some(
          ([name]) => name === typedCommand
        );

        if (!exactCommand) {
          selectSuggestion(
            suggestions[
              suggestionIndex % suggestions.length
            ][0]
          );
          return;
        }
      }
    }

    if (event.key !== 'Enter') return;

    event.preventDefault();

    if (event.repeat) return;

    const isCommand = draft.trim().startsWith('/');

    const cannotSend =
      (!draft.trim() && !image) ||
      (busy && !isCommand) ||
      (!account?.hasKey && !isCommand);

    if (cannotSend) return;

    event.currentTarget.form?.requestSubmit();
  }

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!account?.signedIn) {
      setError(t(
        'Please sign in first.',
        'پہلے سائن اِن کریں۔'
      ));
      return;
    }

    const raw = draft.trim();
    const cmd = raw.toLowerCase();

    if (cmd.startsWith('/')) {
      if (account?.isAdmin !== true) {
        setError(
          'Slash commands are available only to the administrator.'
        );
        return;
      }

      try {
        const response = await fetch('/api/chat', {
          cache: 'no-store',
        });

        const current: any = await response.json();

        if (
          !response.ok ||
          current.isAdmin !== true
        ) {
          setAccount(current);
          setCommand('');
          setPlanning(false);
          setError(
            'Slash commands are available only to the administrator.'
          );
          return;
        }
      } catch {
        setCommand('');
        setError(
          'Could not verify administrator access. Please try again.'
        );
        return;
      }

      const name = commandAliases[cmd.slice(1)] || cmd.slice(1);

      if (['stop', 'shop'].includes(name)) {
        stop();
        setDraft('');
        return;
      }

      if (name === 'new') {
        if (busy) {
          setError('Stop the current request first.');
          return;
        }

        newChat();
        return;
      }

      if (name === 'plan') {
        setPlanning(true);
        setNotice(
          'Plan mode: discussion only; no changes will be prepared. Use /execute to leave.'
        );
        setDraft('');
        return;
      }

      if (name === 'execute') {
        setPlanning(false);
        setNotice(
          'Plan mode off. Proposed changes still require Apply.'
        );
        setDraft('');
        return;
      }

      if (
        ['help', 'model', 'undo', 'memory', 'skills', 'apis', 'api']
          .includes(name)
      ) {
        setCommand(name === 'api' ? 'apis' : name);
        setDraft('');
        return;
      }

      if (name !== 'retry') {
        setError('Unknown command. Use /help.');
        return;
      }
    }

    if (busy) return;

    const retry =
      cmd === '/retry' ? lastFailed.current : null;

    if (cmd === '/retry' && !retry) {
      setError('No failed message to retry.');
      return;
    }

    if (!account.hasKey) {
      setError(t(
        'Add an API connection in Settings first.',
        'پہلے Settings میں API کنکشن شامل کریں۔'
      ));
      return;
    }

    const text = retry?.text ?? draft;
    const attached = retry?.attached ?? image;
    const id = retry?.id ?? crypto.randomUUID();

    if (!text.trim() && !attached) return;

    setBusy(true);
    setError('');
    setNotice('');
    setDraft('');

    lastFailed.current = {id, text, attached};

    setMessages(previous =>
      previous.some(message => message.id === id)
        ? previous
        : [
            ...previous,
            {
              id,
              role: 'user',
              body: text + (
                attached
                  ? '\n' + t(
                      '[File attached for this exchange]',
                      '[اس پیغام کے ساتھ فائل منسلک ہے]'
                    )
                  : ''
              ),
            },
          ]
    );

    const controller = new AbortController();
    requestAbort.current = controller;

    try {
      const data = account.isAdmin
        ? await assistantRequest(
            {
              action: 'message',
              requestId: id,
              plan: planning,
              thread: thread || undefined,
              text,
              attachment: attached
                ? {
                    mime: attached.mime,
                    data: attached.data,
                    text: attached.text,
                    name: attached.name,
                  }
                : undefined,
              history: messages.slice(-8).map(message => ({
                role: message.role,
                body: message.body,
              })),
              consent: true,
            },
            controller.signal
          )
        : await post(
            {
              action: 'message',
              requestId: id,
              thread: thread || undefined,
              text,
              image: attached
                ? {
                    mime: attached.mime,
                    data: attached.data,
                  }
                : undefined,
              consent: true,
            },
            controller.signal
          );

      if (controller.signal.aborted) return;

      setMessages(previous => [
        ...previous.filter(
          message => message.id !== id + '-reply'
        ),
        {
          id: id + '-reply',
          role: 'assistant',
          body: data.reply,
          provider: data.provider,
          model: data.model,
          proposal: data.proposal,
        },
      ]);

      lastFailed.current = null;
      setHistoryTick(value => value + 1);

      if (data.thread) {
        setThread(data.thread);
      }

      setImage(null);
      await refresh();
    } catch (cause: any) {
      if (cause.name === 'AbortError') return;

      setError(cause.message);
      setDraft(current => current || text);
    } finally {
      if (requestAbort.current === controller) {
        requestAbort.current = null;
        setBusy(false);
      }
    }
  }

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="ai-chat-launch"
        aria-label={t('Open AI chat', 'AI چیٹ کھولیں')}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <MessageCircle size={23}/>
        <span>{t('AI Chat', 'AI چیٹ')}</span>
      </button>

      <dialog
        ref={panel}
        className="ai-chat-panel"
        dir={ur ? 'rtl' : 'ltr'}
        aria-labelledby="ai-chat-title"
        onCancel={event => {
          event.preventDefault();
          setOpen(false);
        }}
      >
        <header className="ai-chat-header">
          <div className="ai-chat-brand">
            <span>
              <MessageCircle size={22}/>
            </span>

            <div>
              <h2 id="ai-chat-title">
                {account?.isAdmin
                  ? t('Website assistant', 'ویب سائٹ معاون')
                  : t('Learning companion', 'تعلیمی معاون')}
              </h2>

              <small>
                {account?.isAdmin
                  ? t(
                      'Administrator workspace',
                      'منتظم کی ورک اسپیس'
                    )
                  : t('AI Assistant', 'AI معاون')}
              </small>
            </div>
          </div>

          <div className="ai-chat-actions">
            <button
              type="button"
              disabled={busy}
              onClick={newChat}
              aria-label={t('New chat', 'نئی چیٹ')}
              title="New chat"
            >
              <SquarePen size={19}/>
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setMode(
                  mode === 'settings' ? 'chat' : 'settings'
                );
                setError('');
                setNotice('');
              }}
              aria-label={t(
                'Chat settings',
                'چیٹ کی ترتیبات'
              )}
              aria-pressed={mode === 'settings'}
              title="Settings"
            >
              <Settings size={19}/>
            </button>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t('Close chat', 'چیٹ بند کریں')}
            >
              <X size={20}/>
            </button>
          </div>
        </header>

        <div
          className="ai-mode-tabs"
          role="tablist"
          aria-label="AI conversation mode"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode !== 'voice'}
            onClick={() => {
              setMode('chat');
              setError('');
              setNotice('');
            }}
          >
            {t('Chat', 'چیٹ')}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={mode === 'voice'}
            onClick={() => {
              setMode('voice');
              setError('');
              setNotice('');
            }}
          >
            {t('Voice', 'آواز')}
          </button>
        </div>

        <div className="ai-chat-content">
          {loading && !account ? (
            <p role="status">
              {t('Loading…', 'لوڈ ہو رہا ہے…')}
            </p>
          ) : !account?.signedIn ? (
            <div className="ai-chat-welcome">
              <div className="ai-chat-orb">
                <MessageCircle size={34}/>
              </div>

              <h3>
                {t(
                  'A space to ask and explore.',
                  'سوال کریں، سیکھیں اور آگے بڑھیں۔'
                )}
              </h3>

              <p>
                {t(
                  'Sign in to start a chat and keep your AI connections with your account.',
                  'چیٹ شروع کرنے اور AI کنکشن اپنے اکاؤنٹ کے ساتھ محفوظ رکھنے کے لیے سائن اِن کریں۔'
                )}
              </p>

              <a
                className="button"
                href={
                  account?.signIn ||
                  '/login?return_to=%2F%3Fchat%3Dopen'
                }
                target="_top"
              >
                <LogIn size={18}/>
                {t('Sign in', 'سائن اِن کریں')}
              </a>
            </div>
          ) : mode === 'settings' ? (
            <div className="ai-chat-settings">
              <button
                type="button"
                className="text-link"
                onClick={() => {
                  setMode('chat');
                  setNotice('');
                  setError('');
                }}
              >
                <ArrowLeft size={16}/>
                {t('Back to chat', 'چیٹ پر واپس')}
              </button>

              <p className="ai-account" dir="auto">
                {account.name}
              </p>

              <a
                className="text-link"
                href={account.signOut}
                target="_top"
              >
                {t('Sign out', 'سائن آؤٹ کریں')}
              </a>

              <AIConnections
                account={account}
                reload={refresh}
                ur={ur}
              />
            </div>
          ) : mode === 'voice' ? (
            <AIVoice
              account={account}
              ur={ur}
              visible={open}
            />
          ) : (
            <>
              <div className="ai-chat-history">
                <label htmlFor="ai-thread">
                  {t('Your conversations', 'آپ کی گفتگو')}
                </label>

                <SmartSelect
                  id="ai-thread"
                  value={thread}
                  disabled={busy}
                  onChange={event =>
                    event.target.value
                      ? chooseChat(event.target.value)
                      : newChat()
                  }
                >
                  <option value="">
                    {t('New conversation', 'نئی گفتگو')}
                  </option>

                  {(account.threads || []).map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </SmartSelect>

                {thread && (
                  <button
                    type="button"
                    className="ai-delete"
                    disabled={busy}
                    aria-label="Delete current chat"
                    onClick={async () => {
                      if (
                        !window.confirm(t(
                          'Delete this conversation permanently?',
                          'یہ گفتگو مستقل حذف کردیں؟'
                        ))
                      ) {
                        return;
                      }

                      setBusy(true);
                      setError('');

                      try {
                        await post({
                          action: 'deleteThread',
                          thread,
                        });

                        newChat();
                        await refresh();
                      } catch (cause: any) {
                        setError(cause.message);
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    <Trash2 size={17}/>
                  </button>
                )}
              </div>

              {planning && (
                <p className="plan-mode-badge">
                  Plan mode · no changes · /execute to leave
                </p>
              )}

              <div
                className="ai-messages"
                aria-live="polite"
                aria-relevant="additions text"
              >
                {!messages.length && (
                  <div className="ai-chat-welcome">
                    <div className="ai-chat-orb">
                      <MessageCircle size={30}/>
                    </div>

                    <h3>
                      {account.isAdmin
                        ? t(
                            'How can I help with your website?',
                            'ویب سائٹ میں کیا مدد کروں؟'
                          )
                        : t(
                            'What would you like to explore?',
                            'آپ کیا جاننا چاہتے ہیں؟'
                          )}
                    </h3>

                    {account.isAdmin && (
                      <p>
                        {t(
                          'Ask for advice, attach a file, or describe an edit. Changes are previewed before Apply.',
                          'مشورہ پوچھیں، فائل لگائیں یا تبدیلی بتائیں۔ تبدیلی پہلے پیش نظارے میں آئے گی۔'
                        )}
                      </p>
                    )}

                    {!account.hasKey && (
                      <button
                        type="button"
                        className="button"
                        onClick={() => setMode('settings')}
                      >
                        <Settings size={17}/>
                        {t(
                          'Add API in Settings',
                          'Settings میں API شامل کریں'
                        )}
                      </button>
                    )}
                  </div>
                )}

                {messages.map(message => (
                  <article
                    key={message.id}
                    className={'ai-message ' + message.role}
                  >
                    <small>
                      {message.role === 'user'
                        ? t('You', 'آپ')
                        : t('Assistant', 'معاون')}
                    </small>

                    <div dir="auto">{message.body}</div>

                    {message.proposal && !planning && (
                      <EditPreview
                        key={message.proposal.id}
                        proposal={message.proposal}
                        ur={ur}
                        onDone={() =>
                          setHistoryTick(value => value + 1)
                        }
                      />
                    )}
                  </article>
                ))}

                {busy && (
                  <p className="ai-thinking" role="status">
                    <Loader2
                      size={17}
                      className="ai-spin"
                    />
                    {t(
                      'Preparing a reply…',
                      'جواب تیار ہو رہا ہے…'
                    )}
                  </p>
                )}

                <div ref={bottom}/>
              </div>

              <form
                className="ai-composer"
                onSubmit={send}
              >
                {image && (
                  <div className="ai-attachment">
                    {image.mime.startsWith('image/') ? (
                      <img
                        src={image.url}
                        alt={t(
                          'Attachment preview',
                          'منسلک فائل'
                        )}
                      />
                    ) : (
                      <Paperclip size={20}/>
                    )}

                    <span>{image.name}</span>

                    {account.isAdmin &&
                      image.data &&
                      !image.publicURL && (
                        <button
                          type="button"
                          className="text-link"
                          disabled={busy}
                          onClick={async () => {
                            if (
                              !window.confirm(t(
                                'Upload this file as public website content? Anyone with its link can view it.',
                                'یہ فائل ویب سائٹ کے لیے پبلک اپلوڈ کریں؟ لنک رکھنے والا اسے دیکھ سکے گا۔'
                              ))
                            ) {
                              return;
                            }

                            setBusy(true);
                            setError('');

                            try {
                              const formData = new FormData();

                              formData.set('file', image.original);
                              formData.set('public', 'true');

                              const response = await fetch(
                                '/api/files',
                                {
                                  method: 'POST',
                                  body: formData,
                                }
                              );

                              const data: any =
                                await response.json();

                              if (!response.ok) {
                                throw Error(
                                  data.error || 'Upload failed'
                                );
                              }

                              setImage({
                                ...image,
                                publicURL: data.url,
                              });

                              setDraft(current =>
                                current +
                                '\nPublic website file: ' +
                                data.url
                              );
                            } catch (cause: any) {
                              setError(cause.message);
                            } finally {
                              setBusy(false);
                            }
                          }}
                        >
                          {t(
                            'Upload for website',
                            'ویب سائٹ کے لیے اپلوڈ'
                          )}
                        </button>
                      )}

                    <button
                      type="button"
                      aria-label="Remove attachment"
                      onClick={() => setImage(null)}
                    >
                      <X size={16}/>
                    </button>
                  </div>
                )}

                {suggestions.length > 0 && (
                  <div
                    className="slash-suggestions"
                    role="listbox"
                    id="slash-options"
                    aria-label="Commands"
                  >
                    {suggestions.map(
                      ([name, description], index) => (
                        <button
                          id={'slash-option-' + index}
                          role="option"
                          aria-selected={
                            index ===
                            suggestionIndex % suggestions.length
                          }
                          type="button"
                          key={name}
                          onPointerMove={() =>
                            setSuggestionIndex(index)
                          }
                          onClick={() =>
                            selectSuggestion(name)
                          }
                        >
                          <code>{name}</code>
                          <span>{description}</span>
                        </button>
                      )
                    )}
                  </div>
                )}

                <div className="ai-input-row" dir="ltr">
                  <input
                    ref={file}
                    type="file"
                    accept={
                      account?.isAdmin
                        ? '.png,.jpg,.jpeg,.webp,.pdf,.txt,.csv,.json,.md,.docx,.xlsx'
                        : 'image/png,image/jpeg,image/webp'
                    }
                    hidden
                    onChange={event => {
                      void attach(event.target.files?.[0]);
                      event.currentTarget.value = '';
                    }}
                  />

                  <button
                    className="ai-attach-button"
                    type="button"
                    disabled={busy}
                    onClick={() => file.current?.click()}
                    aria-label={t(
                      'Attach file',
                      'فائل منسلک کریں'
                    )}
                    title={t(
                      'Attach file · up to 2 MB',
                      'فائل منسلک کریں · دو MB تک'
                    )}
                  >
                    <Paperclip size={20}/>
                  </button>

                  <label
                    className="ai-draft-label"
                    htmlFor="ai-draft"
                  >
                    {t('Message', 'پیغام')}
                  </label>

                  <textarea
                    id="ai-draft"
                    dir="auto"
                    value={draft}
                    aria-controls={
                      suggestions.length
                        ? 'slash-options'
                        : undefined
                    }
                    aria-activedescendant={
                      suggestions.length
                        ? 'slash-option-' +
                          (
                            suggestionIndex %
                            suggestions.length
                          )
                        : undefined
                    }
                    onChange={event => {
                      setDraft(event.target.value);
                      setHideSuggestions(false);
                      setSuggestionIndex(0);
                    }}
                    onKeyDown={handleDraftKeyDown}
                    maxLength={
                      account?.isAdmin ? 60000 : 6000
                    }
                    rows={1}
                    placeholder={t(
                      'Ask your question…',
                      'اپنا سوال لکھیں…'
                    )}
                  />

                  <ChatDictation
                    draft={draft}
                    onText={setDraft}
                    disabled={busy}
                    ur={ur}
                  />

                  {busy && (
                    <button
                      type="button"
                      className="ai-stop"
                      onClick={stop}
                      aria-label="Stop waiting"
                    >
                      ■
                    </button>
                  )}

                  <button
                    className="ai-send"
                    type="submit"
                    disabled={
                      (
                        busy &&
                        !draft.trim().startsWith('/')
                      ) ||
                      (
                        !account.hasKey &&
                        !draft.trim().startsWith('/')
                      ) ||
                      (!draft.trim() && !image)
                    }
                    aria-label={t(
                      'Send message',
                      'پیغام بھیجیں'
                    )}
                  >
                    <Send size={18}/>
                  </button>
                </div>

                <small className="composer-shortcut">
                  {t(
                    'Enter to send · Shift + Enter for a new line',
                    'Enter سے بھیجیں · Shift + Enter سے نئی لائن'
                  )}
                  {account?.isAdmin === true
                    ? ' · /help'
                    : ''}
                </small>
              </form>
            </>
          )}

          {error && (
            <p
              className="error ai-chat-alert"
              role="alert"
            >
              {error}
            </p>
          )}

          {notice && (
            <p
              className="success ai-chat-alert"
              role="status"
            >
              {notice}
            </p>
          )}
        </div>
      </dialog>

      {command &&
        account?.signedIn &&
        account?.isAdmin === true && (
          <ChatCommandWindow
            command={command}
            account={account} 
            ur={ur}
            close={() => setCommand('')}
            reload={refresh}
            planning={planning}
          />
        )}
    </>
  );
}