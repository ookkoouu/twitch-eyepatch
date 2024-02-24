import type {
	ContentScriptAnchoredOptions,
	ContentScriptPositioningOptions,
	IntegratedContentScriptUi,
	IntegratedContentScriptUiOptions,
} from "wxt/client";
import domObserver from "./dom-observer";

type Override<T, K extends keyof T, V> = {
	[P in keyof T as P extends K ? never : P]: T[P];
} & {
	[P in keyof T as P extends K ? P : never]-?: V;
};

export function createIntegratedUi<TMounted>(
	options: IntegratedContentScriptUiOptions<TMounted>,
): IntegratedContentScriptUi<TMounted> {
	const wrapper = document.createElement(options.tag || "div");
	wrapper.dataset.wxtIntegrated = "";

	let mounted: TMounted | undefined;
	const mount = () => {
		applyPosition(wrapper, undefined, options);
		mountUi(wrapper, options);
		if (wrapper.isConnected) {
			mounted = options.onMount?.(wrapper);
		}
	};

	const remove = () => {
		options.onRemove?.(mounted);
		wrapper.remove();
	};

	return {
		mounted,
		wrapper,
		mount,
		remove,
	};
}

function applyPosition(
	root: HTMLElement,
	positionedElement: HTMLElement | undefined,
	options: ContentScriptPositioningOptions,
): void {
	// No positioning for inline UIs
	if (options.position === "inline") return;

	if (options.zIndex != null) root.style.zIndex = String(options.zIndex);

	root.style.overflow = "visible";
	root.style.position = "relative";
	root.style.width = "0";
	root.style.height = "0";
	root.style.display = "block";

	if (positionedElement) {
		if (options.position === "overlay") {
			positionedElement.style.position = "absolute";
			if (options.alignment?.startsWith("bottom-"))
				positionedElement.style.bottom = "0";
			else positionedElement.style.top = "0";

			if (options.alignment?.endsWith("-right"))
				positionedElement.style.right = "0";
			else positionedElement.style.left = "0";
		} else {
			positionedElement.style.position = "fixed";
			positionedElement.style.top = "0";
			positionedElement.style.bottom = "0";
			positionedElement.style.left = "0";
			positionedElement.style.right = "0";
		}
	}
}

function getAnchor(options: ContentScriptAnchoredOptions): Element | undefined {
	if (options.anchor == null) return document.body;

	const resolved =
		typeof options.anchor === "function" ? options.anchor() : options.anchor;
	if (typeof resolved === "string")
		return document.querySelector(resolved) ?? undefined;
	return resolved ?? undefined;
}

function mountUi(
	root: HTMLElement,
	options: ContentScriptAnchoredOptions,
): void {
	const anchor = getAnchor(options);
	if (anchor == null)
		throw new Error(
			"Failed to mount content script UI: could not find anchor element",
		);

	switch (options.append) {
		case undefined:
		case "last": {
			anchor.append(root);
			break;
		}

		case "first": {
			anchor.prepend(root);
			break;
		}

		case "replace": {
			anchor.replaceWith(root);
			break;
		}

		case "after": {
			anchor.parentElement?.insertBefore(root, anchor.nextElementSibling);
			break;
		}

		case "before": {
			anchor.parentElement?.insertBefore(root, anchor);
			break;
		}

		default: {
			options.append(anchor, root);
			break;
		}
	}
}

export function createIntegratedDynamicUI<TMounted>(
	options: Override<
		IntegratedContentScriptUiOptions<TMounted>,
		"anchor",
		string | (() => string)
	> & { targetFilter?: string[] },
) {
	const elementUiMap = new WeakMap<
		Element,
		IntegratedContentScriptUi<unknown>
	>();

	const mountUI = async (elm: Element) => {
		const ui = await createIntegratedUi({
			...options,
			anchor: elm,
		});
		elementUiMap.set(elm, ui);
		ui.mount();
	};

	const removeUI = (elm: Element) => {
		const ui = elementUiMap.get(elm);
		if (ui !== undefined) {
			ui.remove();
			elementUiMap.delete(elm);
		}
	};

	const anchor =
		typeof options.anchor === "string" ? options.anchor : options.anchor();
	domObserver.added(anchor, mountUI, { targetFilter: options.targetFilter });
	domObserver.removed(anchor, removeUI);
}

/*
Export function createIframeDynamicUI<TMounted>(
	options: Override<
		IframeContentScriptUiOptions<TMounted>,
		"anchor",
		string | (() => string)
	>
) {
	const elementUiMap = new WeakMap<Element, ContentScriptUi<unknown>>();

	const mountUI = async (elm: Element) => {
		const ui = await createIframeUi({} as ContentScriptContext, {
			...options,
			anchor: elm,
		});
		elementUiMap.set(elm, ui);
		ui.mount();
	};
	const removeUI = (elm: Element) => {
		const ui = elementUiMap.get(elm);
		if (ui !== undefined) {
			ui.remove();
			elementUiMap.delete(elm);
		}
	};

	const anchor =
		typeof options.anchor == "string" ? options.anchor : options.anchor();
	domObserver.added(anchor, mountUI);
	domObserver.removed(anchor, removeUI);
}

export function createShadowRootDynamicUI<TMounted>(
	options: Override<
		ShadowRootContentScriptUiOptions<TMounted>,
		"anchor",
		string | (() => string)
	>
) {
	const elementUiMap = new WeakMap<Element, ContentScriptUi<unknown>>();

	const mountUI = async (elm: Element) => {
		const ui = await createShadowRootUi({} as ContentScriptContext, {
			...options,
			anchor: elm,
		});
		elementUiMap.set(elm, ui);
		ui.mount();
	};
	const removeUI = (elm: Element) => {
		const ui = elementUiMap.get(elm);
		if (ui !== undefined) {
			ui.remove();
			elementUiMap.delete(elm);
		}
	};

	const anchor =
		typeof options.anchor == "string" ? options.anchor : options.anchor();
	domObserver.added(anchor, mountUI);
	domObserver.removed(anchor, removeUI);
}
*/
