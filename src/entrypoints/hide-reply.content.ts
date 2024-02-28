import { disableHideReply, enableHideReply } from "@/common/hide-reply";
import { SettingStorage } from "@/common/storage";

export default defineContentScript({
	matches: ["https://*.twitch.tv/*"],
	async main() {
		dlog("Init");
		SettingStorage.watchItem("hideReply", (newValue) => {
			if (newValue) {
				dlog("Enabled");
				enableHideReply();
			} else {
				dlog("Disabled");
				disableHideReply();
			}
		});

		await sleep(10); // Wait for storage sync
		if (SettingStorage.getItem("hideReply")) {
			enableHideReply();
		}

		dlog(`Loaded as ${SettingStorage.getItem("hideReply")}`);
	},
});
