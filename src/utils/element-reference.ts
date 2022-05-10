import type { ElementPathPart } from '~/types/element.js';

interface ElementReferenceConstructorProps {
	baseElements: BaseElementReference[];
	elementIndex: number;
}

export class BaseElementReference {
	path: ElementPathPart[];
	pathString: string;
	applicationProcess: string;
	application: string;

	constructor({
		path,
		pathString,
		application,
		applicationProcess,
	}: BaseElementReference) {
		this.path = path;
		this.pathString = pathString;
		this.application = application;
		this.applicationProcess = applicationProcess;
	}
}

export class ElementReference extends BaseElementReference {
	baseElements: BaseElementReference[];
	elementIndex: number;

	constructor({
		baseElements,
		elementIndex,
	}: ElementReferenceConstructorProps) {
		const element = baseElements[elementIndex];
		if (element === undefined) {
			throw new Error(
				`ElementReference#constructor: There is no element at index ${elementIndex}`
			);
		}

		super(element);

		this.baseElements = baseElements;
		this.elementIndex = elementIndex;
	}

	nextElement(): ElementReference | undefined {
		if (this.elementIndex === this.baseElements.length - 1) {
			return undefined;
		}

		return new ElementReference({
			baseElements: this.baseElements,
			elementIndex: this.elementIndex + 1,
		});
	}

	prevElement(): ElementReference | undefined {
		if (this.elementIndex === 0) {
			return undefined;
		}

		return new ElementReference({
			baseElements: this.baseElements,
			elementIndex: this.elementIndex - 1,
		});
	}
}
