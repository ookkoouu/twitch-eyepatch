import { SettingStorage } from "@/common/localstorage";
import domObserver from "@/lib/dom-observer";
import { Selector } from "@/lib/twitch";
import { getChatMetadata } from "@/lib/twitch/chat";

(async () => {
	dlog("hideReply: Init");

	await sleep(10); // wait for storage synced
	let enabled = SettingStorage.getItem("hideReply");

	domObserver.added(Selector.LiveChat, (e) => {
		if (!enabled || !(e instanceof HTMLElement)) return;
		const chatData = getChatMetadata(e);
		if (chatData === undefined) return;
		if (chatData.reply !== undefined) {
			if (import.meta.env.DEV) {
				e.style.backgroundColor = "red";
			} else {
				e.style.display = "none";
			}
		}
	});

	SettingStorage.watchItem("hideReply", (nv) => {
		enabled = nv;
	});

	dlog("hideReply: Loaded as", enabled);
})();
