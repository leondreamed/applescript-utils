import { outdent } from 'outdent';
import type { Options as PWaitForOptions } from 'p-wait-for';
import pWaitFor from 'p-wait-for';

import type { ElementPathPart, ElementReference } from '~/types/element.js';
import { runAppleScript } from '~/utils/run.js';

export async function getElements(
	processName: string
): Promise<ElementReference[]> {
	const elements = createElementReferences(
		(await runAppleScript(
			outdent`
				tell application "System Events"
				  tell front window of process ${JSON.stringify(processName)}
				    get entire contents
				  end tell
				end tell
			`
		)) as string[]
	);

	return elements;
}

export async function clickElement(element: ElementReference) {
	await runAppleScript(
		outdent`
			tell application "System Events"
				tell process ${element.applicationProcess}
					set myElement to a reference to ${element.pathString}
					click myElement
				end tell
			end tell
		`
	);
}

export function createElementReference(
	elementPathString: string
): ElementReference {
	const pathPartStrings: string[] = [];

	let curIndex = 0;
	let curPathPartIndex = 0;
	let isQuotationOpen = false;
	while (elementPathString[curIndex] !== undefined) {
		const curChar = elementPathString[curIndex];

		if (curChar === '\\') {
			// Skip the escape character
			curIndex += 2;
			continue;
		}

		if (curChar === '"') {
			isQuotationOpen = !isQuotationOpen;
		}

		if (
			!isQuotationOpen &&
			curChar === ' ' &&
			elementPathString.slice(curIndex, curIndex + 4) === ' of '
		) {
			pathPartStrings.push(elementPathString.slice(curPathPartIndex, curIndex));
			curIndex += 4;
			curPathPartIndex = curIndex;
			continue;
		}

		curIndex += 1;
	}

	pathPartStrings.push(elementPathString.slice(curPathPartIndex));

	const pathParts: ElementPathPart[] = pathPartStrings.map((pathPartString) => {
		// If the name is a string
		if (pathPartString.endsWith('"')) {
			const stringStart = pathPartString.indexOf('"');
			// Don't include the `"` characters
			return {
				name: pathPartString.slice(stringStart + 1, -1),
				type: pathPartString.slice(0, stringStart - 1),
				fullName: pathPartString,
			};
		}
		// Otherwise, the name of the element is a number
		else {
			const lastSpaceIndex = pathPartString.lastIndexOf(' ');
			return {
				name: pathPartString.slice(lastSpaceIndex + 1),
				type: pathPartString.slice(0, lastSpaceIndex),
				fullName: pathPartString,
			};
		}
	});

	return {
		application: pathParts.find((part) => part.type === 'application')!.name,
		applicationProcess: pathParts.find(
			(part) => part.type === 'application process'
		)!.name,
		path: pathParts,
		pathString: elementPathString,
	};
}

export function createElementReferences(elementPathStrings: string[]) {
	return elementPathStrings.map((elementPathString) =>
		createElementReference(elementPathString)
	);
}

type WaitForElementProps = {
	elementReference: ElementReference;
	interval?: number;
};
export async function waitForElementExists({
	elementReference,
	interval = 0.1,
}: WaitForElementProps) {
	await runAppleScript(
		outdent`
			tell application "System Events"
				tell process ${JSON.stringify(elementReference.applicationProcess)}
						repeat until exists ${elementReference.pathString}
								delay ${interval}
						end repeat
				end tell
			end tell
		`
	);
}

type WaitForElementHiddenProps = {
	elementReference: ElementReference;
	interval?: number;
};
export async function waitForElementHidden({
	elementReference,
	interval = 0.1,
}: WaitForElementHiddenProps) {
	await runAppleScript(
		outdent`
			tell application "System Events"
				tell process ${JSON.stringify(elementReference.applicationProcess)}
						repeat while exists ${elementReference}
								delay ${interval}
						end repeat
				end tell
			end tell
		`
	);
}

export async function waitForElementMatch(
	windowName: string,
	elementMatcher: (element: ElementReference) => boolean,
	options?: PWaitForOptions
) {
	const matchingElement = await pWaitFor(async () => {
		const elements = await getElements(windowName);
		for (const element of elements) {
			if (elementMatcher(element) !== undefined) {
				return pWaitFor.resolveWith(element);
			}
		}

		return false;
	}, options);

	return matchingElement;
}
