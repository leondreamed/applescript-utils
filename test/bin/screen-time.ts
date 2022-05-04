import { openSystemPreferencesPane } from '~/index.js';

await openSystemPreferencesPane({
	paneId: 'com.apple.preference.screentime',
	anchor: 'Options',
	windowName: 'Screen Time',
});
