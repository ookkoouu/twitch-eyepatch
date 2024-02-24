import { disableHideReply, enableHideReply } from "@/common/hide-reply";
import { SettingStorage } from "@/common/storage";

export default defineContentScript({
	matches: ["https://*.twitch.tv/*"],
	async main() {
		dlog("Init");
		SettingStorage.watch({
			key: "hideReply",
			callback(chg) {
				if (chg.newValue) {
					dlog("Enabled");
					enableHideReply();
				} else {
					dlog("Disabled");
					disableHideReply();
				}
			},
		});

		await sleep(10); // Wait for storage sync
		if (SettingStorage.get("hideReply")) {
			enableHideReply();
		}

		dlog(`Loaded as ${SettingStorage.get("hideReply")}`);
	},
});
