import { mainworldMessenger } from "@/common/messaging";
import {
	type AppSettings,
	DefaultSettings,
	SettingStorage,
} from "@/common/storage";

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

		SettingStorage.watch((nv, ov) => {
			for (const e of Object.entries(DefaultSettings)) {
				const [k] = e as [keyof AppSettings, unknown];
				if (ov === undefined || nv[k] !== ov[k]) {
					mainworldMessenger
						.sendMessage("onSettingsChanged", {
							key: k,
							value: nv[k],
						})
						.catch(() => undefined);
				}
			}
		});

		dlog("Loaded");
	},
});
