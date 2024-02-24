export type Result<S, E = string> =
	| {
			value: S;
			error?: undefined;
	  }
	| {
			value?: undefined;
			error: E;
	  };

export class Success<T> {
	value: T;
	error = undefined;
	constructor(v: T) {
		this.value = v;
	}
}

export class Failure<T> {
	value = undefined;
	error: T;
	constructor(e: T) {
		this.error = e;
	}
}
