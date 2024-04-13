import { SettingStorage } from "@/common/localstorage";
import { createCssSwitch } from "@/lib/css-switch";
import css from "./sub-mode.gen.css?inline";

(async () => {
	dlog("sub-mode: Init");

	await sleep(10); // wait for storage synced

	const subMode = createCssSwitch("eyepatch-localsub", css);

	SettingStorage.watchItem("subMode", (nv) => {
		dlog("subMode enabled:", nv);
		subMode.toggle(nv);
	});

	const enabled = SettingStorage.getItem("subMode");
	if (enabled) {
		subMode.on();
	}

	dlog("subMode: Loaded as", enabled);
})();
