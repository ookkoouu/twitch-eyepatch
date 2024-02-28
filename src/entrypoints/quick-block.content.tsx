import { mainworldMessenger } from "@/common/messaging";
import css from "@/common/quick-block/quick-block.css?inline";
import { isLoggedInPage } from "@/common/twitch";
import { type TwitchUserLogin } from "@/common/types";
import QuickBlock from "@/components/quick-block";
import { createIntegratedDynamicUI } from "@/lib/dynamic-ui-mw";
import { type Root, createRoot } from "react-dom/client";

function getChatUserLogin(uiHost: HTMLElement): TwitchUserLogin | undefined {
	const chatMessage = uiHost.closest(".chat-line__message");
	if (chatMessage === null) {
		return;
	}

	return chatMessage.querySelector<HTMLElement>(
		".chat-line__username span[data-a-user]",
	)?.dataset.aUser as TwitchUserLogin;
}

// Inject block button next to chat hoverd reply button
export default defineContentScript({
	matches: ["https://www.twitch.tv/*"],
	world: "MAIN",
	async main() {
		dlog("Init");
		if (
			!isLoggedInPage() ||
			!(await mainworldMessenger.sendMessage("getAppSettings", "quickBlock"))
		) {
			dlog("Calceled");
		}

		const style = document.createElement("style");
		style.textContent = css;
		style.id = "tcm-asdflghj";
		document.head.append(style);

		// Let enabled = true;
		createIntegratedDynamicUI<Root | undefined>({
			position: "inline",
			append: "last",
			anchor: ".chat-line__icons",

			onMount(wrapper) {
				const userLogin = getChatUserLogin(wrapper);
				if (userLogin === undefined) {
					dlog("failed to get chat");
					return;
				}

				const root = createRoot(wrapper);
				root.render(<QuickBlock userLogin={userLogin} />);
				return root;
			},
			onRemove(mounted) {
				mounted?.unmount();
			},
		});

		dlog("Loaded");
	},
});
