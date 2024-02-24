import css from "./hide-reply.css?inline";

const styleId = "tcm-hidereply-css";

export function enableHideReply() {
	const style = document.createElement("style");
	style.textContent = css;
	style.id = styleId;
	document.head.append(style);
}

export function disableHideReply() {
	document.querySelector(`#${styleId}`)?.remove();
}
