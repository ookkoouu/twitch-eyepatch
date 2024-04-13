import { SettingStorage } from "@/common/localstorage";
import type { TwitchUserLogin } from "@/common/types";
import { createIntegratedDynamicUI } from "@/lib/dynamic-ui-mw";
import { isLoggedInPage } from "@/lib/twitch";
import { type Root, createRoot } from "react-dom/client";
import StreamChatBlock from "./stream-chat";

function getChatUserLogin(uiHost: HTMLElement): TwitchUserLogin | undefined {
	const chatMessage = uiHost.closest(".chat-line__message");
	if (chatMessage === null) {
		return;
	}

	return chatMessage.querySelector<HTMLElement>(
		".chat-line__username span[data-a-user]",
	)?.dataset.aUser as TwitchUserLogin;
}

(async () => {
	dlog("stream-chat: init");

	createIntegratedDynamicUI<Root | undefined>({
		position: "inline",
		append: "last",
		anchor: ".chat-line__icons",

		onMount(wrapper) {
			if (!isLoggedInPage() || !SettingStorage.getItem("quickBlock")) return;
			const userLogin = getChatUserLogin(wrapper);
			if (userLogin === undefined) {
				dlog("failed to get chat");
				return;
			}

			const root = createRoot(wrapper);
			root.render(<StreamChatBlock userLogin={userLogin} />);
			return root;
		},
		onRemove(mounted) {
			mounted?.unmount();
		},
	});

	dlog("stream-chat: loaded");
})();
