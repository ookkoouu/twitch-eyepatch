import { useCallback, useEffect, useRef, useState } from "react";
import { type MapStorage } from "../map";
import { type StorageChangedCallback } from "../types";

export type MapStorageHook<T> = readonly [
	value: Array<[string, T]>,
	storage: {
		toObject(): Record<string, T>;
		clear(): void;
		delete(key: string): boolean;
		get(key: string): T | undefined;
		has(key: string): boolean;
		set(key: string, value: T): void;
		entries(): IterableIterator<[string, T]>;
		keys(): IterableIterator<string>;
		values(): IterableIterator<T>;
	},
];

export function useMapStorage<K extends string, V>(
	instance: MapStorage<K, V>,
): MapStorageHook<V> {
	const isMounted = useRef(false);

	const [renderValue, setRenderValue] = useState<Array<[K, V]>>(
		instance.defaultValue,
	);

	const toObject = useCallback(() => instance.toObject(), [instance]);
	const clear = useCallback(() => {
		instance.clear();
	}, [instance]);
	const _delete = useCallback((key: K) => instance.delete(key), [instance]);
	const get = useCallback((key: K) => instance.get(key), [instance]);
	const has = useCallback((key: K) => instance.has(key), [instance]);
	const set = useCallback(
		(key: K, value: V) => instance.set(key, value),
		[instance],
	);
	const entries = useCallback(() => instance.entries(), [instance]);
	const keys = useCallback(() => instance.keys(), [instance]);
	const values = useCallback(() => instance.values(), [instance]);

	useEffect(() => {
		isMounted.current = true;
		setRenderValue([...instance.entries()]);

		const listener: StorageChangedCallback<Array<[K, V]>> = (change) => {
			if (change.newValue !== undefined) {
				setRenderValue(change.newValue);
			}
		};

		instance.onChanged.addListener(listener);

		return () => {
			isMounted.current = false;
			instance.onChanged.removeListener(listener);
		};
	}, [instance]);

	return [
		renderValue,
		{
			toObject,
			clear,
			delete: _delete,
			get,
			has,
			set,
			entries,
			keys,
			values,
		},
	] as const;
}
