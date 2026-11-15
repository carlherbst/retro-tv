# Windows kiosk: the guide on a TV from a Windows PC

<p align="center">
  <a href="../README.md">Home</a> &nbsp;·&nbsp;
  <a href="../docker/README.md">Browser app</a> &nbsp;·&nbsp;
  <a href="../pi/README.md">Batocera Pi</a> &nbsp;·&nbsp;
  <a href="../pi-image/README.md">Retro TV box</a> &nbsp;·&nbsp;
  <b>Windows kiosk</b> &nbsp;·&nbsp;
  <a href="../roku-tv/README.md">Roku</a> &nbsp;·&nbsp;
  <a href="../ersatztv/README.md">ErsatzTV channels</a>
</p>

Any Windows 10/11 PC wired to the TV can be the viewer. No app is needed: the
[browser app](../docker/README.md) runs full screen in Edge or Chrome, with every feature
(guide, HD twins, web channels including YouTube and WeatherStar, watch beacons, the sleep timer).
[`retro-tv-kiosk.bat`](retro-tv-kiosk.bat) is a one-click launcher.

First used on a Windows 11 PC (Ryzen 9800X3D, RTX 5080) driving a 65" LG B7 OLED at
3840×2160@60, 2026-11-15.

## Set up

1. Copy `retro-tv-kiosk.bat` to the PC, for example `C:\RetroTV\`.
2. Double-click it. The guide opens full screen, sound on. Alt+F4 quits.
3. To start it at sign-in: Win+R, `shell:startup`, and put a shortcut to the `.bat` there.

The launcher uses its own browser profile (`%LOCALAPPDATA%\RetroTV-Kiosk`), so it opens even when
Edge or Chrome is already running, and leaves your normal browser alone.

Settings are at the top of the file:

| Setting | Default | What |
|---|---|---|
| `RTV_URL` | `https://retro-tv.projectorion.net/` | The viewer address |
| `RTV_BROWSER` | `edge` | `edge` or `chrome` |
| `RTV_POS` | `0,0` | Which screen to open on, as the screen's top-left corner in desktop pixels. `0,0` is the main display; a TV to the right of a 2560-wide monitor is `2560,0` |

`--autoplay-policy=no-user-gesture-required` lets channels start with sound without a first click.

## Windows settings for the TV

- **HDR off** for the TV output (Settings > System > Display > HDR, or Win+Alt+B). The channels are
  SDR; HDR mode on the desktop greys them out. Turn it back on for HDR games.
- **Resolution** 3840×2160@60 at 200% or 300% scale is fine; the guide scales to the window.
  1920×1080 and letting the TV upscale also works.
- **Sleep and screen off: Never** while the kiosk runs (Settings > System > Power). The viewer's own
  sleep timer stops playback when nobody is watching.
- **Do not disturb** on (Settings > System > Notifications), so toasts do not appear over the guide.
- **TV picture mode**: on the B7, set the HDMI input to PC mode (Home > input icon > PC) for
  sharp text, or leave it on a movie mode for the softer look.

## Remote control

The viewer's keys:

| Key | Guide | Watching |
|---|---|---|
| Arrows | move | up/down change channel; left/right pick a banner button |
| Enter / Space | watch | banner, then press its button |
| Esc / Backspace | back to the show | to the guide |
| Page Up / Page Down | page the guide | channel up / down |
| 0–9 | tune a channel number (up to 3 digits) | same |
| I / M / S | show details / mute / settings | banner / mute / settings |

A keyboard, an air-mouse remote (USB dongle), or a "Windows Media Center" USB IR receiver with its
remote all work. An MCE remote's arrows, OK and Back arrive as keys on Windows; its CH+/CH− usually
arrive as Page Up/Page Down, but check on the PC. The B7's own magic remote cannot drive a PC
(Windows has no HDMI-CEC).
