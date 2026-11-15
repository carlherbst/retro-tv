// Web channels: a channel that shows a web page instead of its stream (a
// weather page, a live camera). The server says which, in WEB_CHANNELS; the
// container turns that into /web-channels.json and lets those sites into
// the page's Content-Security-Policy (frame-src). See docker/README.md.
//
// The page goes in an <iframe> in the same box the <video> uses, so it
// moves between the corner box and the full window with the picture. It
// is something to watch, not to use: it never takes clicks or the keyboard
// focus, so the remote, the keys and the controller keep steering the
// viewer. Leaving the channel removes the frame (and stops its sound).

const CONFIG_URL = '/web-channels.json';

// The channel number -> page URL map. A server without web channels (or
// an older image without the file) answers {} or 404: no web channels.
export async function loadWebChannels() {
  try {
    const res = await fetch(CONFIG_URL, { cache: 'no-store' });
    if (!res.ok) return {};
    const map = await res.json();
    const out = {};
    for (const [num, url] of Object.entries(map || {})) {
      // An http(s) URL, or a page on the viewer itself ("/tvguide.html?tv").
      if (/^\d+(\.\d+)?$/.test(num) && /^(https?:\/\/|\/(?!\/))/i.test(url)) out[num] = url;
    }
    return out;
  } catch {
    return {};
  }
}

export class WebScreen {
  // box: the element the frame goes in (the picture's box, #screen).
  // before: the frame is put before this child (so messages stay on top).
  // onLoad(): the page has loaded.
  constructor(box, before, { onLoad = () => {} } = {}) {
    this.box = box;
    this.before = before;
    this.onLoad = onLoad;
    this.frame = null;
    this.url = null;
    this.endsAt = null;
    // A page that says when its current programme ends (the YouTube web
    // channels post {type: 'retro-tv:now', ends}) lets the sleep timer wait
    // for that end. Only the shown frame, from its own origin, is listened to.
    window.addEventListener('message', e => {
      const d = e.data;
      if (!this.frame || e.source !== this.frame.contentWindow || !d || d.type !== 'retro-tv:now') return;
      if (e.origin !== this.origin && !(this.origin === location.origin && e.origin === 'null')) return;
      this.endsAt = Number.isFinite(d.ends) ? d.ends : null;
    });
    // A page may still try to take the focus by script (an autofocus
    // field, a player). The keys would then go to it, not the viewer:
    // take the focus straight back.
    window.addEventListener('blur', () => {
      if (this.frame && document.activeElement === this.frame) setTimeout(() => this.#refocus(), 0);
    });
  }

  // Show this page. True if it was not already showing (a new load).
  show(url) {
    if (this.frame && this.url === url) return false;
    this.hide();
    const frame = document.createElement('iframe');
    frame.className = 'web';
    frame.src = url;
    frame.title = 'Channel page';
    frame.tabIndex = -1;
    // Sound and full screen for the page; scripts and its own storage, but
    // no popups, forms or navigating the viewer away.
    frame.allow = 'autoplay; fullscreen';
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');
    // Only the viewer's origin (scheme, host, port), never a path: embedded
    // players such as YouTube's refuse to play without it (error 153).
    frame.referrerPolicy = 'strict-origin';
    frame.addEventListener('load', () => {
      if (frame !== this.frame) return;
      this.onLoad();
      // Ask what is on now, rather than wait for the page's next report.
      try { frame.contentWindow.postMessage({ type: 'retro-tv:ask' }, this.origin); } catch { /* not a page that listens */ }
    });
    this.box.insertBefore(frame, this.before);
    this.frame = frame;
    this.url = url;
    this.origin = new URL(url, location.href).origin;
    this.endsAt = null;
    return true;
  }

  hide() {
    if (!this.frame) return;
    const wasFocused = document.activeElement === this.frame;
    this.frame.remove();
    this.frame = null;
    this.url = null;
    this.endsAt = null;
    if (wasFocused) this.#refocus();
  }

  #refocus() {
    if (this.frame && document.activeElement === this.frame) this.frame.blur();
    window.focus();
  }
}
