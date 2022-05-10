import { outdent } from 'outdent';

import type { BaseElementReference } from '~/utils/element-reference.js';
import { runAppleScript } from '~/utils/run.js';

export async function clickElement(element: BaseElementReference) {
	await runAppleScript(
		outdent`
			tell application "System Events"
				tell process ${JSON.stringify(element.applicationProcess)}
					set myElement to a reference to ${element.pathString}
					click myElement
				end tell
			end tell
		`
	);
}
