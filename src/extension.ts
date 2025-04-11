import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	// Register a new Webview View Provider
	const provider = new YouTubeViewProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(YouTubeViewProvider.viewType, provider)
	);
}

class YouTubeViewProvider implements vscode.WebviewViewProvider {
	public static readonly viewType = 'youtubeWatcher.youtubeView';
	private _view?: vscode.WebviewView;

	constructor(private readonly _extensionUri: vscode.Uri) {}

	resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken
	) {
		this._view = webviewView;

		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [this._extensionUri]
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
	}

	private _getHtmlForWebview(webview: vscode.Webview): string {
		return `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>YouTube</title>
				<style>
					html, body {
						margin: 0;
						padding: 0;
						width: 100%;
						height: 100%;
						overflow: hidden;
					}
					iframe {
						width: 100%;
						height: 100%;
						border: none;
					}
				</style>
			</head>
			<body>
				<iframe src="https://m.youtube.com" sandbox="allow-scripts allow-forms allow-same-origin allow-popups"></iframe>
			</body>
			</html>
		`;
	}
}

export function deactivate() {}