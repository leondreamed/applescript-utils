import { runAppleScript } from '~/utils/run.js';

export async function inputKeystrokes(keystrokes: string) {
	await runAppleScript(
		`tell application "System Events" to keystroke ${JSON.stringify(
			keystrokes
		)}`
	);
}
