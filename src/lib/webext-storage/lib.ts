import type { StorageAreaName } from "./types";

export function overwriteDefault<
	A extends Record<string, unknown>,
	B extends Partial<A>,
>(base: A, overwrites?: B): A {
	if (!overwrites) {
		return base;
	}

	const filteredOverwrites = Object.fromEntries(
		Object.entries(overwrites).filter(
			([k, v]) => Object.hasOwn(base, k) && v !== undefined,
		),
	);
	return { ...base, ...filteredOverwrites };
}

export const getExtensionStorage = (area: StorageAreaName) =>
	browser.storage[area];

export const diffObject = (
	newObject: Record<string, unknown>,
	oldObject: Record<string, unknown>,
) =>
	Object.fromEntries(
		Object.entries(newObject).filter(([k, v]) => v !== oldObject[k]),
	);
