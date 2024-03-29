import { SettingStorage } from "@/common/storage";
import { createCssSwitch } from "@/lib/css-switch";
import css from "./sub-mode.gen.css?inline";

(async () => {
	dlog("Init");
	const subMode = createCssSwitch("eyepatch-localsub", css);
	SettingStorage.watchItem("subMode", (newValue) => {
		if (newValue) {
			dlog("Enabled");
			subMode.on();
		} else {
			dlog("Disabled");
			subMode.off();
		}
	});

	await sleep(10); // Wait for storage sync
	if (SettingStorage.getItem("subMode")) {
		subMode.on();
	}

	dlog(`Loaded as ${SettingStorage.getItem("subMode")}`);
})();
