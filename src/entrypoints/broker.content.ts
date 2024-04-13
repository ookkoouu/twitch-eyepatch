import { appMessenger } from "@/common/messaging";
import { mainworldMessenger } from "@/common/messaging-win";

export default defineContentScript({
	matches: [
		"https://*.twitch.tv/*",
		"https://twitchtheater.tv/*",
		"https://multistre.am/*",
	],
	runAt: "document_end",
	async main() {
		dlog("Init");

		await appMessenger.sendMessage("noticeTab", undefined);

		appMessenger.onMessage("requestCopySettings", async ({ data }) => {
			await mainworldMessenger
				.sendMessage("copySettings", data)
				.catch((err) => dlog("send copy:", err));
			return true;
		});

		dlog("Loaded");
	},
});
