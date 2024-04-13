import { appMessenger } from "@/common/messaging";
import { SettingStorage } from "@/common/storage";

export default defineBackground(async () => {
	const copySettings = async () => {
		const tabIds = (await browser.storage.local.get({ tabs: [] })).tabs;
		const settings = SettingStorage.get();
		for (const tid of tabIds) {
			appMessenger
				.sendMessage("requestCopySettings", settings, tid)
				.catch((err) => {
					dlog("requestCopySettings:", err);
				});
		}
	};

	appMessenger.onMessage("noticeTab", async () => {
		dlog("rcv noticeTab");

		const tabs = (
			await browser.tabs.query({
				url: [
					"https://*.twitch.tv/*",
					"https://twitchtheater.tv/*",
					"https://multistre.am/*",
				],
			})
		)
			.map((t) => t.id)
			.flatMap((id) => (id != null ? [id] : []));

		await browser.storage.local.set({ tabs: tabs });
		copySettings();
	});

	SettingStorage.watch(() => {
		copySettings();
	});
});
