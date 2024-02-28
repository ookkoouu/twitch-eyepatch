import { getUserByLogin, isLoggedInPage } from "@/common/twitch";
import type { TwitchUser, TwitchUserLogin } from "@/common/types";
import QuickBlockVod from "@/components/quick-block-vod";
import { createIntegratedDynamicUI } from "@/lib/dynamic-ui-mw";
import { type Root, createRoot } from "react-dom/client";

async function getUserVod(
	uiHost: HTMLElement,
): Promise<TwitchUser | undefined> {
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

export default defineContentScript({
	matches: ["https://www.twitch.tv/*"],
	world: "MAIN",
	async main() {
		dlog("Init");
		if (!isLoggedInPage()) {
			dlog("Calceled");
		}

		createIntegratedDynamicUI<Root | undefined>({
			position: "inline",
			append: "first",
			anchor: ".video-chat__message-menu .tw-balloon[role=dialog] > div",

			onMount(wrapper) {
				const root = createRoot(wrapper);
				getUserVod(wrapper).then((user) => {
					if (user === undefined) {
						return dlog("failed to get user");
					}
					root.render(<QuickBlockVod user={user} />);
				});
				return root;
			},
			onRemove(mounted) {
				mounted?.unmount();
			},
		});

		dlog("Loaded");
	},
});
