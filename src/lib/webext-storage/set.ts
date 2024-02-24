import type { Events } from "webextension-polyfill";
import { Storage, type StorageOptions } from "./storage";

export type SetStorageOptions<T> = {
	defaultValue: T[];
} & StorageOptions;

export class SetStorage<T> implements Set<T> {
	protected storage: Storage<T[]>;
	protected cache: Set<T>;
	readonly defaultValue: T[];
	get size(): number {
		return this.cache.size;
	}

	onChanged: Pick<
		Events.Event<(change: { newValue?: T[]; oldValue?: T[] }) => void>,
		"addListener" | "hasListener" | "removeListener"
	>;

	constructor(key: string, options?: Partial<SetStorageOptions<T>>) {
		const init = options?.defaultValue ?? [];
		this.defaultValue = init;
		this.storage = new Storage(key, init, options);
		this.cache = new Set(init);
		this.onChanged = this.storage.onChanged;
	}

	protected startSync() {
		this.storage.onChanged.addListener((change) => {
			if (change.newValue === undefined) {
				return;
			}

			this.cache = new Set(change.newValue);
		});
	}

	protected async save() {
		return this.storage.set([...this.cache]);
	}

	protected async restore() {
		const remote = await this.storage.get();
		this.cache = new Set(remote);
	}

	add(value: T): this {
		this.cache.add(value);
		this.save();
		return this;
	}

	clear(): void {
		this.cache.clear();
		this.save();
	}

	delete(value: T): boolean {
		const res = this.cache.delete(value);
		this.save();
		return res;
	}

	forEach(
		callbackfn: (value: T, value2: T, set: Set<T>) => void,
		thisArg?: unknown,
	): void {
		this.cache.forEach(callbackfn, thisArg);
	}

	has(value: T): boolean {
		return this.cache.has(value);
	}

	entries(): IterableIterator<[T, T]> {
		return this.cache.entries();
	}

	keys(): IterableIterator<T> {
		return this.cache.keys();
	}

	values(): IterableIterator<T> {
		return this.cache.values();
	}

	[Symbol.iterator](): IterableIterator<T> {
		return this.cache.values();
	}

	[Symbol.toStringTag] = "SetStorage";
}
