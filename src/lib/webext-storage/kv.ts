import type { Events } from "webextension-polyfill";
import { diffObject } from "./lib";
import { Storage, type StorageOptions } from "./storage";
import type { KVEntries, StorageChange, Watcher } from "./types";

export type KVStorageOptions = StorageOptions;

export class KVStorage<T extends KVEntries> {
	protected storage: Storage<T>;
	readonly defaultValue: T;
	protected watchers = new Set<Watcher<T>>();
	onChanged: Pick<
		Events.Event<(change: { newValue?: T; oldValue?: T }) => void>,
		"addListener" | "hasListener" | "removeListener"
	>;

	constructor(key: string, entries: T, options?: Partial<KVStorageOptions>) {
		this.storage = new Storage(key, entries, options);
		this.defaultValue = entries;
		this.onChanged = this.storage.onChanged;
		this.startWatch();
	}

	protected startWatch() {
		this.storage.onChanged.addListener((change: StorageChange<T>) => {
			if (this.watchers.size === 0) {
				return;
			}
			const newValueObject = change.newValue;
			const oldValueObject = change.oldValue;
			if (newValueObject === undefined || oldValueObject === undefined) {
				return;
			}

			const diff = diffObject(newValueObject, oldValueObject);
			for (const w of this.watchers) {
				if (!Object.hasOwn(diff, w.key)) {
					continue;
				}

				w.callback({
					newValue: newValueObject[w.key],
					oldValue: oldValueObject[w.key],
				});
			}
		});
	}

	set<K extends keyof T>(key: K, value: T[K]): void {
		const map = this.getAll();
		map[key] = value;
		this.storage.set(map);
	}

	get<K extends keyof T>(key: K): T[K] {
		const map = this.getAll();
		return map[key];
	}

	getAll(): T {
		return this.storage.getSync();
	}

	reset(): void {
		this.storage.set(this.defaultValue);
	}

	watch(watcher: Watcher<T>) {
		this.watchers.add(watcher);
	}

	unwatch(watcher: Watcher<T>) {
		this.watchers.delete(watcher);
	}
}
