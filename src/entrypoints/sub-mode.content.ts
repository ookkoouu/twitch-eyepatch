import { SettingStorage } from "@/common/storage";
import { disableSubMode, enableSubMode } from "@/common/sub-mode";

export default defineContentScript({
	matches: ["https://*.twitch.tv/*"],
	async main() {
		dlog("Init");
		SettingStorage.watchItem("subMode", (newValue) => {
			if (newValue) {
				dlog("Enabled");
				enableSubMode();
			} else {
				dlog("Disabled");
				disableSubMode();
			}
		});

		await sleep(10); // Wait for storage sync
		if (SettingStorage.getItem("subMode")) {
			enableSubMode();
		}

		dlog(`Loaded as ${SettingStorage.getItem("subMode")}`);
	},
});
