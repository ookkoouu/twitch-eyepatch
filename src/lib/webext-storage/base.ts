import deepEqual from "fast-deep-equal";
import Browser from "webextension-polyfill";
import { getExtensionStorage, overwriteDefault } from "./lib";
import type {
	JsonTransformer,
	StorageArea,
	StorageAreaName,
	StorageChange,
	StorageChangedCallback,
	StorageChanges,
} from "./types";

export type BaseStorageOptions = {
	area: StorageAreaName;
	transformer: JsonTransformer;
};

const defaultOptions: BaseStorageOptions = {
	area: "local",
	transformer: {
		replacer: (_, v) => v,
		reviver: (_, v) => v,
	},
};

export class BaseStorage<T> {
	readonly key: string;
	readonly defaultValue: T;
	protected internalStorage: StorageArea;
	protected changedListeners = new Set<StorageChangedCallback<T>>();
	protected transformer: JsonTransformer;

	constructor(
		key: string,
		defaultValue: T,
		options?: Partial<BaseStorageOptions>,
	) {
		this.key = key;
		this.defaultValue = defaultValue;
		const owOptions = overwriteDefault(defaultOptions, options);
		this.transformer = owOptions.transformer;
		this.internalStorage = getExtensionStorage(owOptions.area);
		this.internalStorage.onChanged.addListener((changes) => {
			this.changedPublisher(changes);
		});
	}

	protected changedPublisher(changes: StorageChanges) {
		if (!Object.hasOwn(changes, this.key)) {
			return;
		}

		for (const callback of this.changedListeners) {
			const newValue =
				changes[this.key].newValue &&
				JSON.parse(changes[this.key].newValue, this.transformer.reviver);
			const oldValue =
				changes[this.key].oldValue &&
				JSON.parse(changes[this.key].oldValue, this.transformer.reviver);
			if (deepEqual(newValue, oldValue)) {
				continue;
			}

			callback({ newValue, oldValue });
		}
	}

	async set(value: T): Promise<void> {
		return this.internalStorage.set({
			[this.key]: JSON.stringify(value, this.transformer.replacer),
		});
	}

	async get(): Promise<T> {
		const res = await this.internalStorage.get(this.key);
		if (Object.hasOwn(res, this.key)) {
			return JSON.parse(res[this.key], this.transformer.reviver);
		}

		return this.defaultValue;
	}

	protected async rawGet(): Promise<T | undefined> {
		const res = await this.internalStorage.get(this.key);
		if (Object.hasOwn(res, this.key)) {
			return JSON.parse(res[this.key], this.transformer.reviver);
		}
		return undefined;
	}

	onChanged: Pick<
		Browser.Events.Event<(change: StorageChange<T>) => void>,
		"addListener" | "hasListener" | "removeListener"
	> = {
		addListener: (callback: StorageChangedCallback<T>): void => {
			this.changedListeners.add(callback);
		},
		removeListener: (callback: StorageChangedCallback<T>): void => {
			this.changedListeners.delete(callback);
		},
		hasListener: (callback: StorageChangedCallback<T>): boolean =>
			this.changedListeners.has(callback),
	};
}
