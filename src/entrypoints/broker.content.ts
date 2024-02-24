import { mainworldMessenger } from "@/common/messaging";
import { SettingStorage } from "@/common/storage";

export default defineContentScript({
	matches: ["https://*.twitch.tv/*"],
	runAt: "document_start",
	main() {
		dlog("Init");
		mainworldMessenger.onMessage("getAppSettings", ({ data }) => {
			return SettingStorage.get(data);
		});

		mainworldMessenger.onMessage("setAppSettings", ({ data }) => {
			SettingStorage.set(data.key, data.value);
		});

		// For quick block
		SettingStorage.watch({
			key: "quickBlock",
			callback(chg) {
				mainworldMessenger.sendMessage("subModeChanged", chg.newValue).catch();
			},
		});

		dlog("Loaded");
	},
});
