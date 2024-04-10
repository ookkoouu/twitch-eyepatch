import domObserver from "@/lib/dom-observer";
import { Selector } from "@/lib/twitch";
import { getChatMetadata } from "@/lib/twitch/chat";
import { mainworldMessenger } from "../messaging";

(async () => {
	dlog("Init");

	let enabled = false;
	domObserver.added(Selector.LiveChat, (e) => {
		if (!enabled || !(e instanceof HTMLElement)) return;
		const chatData = getChatMetadata(e);
		if (chatData === undefined) return;
		if (chatData.reply !== undefined) {
			e.style.display = "none";
		}
	});

	mainworldMessenger.onMessage("onSettingsChanged", ({ data }) => {
		if (data.key === "hideReply") {
			enabled = data.value as boolean;
			dlog("hideReply enabled:", enabled);
		}
	});

	mainworldMessenger
		.sendMessage("getAppSettings", "hideReply")
		.then((b) => {
			dlog(`hideReply: Loaded as ${b}`);
			enabled = b as boolean;
		})
		.catch(() => undefined);

	document.body.style.backgroundColor = "red";
})();
