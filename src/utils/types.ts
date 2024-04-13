export type PartialDeep<T> = keyof T extends never
	? T
	: { [P in keyof T]?: PartialDeep<T[P]> };

export type RequiredDeep<T> = keyof T extends never
	? T
	: { [P in keyof T]-?: RequiredDeep<T[P]> };
