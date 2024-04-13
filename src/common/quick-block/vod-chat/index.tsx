import { BalloonBlockButton } from "@/common/components/balloon-block-button";
import { SettingStorage } from "@/common/localstorage";
import type { TwitchUser, TwitchUserLogin } from "@/common/types";
import { createIntegratedDynamicUI } from "@/lib/dynamic-ui-mw";
import { getUserByLogin, isLoggedInPage } from "@/lib/twitch";
import { type Root, createRoot } from "react-dom/client";

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
	dlog("vod-chat: init");

	createIntegratedDynamicUI<Root | undefined>({
		position: "inline",
		append: "first",
		anchor: ".video-chat__message-menu .tw-balloon[role=dialog] > div",

		onMount(wrapper) {
			if (!isLoggedInPage() || !SettingStorage.getItem("quickBlock")) return;
			const root = createRoot(wrapper);
			getUser(wrapper).then((user) => {
				if (user === undefined) {
					dlog("failed to get user");
					return;
				}
				root.render(
					<BalloonBlockButton user={user} style={{ padding: "0 0.5rem" }} />,
				);
			});
			return root;
		},
		onRemove(mounted) {
			mounted?.unmount();
		},
	});

	dlog("vod-chat: loaded");
})();
