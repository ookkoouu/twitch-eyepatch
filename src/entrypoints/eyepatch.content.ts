import { SettingStorage } from "@/common/localstorage";
import { mainworldMessenger } from "@/common/messaging-win";

export default defineContentScript({
	matches: [
		"https://*.twitch.tv/*",
		"https://twitchtheater.tv/*",
		"https://multistre.am/*",
	],
	world: "MAIN",
	allFrames: true,
	runAt: "document_idle",
	main() {
		if (!/^https:\/\/(www|clips)\.twitch\.tv/.test(window.origin)) return;
		dlog("injected frame", window.origin);
		import("@/common/sub-mode/entrypoint").catch((err) => dlog(err));
		import("@/common/hide-reply/entrypoint").catch((err) => dlog(err));
		import("@/common/follower-mode/entrypoint").catch((err) => dlog(err));
		import("@/common/quick-block/entrypoint").catch((err) => dlog(err));

		mainworldMessenger.onMessage("copySettings", ({ data }) => {
			SettingStorage.set(data);
		});
	},
});
