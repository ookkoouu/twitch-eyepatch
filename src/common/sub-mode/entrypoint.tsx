import { createCssSwitch } from "@/lib/css-switch";
import { mainworldMessenger } from "../messaging";
import css from "./sub-mode.gen.css?inline";

(async () => {
	dlog("Init");

	let enabled = false;

	const subMode = createCssSwitch("eyepatch-localsub", css);

	mainworldMessenger.onMessage("onSettingsChanged", ({ data }) => {
		if (data.key === "subMode") {
			enabled = data.value as boolean;
			dlog("subMode enabled:", enabled);
			subMode.toggle(enabled);
		}
	});

	mainworldMessenger
		.sendMessage("getAppSettings", "subMode")
		.then((b) => {
			dlog(`subMode: Loaded as ${b}`);
			enabled = b as boolean;
		})
		.catch(() => undefined);
})();
