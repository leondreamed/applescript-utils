import type { ElementPathPart } from '~/types/element.js';

export function pathPartsToPathString(pathParts: ElementPathPart[]) {
	return pathParts.map((part) => part.fullName).join(' of ');
}

export function pathStringToPathParts(pathString: string): ElementPathPart[] {
	const pathPartStrings: string[] = [];

	let curIndex = 0;
	let curPathPartIndex = 0;
	let isQuotationOpen = false;
	while (pathString[curIndex] !== undefined) {
		const curChar = pathString[curIndex];

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
			pathString.slice(curIndex, curIndex + 4) === ' of '
		) {
			pathPartStrings.push(pathString.slice(curPathPartIndex, curIndex));
			curIndex += 4;
			curPathPartIndex = curIndex;
			continue;
		}

		curIndex += 1;
	}

	pathPartStrings.push(pathString.slice(curPathPartIndex));

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

	return pathParts;
}
