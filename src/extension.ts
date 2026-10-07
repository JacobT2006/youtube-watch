// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

class YouTubeViewProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
	getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
		return element;
	}

	getChildren(): vscode.TreeItem[] {
		const item = new vscode.TreeItem('Open YouTube');
		item.command = {
			command: 'youtube-watch.openYouTube',
			title: 'Open YouTube'
		};
		item.iconPath = new vscode.ThemeIcon('play');
		return [item];
	}
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
			await vscode.commands.executeCommand(
				'simpleBrowser.api.open',
				vscode.Uri.parse('https://www.youtube.com'),
				{ viewColumn: vscode.ViewColumn.Beside, preserveFocus: false }
			);
		} catch (error) {
			const detail = error instanceof Error ? error.message : String(error);
			console.error('Unable to open YouTube in the VS Code browser.', error);
			void vscode.window.showErrorMessage(`Unable to open YouTube in the VS Code browser: ${detail}`);
		}
	};

	context.subscriptions.push(
		vscode.commands.registerCommand('youtube-watch.openYouTube', openYouTube)
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
