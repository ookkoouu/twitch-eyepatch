import { defineCustomEventMessaging } from "@webext-core/messaging/page";
import type { AppSettings } from "./storage";

export type MessageSchema = {
	getAppSettings<K extends keyof AppSettings>(data: K): AppSettings[K];
	setAppSettings(data: RecordKV<AppSettings>): void;
	onSettingsChanged<K extends keyof AppSettings>(data: {
		key: K;
		value: AppSettings[K];
	}): number;
};

export const mainworldMessenger = defineCustomEventMessaging<MessageSchema>({
	namespace: "eyepatch-hNwD2gzX",
	// logger: console,
});
