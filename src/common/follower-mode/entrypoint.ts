import { SettingStorage } from "@/common/localstorage";
import domObserver from "@/lib/dom-observer";
import { Selector, getUserFollowedAt, isLoggedInPage } from "@/lib/twitch";
import { getChatMetadata, getCurrentChat } from "@/lib/twitch/chat";
import type { TwitchUserId, TwitchUserLogin } from "../types";

async function isQualifiedFollower(
	user: TwitchUserLogin,
	channel: TwitchUserId,
	requiredDays: number,
): Promise<boolean> {
	const { value } = await getUserFollowedAt(user, channel);
	if (value == null) return true;

	const followedAt = new Date(value.followedAt);
	return (
		new Date().getTime() - followedAt.getTime() >
		1000 * 60 * 60 * 24 * requiredDays
	);
}

function hidden(e: HTMLElement, b: boolean) {
	if (import.meta.env.DEV) {
		e.style.backgroundColor = b ? "red" : "";
	} else {
		e.hidden = b;
	}
}

(async () => {
	dlog("follower-mode: init");

	await sleep(10); // wait for storage synced
	let requiredDays = SettingStorage.getItem("requiredFollowDays");
	let enabled = SettingStorage.getItem("followerMode");

	if (!isLoggedInPage()) {
		dlog("follower-mode: skipped");
		return;
	}

	domObserver.added(Selector.LiveChat, async (e) => {
		if (!enabled || !(e instanceof HTMLElement)) return;
		hidden(e, true);

		const chatCtn = getCurrentChat();
		if (chatCtn?.channelID == null) return;
		const chat = getChatMetadata(e);
		if (chat?.user?.userLogin == null) return;

		if (
			await isQualifiedFollower(
				chat.user.userLogin as TwitchUserLogin,
				chatCtn.channelID as TwitchUserId,
				requiredDays,
			)
		) {
			hidden(e, false);
			return;
		}

		dlog("newbie:", chat.user.userLogin);
	});

	SettingStorage.watchItem("followerMode", (nv) => {
		enabled = nv;
	});
	SettingStorage.watchItem("requiredFollowDays", (nv) => {
		dlog("days changed:", nv);
		requiredDays = nv;
	});

	dlog("follower-mode: loaded as", enabled, requiredDays);
})();
