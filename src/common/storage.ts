import { KVStorage } from "@okou/webext-storage";

export const DefaultSettings = {
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
