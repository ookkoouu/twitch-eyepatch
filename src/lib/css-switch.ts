type CssSwitch = {
	on: () => void;
	off: () => void;
	toggle: (b: boolean) => void;
};

export function createCssSwitch(id: string, css: string): CssSwitch {
	return {
		on() {
			const style = document.createElement("style");
			style.id = id;
			style.textContent = css;
			document.head.append(style);
		},
		off() {
			// biome-ignore lint/complexity/noForEach: <explanation>
			document.querySelectorAll(`#${id}`).forEach((e) => e.remove());
		},
		toggle(b: boolean) {
			if (b) {
				this.on();
			} else {
				this.off();
			}
		},
	};
}
