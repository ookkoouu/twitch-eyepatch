import css from "./sub-mode.gen.css?inline";

const styleId = "tcm-localsub-css";

export function enableSubMode() {
	const style = document.createElement("style");
	style.textContent = css;
	style.id = styleId;
	document.head.append(style);
}

export function disableSubMode() {
	document.querySelector(`#${styleId}`)?.remove();
}
