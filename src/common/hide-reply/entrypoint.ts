import { SettingStorage } from "@/common/storage";
import { createCssSwitch } from "@/lib/css-switch";
import css from "./hide-reply.css?inline";

(async () => {
	dlog("Init");
	const hideReply = createCssSwitch("eyepatch-localsub", css);
	SettingStorage.watchItem("hideReply", (newValue) => {
		if (newValue) {
			dlog("Enabled");
			hideReply.on();
		} else {
			dlog("Disabled");
			hideReply.off();
		}
	});

	await sleep(10); // Wait for storage sync
	if (SettingStorage.getItem("hideReply")) {
		hideReply.on();
	}

	dlog(`Loaded as ${SettingStorage.getItem("hideReply")}`);
})();
