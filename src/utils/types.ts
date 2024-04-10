export type PartialDeep<T> = keyof T extends never
	? T
	: { [P in keyof T]?: PartialDeep<T[P]> };

export type RequiredDeep<T> = keyof T extends never
	? T
	: { [P in keyof T]-?: RequiredDeep<T[P]> };

export type RecordKV<
	T extends Record<string, unknown>,
	K extends keyof T = keyof T,
> = K extends K ? { key: K; value: T[K] } : never;
