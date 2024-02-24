import "@/common/quick-block/profile-block.css";
import { isLoggedInPage } from "@/common/twitch";
import { type TwitchUserLogin } from "@/common/types";
import QuickBlock from "@/components/profile-block";
import { createIntegratedDynamicUI } from "@/lib/dynamic-ui-mw";
import { type Root, createRoot } from "react-dom/client";

const regProfileUrl = /^https:\/\/www\.twitch\.tv\/(\w+)$/;

// Inject block button on user profile page's kebeb menu
export default defineContentScript({
	matches: ["https://www.twitch.tv/*"],
	world: "MAIN",
	async main() {
		dlog("Init");

		if (!isLoggedInPage()) {
			dlog("Canceled");
			return;
		}

		createIntegratedDynamicUI<Root | undefined>({
			position: "inline",
			append: "first",
			anchor: ".tw-balloon>div>div:has(button[data-a-target*=report-button])",
			targetFilter: ["body"],
			onMount(wrapper) {
				const match = regProfileUrl.exec(location.href);
				if (!match) {
					return;
				}

				const userLogin = match[1] as TwitchUserLogin;
				dlog("mount", userLogin);

				const root = createRoot(wrapper);
				root.render(<QuickBlock fetched userLogin={userLogin} />);
				return root;
			},
			onRemove(mounted) {
				dlog("removed");
				mounted?.unmount();
			},
		});

		dlog("Loaded");
	},
});
