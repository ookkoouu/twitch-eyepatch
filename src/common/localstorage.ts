import { KVStorage, LocalstorageDriver } from "@okou/webext-storage";

const DefaultSettings = {
	quickBlock: false,
	subMode: false,
	followerMode: false,
	requiredFollowDays: 60,
	hideReply: false,
};

export const SettingStorage = new KVStorage("settings", DefaultSettings, {
	driver: new LocalstorageDriver({ namespace: "twitcheyepatch_" }),
});
