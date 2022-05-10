import { outdent } from 'outdent';

import { runAppleScript } from '~/utils/run.js';

export async function tellProcess(process: string, script: string) {
	const result = await runAppleScript(outdent`
		tell application "System Events" to tell process ${JSON.stringify(process)}
			${script}
		end tell
	`);
	return result;
}
