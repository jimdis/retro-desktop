# Retro Desktop 3.1

This application was written as the final exam assignment for the course [Client-based webprogramming](https://coursepress.lnu.se/kurs/klientbaserad-webbprogrammering/) at Linnaeus university.

## What is it?
- A single page application written in vanilla JS (no jQuery) inspired by good ol' windows 3.1.
- It sort of emulates a desktop with two applications - a Memory Game and a Card Game.
- The games are implemented as [custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements).
- (Even the playing cards themselves are custom elements taking rank and suit as attributes).
- Client-based static site. No server-side code.
- Try it out [here](https://jimdis.github.io/retro-desktop/)!

## Features
- Full Offline Support: Service worker using [Workbox](https://developers.google.com/web/tools/workbox/).
- Open multiple instances/windows of an app and run independently.
- Drag around windows and icons with mouse.
- Maximize, minimize, restore windows.
- Menu keyboard support (use alt+f or alt+s to access file or settings menu).
- Accessibility: Play the games using keyboard only.
