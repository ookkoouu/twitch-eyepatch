import { mainworldMessenger } from "@/common/messaging";
import { SettingStorage } from "@/common/storage";

export default defineContentScript({
	matches: ["https://*.twitch.tv/*"],
	runAt: "document_start",
	main() {
		dlog("Init");
		mainworldMessenger.onMessage("getAppSettings", ({ data }) => {
			return SettingStorage.getItem(data);
		});

		mainworldMessenger.onMessage("setAppSettings", ({ data }) => {
			SettingStorage.setItem(data.key, data.value);
		});

		dlog("Loaded");
	},
});
