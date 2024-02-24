import { useCallback, useEffect, useRef, useState } from "react";
import { type KVStorage } from "../kv";
import { StorageChangedCallback } from "../types";

export type KVStorageHook<T> = readonly [
	T,
	<K extends keyof T>(key: K, value: T[K]) => void,
];

export const useKVStorage = <T extends Record<string, unknown>>(
	instance: KVStorage<T>,
): KVStorageHook<T> => {
	const isMounted = useRef(false);

	const [renderValue, setRenderValue] = useState<T>(instance.getAll());

	const set = useCallback(
		<K extends keyof T>(key: K, value: T[K]) => {
			instance.set(key, value);
		},
		[instance],
	);

	useEffect(() => {
		isMounted.current = true;
		setRenderValue(instance.getAll());

		const listener: StorageChangedCallback<T> = (change) => {
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

	return [renderValue, set] as const;
};
