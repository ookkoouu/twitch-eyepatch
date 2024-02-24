import { SettingStorage } from "@/common/storage";
import { disableSubMode, enableSubMode } from "@/common/sub-mode";

export default defineContentScript({
	matches: ["https://*.twitch.tv/*"],
	async main() {
		dlog("Init");
		SettingStorage.watch({
			key: "subMode",
			callback(chg) {
				if (chg.newValue) {
					dlog("Enabled");
					enableSubMode();
				} else {
					dlog("Disabled");
					disableSubMode();
				}
			},
		});

		await sleep(10); // Wait for storage sync
		if (SettingStorage.get("subMode")) {
			enableSubMode();
		}

		dlog(`Loaded as ${SettingStorage.get("subMode")}`);
	},
});
