import { BaseStorage, type BaseStorageOptions } from "./base";

export type StorageOptions = Record<string, unknown> & BaseStorageOptions;

export class Storage<T> extends BaseStorage<T> {
	protected cache: T;

	constructor(key: string, defaultValue: T, options?: Partial<StorageOptions>) {
		super(key, defaultValue, options);
		this.cache = defaultValue;
		this.pull();
		this.startSync();
	}

	async reset(): Promise<void> {
		this.cache = this.defaultValue;
		return this.push();
	}

	protected startSync() {
		this.onChanged.addListener((changes) => {
			if (changes.newValue !== undefined) {
				this.cache = changes.newValue;
			}
		});
	}

	protected async push(): Promise<void> {
		return super.set(this.cache);
	}

	protected async pull(): Promise<void> {
		const remote = await super.rawGet();
		if (remote !== undefined) {
			this.cache = remote;
			return;
		}
		this.cache = this.defaultValue;
		await this.push();
	}

	async set(value: T): Promise<void> {
		this.cache = value;
		return this.push();
	}

	async get(): Promise<T> {
		return super.get();
	}

	setSync(value: T): void {
		this.cache = value;
		this.push();
	}

	getSync(): T {
		return this.cache;
	}
}
