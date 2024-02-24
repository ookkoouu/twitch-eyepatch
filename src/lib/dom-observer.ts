function isElement(node: Node): node is Element {
	return node.nodeType === Node.ELEMENT_NODE || node instanceof Element;
}

type WatcherOptions = Partial<{
	targetFilter: string[];
}>;

type WatcherCallback = (element: Element, mutation: MutationRecord) => void;

type Watcher = {
	selector: string;
	callback: WatcherCallback;
	options?: WatcherOptions;
};

type IDOMObserver = {
	added: (
		selector: string,
		callback: WatcherCallback,
		options?: WatcherOptions,
	) => () => void;
	removed: (
		selector: string,
		callback: WatcherCallback,
		options?: WatcherOptions,
	) => () => void;
	attribute: (
		selector: string,
		callback: WatcherCallback,
		options?: WatcherOptions,
	) => () => void;
	start: () => void;
	stop: () => void;
};

class DOMObserver implements IDOMObserver {
	protected observer: MutationObserver;
	protected addedWatchers = new Set<Watcher>();
	protected removedWatchers = new Set<Watcher>();
	protected attributeWatchers = new Set<Watcher>();

	constructor() {
		this.observer = new MutationObserver((muts) => {
			this.processMutation(muts);
		});
		this.start();
	}

	start() {
		this.observer.observe(document.documentElement, {
			childList: true,
			subtree: true,
			attributes: true,
		});
	}

	stop() {
		this.observer.disconnect();
	}

	added(
		selector: string,
		callback: WatcherCallback,
		options?: WatcherOptions,
	): () => void {
		const w = { selector, callback, options };
		this.addedWatchers.add(w);
		return () => this.addedWatchers.delete(w);
	}

	removed(
		selector: string,
		callback: WatcherCallback,
		options?: WatcherOptions,
	) {
		const w = { selector, callback, options };
		this.removedWatchers.add(w);
		return () => this.removedWatchers.delete(w);
	}

	attribute(
		selector: string,
		callback: WatcherCallback,
		options?: WatcherOptions,
	) {
		const w = { selector, callback };
		this.attributeWatchers.add(w);
		return () => this.attributeWatchers.delete(w);
	}

	protected processMutation(muts: MutationRecord[]) {
		for (const mut of muts) {
			switch (mut.type) {
				case "childList": {
					this.processChild(mut);
					continue;
				}

				case "attributes": {
					this.processAttribute(mut);
					continue;
				}
			}
		}
	}

	protected processChild(mut: MutationRecord) {
		const processCallback = (w: Watcher, elm: Element, mut: MutationRecord) => {
			// Target itself
			if (elm.matches(w.selector)) {
				w.callback(elm, mut);
			}

			// Target children
			for (const e of elm.querySelectorAll(w.selector)) {
				const target = mut.target;
				if (w.options?.targetFilter) {
					if (
						isElement(target) &&
						w.options.targetFilter.every((s) => target.matches(s))
					) {
						w.callback(e, mut);
					}

					continue;
				}

				w.callback(e, mut);
			}
		};

		for (const node of mut.addedNodes) {
			if (!isElement(node)) {
				continue;
			}

			for (const w of this.addedWatchers) processCallback(w, node, mut);
		}

		for (const node of mut.removedNodes) {
			if (!isElement(node)) {
				continue;
			}

			for (const w of this.removedWatchers) processCallback(w, node, mut);
		}
	}

	protected processAttribute(mut: MutationRecord) {
		const elm = mut.target;
		if (!isElement(elm)) {
			return;
		}

		for (const w of this.attributeWatchers) {
			if (elm.matches(w.selector)) {
				w.callback(elm, mut);
			}
		}
	}
}

export default new DOMObserver();
