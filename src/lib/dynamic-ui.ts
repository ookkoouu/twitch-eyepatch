import type {
	ContentScriptContext,
	ContentScriptUi,
	IframeContentScriptUiOptions,
	IntegratedContentScriptUiOptions,
	ShadowRootContentScriptUiOptions,
} from "wxt/client";
import domObserver from "./dom-observer";

type Override<T, K extends keyof T, V> = {
	[P in keyof T as P extends K ? never : P]: T[P];
} & {
	[P in keyof T as P extends K ? P : never]-?: V;
};

export function createShadowRootDynamicUi<Mounted>(
	context: ContentScriptContext,
	options: Override<
		ShadowRootContentScriptUiOptions<Mounted>,
		"anchor",
		string | (() => string)
	>,
) {
	const elementUiMap = new WeakMap<Element, ContentScriptUi<unknown>>();

	const mountUi = async (elm: Element) => {
		const ui = await createShadowRootUi(context, { ...options, anchor: elm });
		elementUiMap.set(elm, ui);
		ui.mount();
	};

	const removeUi = (elm: Element) => {
		const ui = elementUiMap.get(elm);
		if (ui !== undefined) {
			ui.remove();
			elementUiMap.delete(elm);
		}
	};

	const anchor =
		typeof options.anchor === "string" ? options.anchor : options.anchor();
	domObserver.added(anchor, mountUi);
	domObserver.removed(anchor, removeUi);
}

export function createIntegratedDynamicUi<Mounted>(
	context: ContentScriptContext,
	options: Override<
		IntegratedContentScriptUiOptions<Mounted>,
		"anchor",
		string | (() => string)
	>,
) {
	const elementUiMap = new WeakMap<Element, ContentScriptUi<unknown>>();

	const mountUi = (elm: Element) => {
		const ui = createIntegratedUi(context, { ...options, anchor: elm });
		elementUiMap.set(elm, ui);
		ui.mount();
	};

	const removeUi = (elm: Element) => {
		const ui = elementUiMap.get(elm);
		if (ui !== undefined) {
			ui.remove();
			elementUiMap.delete(elm);
		}
	};

	const anchor =
		typeof options.anchor === "string" ? options.anchor : options.anchor();
	domObserver.added(anchor, mountUi);
	domObserver.removed(anchor, removeUi);
}

export function createIframeDynamicUi<Mounted>(
	context: ContentScriptContext,
	options: Override<
		IframeContentScriptUiOptions<Mounted>,
		"anchor",
		string | (() => string)
	>,
) {
	const elementUiMap = new WeakMap<Element, ContentScriptUi<unknown>>();

	const mountUi = (elm: Element) => {
		const ui = createIframeUi(context, { ...options, anchor: elm });
		elementUiMap.set(elm, ui);
		ui.mount();
	};

	const removeUi = (elm: Element) => {
		const ui = elementUiMap.get(elm);
		if (ui !== undefined) {
			ui.remove();
			elementUiMap.delete(elm);
		}
	};

	const anchor =
		typeof options.anchor === "string" ? options.anchor : options.anchor();
	domObserver.added(anchor, mountUi);
	domObserver.removed(anchor, removeUi);
}
