import Browser from "webextension-polyfill";
import { Storage, type StorageOptions } from "./storage";

export type MapStorageOptions<K extends string, V> = {
	defaultValue: Record<K, V> | Array<[K, V]>;
} & StorageOptions;

export class MapStorage<K extends string, V> implements Map<K, V> {
	protected storage: Storage<Array<[K, V]>>;
	protected cache: Map<K, V>;
	readonly defaultValue: Array<[K, V]>;
	get size(): number {
		return this.cache.size;
	}

	onChanged: Pick<
		Browser.Events.Event<
			(change: { newValue?: Array<[K, V]>; oldValue?: Array<[K, V]> }) => void
		>,
		"addListener" | "hasListener" | "removeListener"
	>;

	constructor(key: string, options?: Partial<MapStorageOptions<K, V>>) {
		let init = options?.defaultValue ?? [];
		init = Array.isArray(init) ? init : (Object.entries(init) as [K, V][]);
		this.defaultValue = init;
		this.storage = new Storage(key, init, options);
		this.cache = new Map<K, V>();
		this.onChanged = this.storage.onChanged;
	}

	protected startSync() {
		this.storage.onChanged.addListener((change) => {
			if (change.newValue === undefined) {
				return;
			}

			this.cache = new Map<K, V>(change.newValue);
		});
	}

	protected async save() {
		return this.storage.set([...this.cache]);
	}

	protected async restore() {
		const remote = await this.storage.get();
		this.cache = new Map(remote);
	}

	toObject(): Record<K, V> {
		return Object.fromEntries(this.cache.entries()) as Record<K, V>;
	}

	clear(): void {
		this.cache.clear();
	}

	delete(key: K): boolean {
		const res = this.cache.delete(key);
		this.save();
		return res;
	}

	forEach(
		callbackfn: (value: V, key: K, map: Map<K, V>) => void,
		thisArg?: unknown,
	): void {
		this.cache.forEach(callbackfn, thisArg);
	}

	get(key: K): V | undefined {
		return this.cache.get(key);
	}

	has(key: K): boolean {
		return this.cache.has(key);
	}

	set(key: K, value: V): this {
		this.cache.set(key, value);
		this.save();
		return this;
	}

	entries(): IterableIterator<[K, V]> {
		return this.cache.entries();
	}

	keys(): IterableIterator<K> {
		return this.cache.keys();
	}

	values(): IterableIterator<V> {
		return this.cache.values();
	}

	[Symbol.iterator](): IterableIterator<[K, V]> {
		return this.cache.entries();
	}

	[Symbol.toStringTag] = "MapStorage";
}
