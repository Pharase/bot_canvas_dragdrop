# bot_canvas_dragdrop

A lightweight bot for automating interactions on canvas-based webpages, with support for drag-and-drop operations.

## Overview

`bot_canvas_dragdrop` simulates user actions on HTML5 `<canvas>` elements in a browser environment. It is designed to automate drag-and-drop workflows where standard DOM event approaches fall short — useful for testing, automation, or scripted interactions on canvas-based UIs.

## Features

- Automates drag-and-drop actions on `<canvas>` elements
- Simulates mouse/pointer events (mousedown, mousemove, mouseup)
- Configurable start and end coordinates for drag operations
- Suitable for canvas-based web apps, games, or drawing tools

## Requirements

- A modern web browser (Chrome, Firefox, or equivalent)
- Browser Developer Console access, **or** a runtime environment such as:
  - [Node.js](https://nodejs.org/) with a headless browser (e.g., Puppeteer)
  - A browser extension or userscript runner (e.g., Tampermonkey)

## Getting Started

### Clone the repository

```bash
git clone https://github.com/Pharase/bot_canvas_dragdrop.git
cd bot_canvas_dragdrop
```

### Install dependencies (if applicable)

```bash
npm install
```

### Usage

Configure the target canvas element and drag coordinates in the script, then run it in your browser console or via a headless browser:

```js
// Example: drag from (100, 150) to (300, 200) on the canvas
dragOnCanvas(canvas, { x: 100, y: 150 }, { x: 300, y: 200 });
```

Or run via Puppeteer:

```bash
node index.js
```

## Configuration

| Option | Description | Default |
|---|---|---|
| `targetSelector` | CSS selector for the canvas element | `'canvas'` |
| `startX / startY` | Starting coordinates of the drag | `0, 0` |
| `endX / endY` | Ending coordinates of the drag | `100, 100` |
| `delay` | Delay between mouse events (ms) | `50` |

## How It Works

The bot dispatches a sequence of synthetic mouse events on the canvas element:

1. `mousedown` at the start position
2. A series of `mousemove` events interpolated between start and end
3. `mouseup` at the end position

This mimics a natural drag gesture as closely as possible within the browser event model.

## License

MIT

## Author

[Pharase](https://github.com/Pharase)
