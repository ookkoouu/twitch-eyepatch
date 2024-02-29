import type { TwitchUser, TwitchUserLogin } from "@/common/types";
import { createIntegratedDynamicUI } from "@/lib/dynamic-ui-mw";
import { getUserByLogin, isLoggedInPage } from "@/lib/twitch";
import { type Root, createRoot } from "react-dom/client";
import VodChatBlock from "./vod-chat";

async function getUser(uiHost: HTMLElement): Promise<TwitchUser | undefined> {
	const userLogin = uiHost
		.closest(".vod-message")
		?.querySelector<HTMLElement>(".chat-author__display-name")?.dataset.aUser;
	dlog("login:", userLogin);
	if (userLogin === undefined) return;
	const res = await getUserByLogin(userLogin as TwitchUserLogin);
	if (!res.value) {
		dlog(res.error);
		return;
	}
	return res.value;
}

(async () => {
	dlog("Init");
	if (!isLoggedInPage()) {
		dlog("Calceled");
		return;
	}

	createIntegratedDynamicUI<Root | undefined>({
		position: "inline",
		append: "first",
		anchor: ".video-chat__message-menu .tw-balloon[role=dialog] > div",

		onMount(wrapper) {
			const root = createRoot(wrapper);
			getUser(wrapper).then((user) => {
				if (user === undefined) {
					dlog("failed to get user");
					return;
				}
				root.render(<VodChatBlock user={user} />);
			});
			return root;
		},
		onRemove(mounted) {
			mounted?.unmount();
		},
	});

	dlog("Loaded");
})();
