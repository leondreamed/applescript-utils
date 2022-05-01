import { outdent } from 'outdent';

import { runAppleScript } from '~/utils/run.js';

type WaitForWindowProps = {
	windowName: string;
	processName: string;
	numAttempts?: number;

	/**
	 * Interval to wait for before trying again in seconds (default 0.1)
	 */
	interval?: number;
};
export async function waitForWindow({
	windowName,
	processName,
	numAttempts = 30,
	interval = 0.1,
}: WaitForWindowProps) {
	await runAppleScript(
		outdent`
			tell application "System Events"
				set i to 0
				repeat until exists window ${JSON.stringify(
					windowName
				)} of application process ${JSON.stringify(processName)}
					delay ${interval}
					set i to i + 1
					if i ≥ ${numAttempts} then return
				end repeat
			end tell
		`
	);
}
