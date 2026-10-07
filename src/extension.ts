// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import open = require('open');

type BrowserId = 'default' | 'chrome' | 'firefox' | 'edge' | 'brave';

const browserStateKey = 'youtube-watch.selectedBrowser';
const browsers: Array<{ id: BrowserId; label: string; description: string }> = [
	{ id: 'default', label: 'System Default', description: 'Open links in your default browser' },
	{ id: 'chrome', label: 'Google Chrome', description: 'Open links in Google Chrome' },
	{ id: 'firefox', label: 'Mozilla Firefox', description: 'Open links in Mozilla Firefox' },
	{ id: 'edge', label: 'Microsoft Edge', description: 'Open links in Microsoft Edge' },
	{ id: 'brave', label: 'Brave', description: 'Open links in Brave' }
];

class YouTubeViewProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
	getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
		return element;
	}

	getChildren(): vscode.TreeItem[] {
		const openItem = new vscode.TreeItem('Open YouTube');
		openItem.command = {
			command: 'youtube-watch.openYouTube',
			title: 'Open YouTube'
		};
		openItem.iconPath = new vscode.ThemeIcon('play');

		const chooseBrowserItem = new vscode.TreeItem('Choose Browser');
		chooseBrowserItem.command = {
			command: 'youtube-watch.chooseBrowser',
			title: 'Choose Browser'
		};
		chooseBrowserItem.iconPath = new vscode.ThemeIcon('globe');

		return [openItem, chooseBrowserItem];
	}
}

interface BrowserQuickPickItem extends vscode.QuickPickItem {
	id: BrowserId;
}

interface BrowserSelection {
	browser: BrowserId;
	remember: boolean;
}

async function chooseBrowser(current?: BrowserId): Promise<BrowserSelection | undefined> {
	return new Promise((resolve) => {
		const quickPick = vscode.window.createQuickPick<BrowserQuickPickItem>();
		let remember = false;
		const rememberButton: vscode.QuickInputButton = {
			iconPath: new vscode.ThemeIcon('circle-large-outline'),
			tooltip: 'Remember my choice'
		};

		quickPick.title = 'Open YouTube';
		quickPick.placeholder = 'Choose a browser. Toggle the checkbox icon to remember your choice.';
		quickPick.ignoreFocusOut = true;
		quickPick.items = browsers.map((browser) => ({
			label: browser.label,
			description: browser.id === current ? `Current selection · ${browser.description}` : browser.description,
			id: browser.id,
			buttons: [rememberButton]
		}));

		const finish = (selection?: BrowserSelection) => {
			quickPick.dispose();
			resolve(selection);
		};

		quickPick.onDidTriggerItemButton(({ item }) => {
			remember = !remember;
			const updatedButton: vscode.QuickInputButton = {
				iconPath: new vscode.ThemeIcon(remember ? 'check' : 'circle-large-outline'),
				tooltip: remember ? 'Choice will be remembered' : 'Remember my choice'
			};
			const updatedItems = quickPick.items.map((candidate) => ({
				...candidate,
				buttons: [updatedButton]
			}));
			quickPick.items = updatedItems;
			const activeItem = updatedItems.find((candidate) => candidate.id === item.id);
			if (activeItem) {
				quickPick.activeItems = [activeItem];
			}
		});
		quickPick.onDidAccept(() => {
			const selected = quickPick.selectedItems[0];
			if (selected) {
				finish({ browser: selected.id, remember });
			}
		});
		quickPick.onDidHide(() => finish());
		quickPick.show();
	});
}

async function openInBrowser(browser: BrowserId): Promise<void> {
	const url = 'https://www.youtube.com';
	if (browser === 'default') {
		const opened = await vscode.env.openExternal(vscode.Uri.parse(url));
		if (!opened) {
			throw new Error('VS Code could not open your default browser.');
		}
		return;
	}

	const browserApps: Record<Exclude<BrowserId, 'default'>, string | readonly string[]> = {
		chrome: open.apps.chrome,
		firefox: open.apps.firefox,
		edge: open.apps.edge,
		brave: process.platform === 'darwin'
			? 'Brave Browser'
			: process.platform === 'win32'
				? 'brave'
				: 'brave-browser'
	};

	await open(url, { app: { name: browserApps[browser] } });
}

// This is called when extension is activated
// Extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "youtube-watch" is now active!'); // Save example notifications like this (later)

	context.subscriptions.push(
		vscode.window.registerTreeDataProvider('youtubeWatcher.home', new YouTubeViewProvider())
	);

	const openYouTube = async () => {
		try {
			let browser = context.globalState.get<BrowserId>(browserStateKey);
			if (!browser) {
				const selection = await chooseBrowser();
				if (!selection) {
					return;
				}
				browser = selection.browser;
				if (selection.remember) {
					await context.globalState.update(browserStateKey, browser);
				}
			}

			await openInBrowser(browser);
		} catch (error) {
			const detail = error instanceof Error ? error.message : String(error);
			console.error('Unable to open YouTube in the selected browser.', error);
			void vscode.window.showErrorMessage(`Unable to open YouTube in the selected browser: ${detail}`);
		}
	};

	const selectBrowser = async () => {
		const current = context.globalState.get<BrowserId>(browserStateKey);
		const selection = await chooseBrowser(current);
		if (selection) {
			await context.globalState.update(browserStateKey, selection.remember ? selection.browser : undefined);
			const rememberedMessage = selection.remember ? ' This choice will be remembered.' : ' You will be asked again next time.';
			void vscode.window.showInformationMessage(
				`YouTube browser set to ${browsers.find((browser) => browser.id === selection.browser)?.label ?? selection.browser}.${rememberedMessage}`
			);
		}
	};

	context.subscriptions.push(
		vscode.commands.registerCommand('youtube-watch.openYouTube', openYouTube),
		vscode.commands.registerCommand('youtube-watch.chooseBrowser', selectBrowser)
	);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('youtube-watch.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from youtube-watch!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
