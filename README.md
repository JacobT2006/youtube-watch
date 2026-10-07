# youtube-watch

A lightweight VS Code extension that lets you open YouTube in your preferred browser with a single click.

Open YouTube directly from the Activity Bar, choose a browser once, and optionally remember that choice for future launches.

## Features

- Adds a dedicated YouTube view to the Activity Bar
- Opens YouTube in your selected browser
- Lets you choose between System Default, Chrome, Firefox, Edge, and Brave
- Remembers your preferred browser when enabled
- Supports quick access from the Command Palette

## How it works

1. Click the YouTube icon in the Activity Bar.
2. Select a browser from the quick pick list.
3. If you enable the remember option, the extension will reuse that browser automatically.
4. Use the "Open YouTube" action or run "YouTube: Open in Browser" from the Command Palette whenever you want to launch YouTube.

## Commands

This extension contributes the following commands:

- `YouTube: Open in Browser`
  - Opens `https://www.youtube.com` in the selected browser.
- `YouTube: Choose Browser`
  - Lets you pick a browser and optionally save it as your default.

## Requirements

- VS Code `^1.140.0`
- A supported browser installed on your machine:
  - System default browser
  - Google Chrome
  - Mozilla Firefox
  - Microsoft Edge
  - Brave

If you choose a browser that is not installed, the extension may fail to open the page.

## Extension Settings

This extension does not currently expose custom settings via `contributes.configuration`.

## Installation

1. Install the extension from the VS Code Marketplace.
2. Reload VS Code if prompted.
3. Click the YouTube icon in the Activity Bar to start using it.

## Development

```bash
npm install
npm run compile
npm run lint
npm test
```

## Project structure

- `src/extension.ts` — main extension logic and browser selection flow
- `media/` — extension assets
- `package.json` — extension metadata, commands, and activity bar contributions

## Known issues

- Browser selection is only remembered if you explicitly choose the remember option.
- Opening a browser may fail if the selected app is not installed or blocked by the operating system.

## Release notes

### 0.0.1

Initial release of youtube-watch.

- Added YouTube Activity Bar view
- Added browser selection flow
- Added quick browser launch support
- Added ability to remember the preferred browser

## License

This project is distributed under the license specified in the repository.

## Contributing

Contributions are welcome. If you want to improve the extension, open an issue or submit a pull request with your changes.
