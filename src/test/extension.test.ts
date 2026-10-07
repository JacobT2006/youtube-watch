import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
	test('contributes a persistent YouTube activity bar view', () => {
		const extension = vscode.extensions.all.find(
			(candidate) => candidate.packageJSON.name === 'youtube-watch'
		);
		assert.ok(extension);

		const manifest = extension.packageJSON;
		const container = manifest.contributes.viewsContainers.activitybar.find(
			(item: { id: string }) => item.id === 'youtubeWatcher'
		);
		assert.ok(container);
		assert.strictEqual(container.title, 'YouTube');
		assert.ok(fs.existsSync(path.join(extension.extensionPath, container.icon)));
		assert.ok(
			manifest.contributes.views.youtubeWatcher.some(
				(item: { id: string }) => item.id === 'youtubeWatcher.home'
			)
		);
		assert.ok(!manifest.contributes.menus?.['editor/title']);
	});
});
