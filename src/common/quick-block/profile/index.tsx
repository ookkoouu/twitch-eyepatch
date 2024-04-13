import { BalloonBlockButton } from "@/common/components/balloon-block-button";
import { SettingStorage } from "@/common/localstorage";
import type { TwitchUser, TwitchUserLogin } from "@/common/types";
import { createIntegratedDynamicUI } from "@/lib/dynamic-ui-mw";
import { getUserByLogin, isLoggedInPage } from "@/lib/twitch";
import { type Root, createRoot } from "react-dom/client";

const regProfileUrl = /^https:\/\/www\.twitch\.tv\/(\w+)$/;

async function getUser(): Promise<TwitchUser | undefined> {
	const match = regProfileUrl.exec(location.href);
	if (!match) {
		return;
	}
	const userLogin = match[1] as TwitchUserLogin;
	const result = await getUserByLogin(userLogin);
	if (!result.value) {
		return;
	}
	return result.value;
}

(async () => {
	dlog("profile: init");

	createIntegratedDynamicUI<Root | undefined>({
		position: "inline",
		append: "first",
		anchor: ".tw-balloon>div>div:has(button[data-a-target*=report-button])",
		targetFilter: ["body"],

		onMount(wrapper) {
			if (!isLoggedInPage() || !SettingStorage.getItem("quickBlock")) return;
			const root = createRoot(wrapper);
			getUser().then((user) => {
				if (user === undefined) {
					dlog("failed to get user");
					return;
				}
				root.render(<BalloonBlockButton fetched user={user} />);
			});

			return root;
		},
		onRemove(mounted) {
			mounted?.unmount();
		},
	});

	dlog("profile: loaded");
})();
