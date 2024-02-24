import { KVStorage, Storage } from "@/lib/webext-storage";
import { type TwitchUser } from "./types";

const DefaultSettings = {
	quickBlock: true,
	subMode: false,
	followerMode: false,
	requiredFollowDays: 60,
	hideReply: false,
};

export type AppSettings = typeof DefaultSettings;

export const SettingStorage = new KVStorage("settings", DefaultSettings, {
	area: "sync",
});

export const BlockListStorage = new Storage<TwitchUser[]>("blockedUsers", []);
