import { useCallback, useEffect, useRef, useState } from "react";
import { type Storage } from "../storage";
import { type StorageChangedCallback } from "../types";

export type StorageHook<T> = readonly [
	T,
	{
		set(value: T): Promise<void>;
		setSync(value: T): void;
		get(): Promise<T>;
		getSync(): T;
		reset(): Promise<void>;
	},
];

export const useStorage = <T>(instance: Storage<T>): StorageHook<T> => {
	const isMounted = useRef(false);
	const [renderValue, setRenderValue] = useState<T>(instance.defaultValue);

	const set = useCallback(async (value: T) => instance.set(value), [instance]);
	const setSync = useCallback(
		(value: T) => {
			instance.setSync(value);
		},
		[instance],
	);
	const get = useCallback(async () => instance.get(), [instance]);
	const getSync = useCallback(() => instance.getSync(), [instance]);
	const reset = useCallback(async () => instance.reset(), [instance]);

	useEffect(() => {
		isMounted.current = true;
		setRenderValue(instance.getSync());

		const listener: StorageChangedCallback<T> = (change) => {
			if (change.newValue !== undefined && isMounted.current) {
				setRenderValue(change.newValue);
			}
		};

		instance.onChanged.addListener(listener);

		return () => {
			isMounted.current = false;
			instance.onChanged.removeListener(listener);
		};
	}, [instance]);

	return [renderValue, { set, setSync, get, getSync, reset }] as const;
};
