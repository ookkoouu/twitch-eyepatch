import { SettingStorage } from "@/common/localstorage";
import domObserver from "@/lib/dom-observer";
import { Selector, getUserFollowedAt, isLoggedInPage } from "@/lib/twitch";
import { getChatMetadata, getCurrentChat } from "@/lib/twitch/chat";
import type {
	TwitchUser,
	TwitchUserId,
	TwitchUserLogin,
	TwitchUserName,
} from "../types";

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
		e.style.display = b ? "none" : "block";
	}
}

(async () => {
	dlog("follower-mode: init");

	await sleep(10); // wait for storage synced
	let requiredDays = SettingStorage.getItem("requiredFollowDays");
	let enabled = SettingStorage.getItem("followerMode");
	const userCache = new Map<TwitchUserId, boolean>();

	if (!isLoggedInPage()) {
		dlog("follower-mode: skipped");
		return;
	}

	domObserver.added(Selector.LiveChat, async (e) => {
		if (!enabled || !(e instanceof HTMLElement)) return;
		hidden(e, true);

		// skip subscriber
		const chatData = getChatMetadata(e);
		if (SettingStorage.getItem("subMode") && !chatData?.user.isSubscriber) {
			// dlog("skip sub!", chatData?.user.userDisplayName);
			return;
		}

		const chatCtn = getCurrentChat();
		if (chatCtn?.channelID == null) return;
		const chat = getChatMetadata(e);
		if (chat?.user?.userLogin == null) return;

		const user: TwitchUser = {
			id: chat.user.userID as TwitchUserId,
			displayName: chat.user.userDisplayName as TwitchUserName,
			login: chat.user.userLogin as TwitchUserLogin,
		};

		const cache = userCache.get(user.id);
		if (cache !== undefined) {
			//dlog("cache hit!", user.displayName);
			hidden(e, cache);
			return;
		}

		if (
			await isQualifiedFollower(
				user.login,
				chatCtn.channelID as TwitchUserId,
				requiredDays,
			)
		) {
			userCache.set(user.id, false);
			hidden(e, false);
			return;
		}

		userCache.set(user.id, true);
		dlog("newbie:", user.login);
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
