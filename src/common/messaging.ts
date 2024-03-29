import {
	defineCustomEventMessaging,
	defineWindowMessaging,
} from "@webext-core/messaging/page";
import type { AppSettings } from "./storage";

export type MessageSchema = {
	getAppSettings<K extends keyof AppSettings>(data: K): AppSettings[K];
	setAppSettings<K extends keyof AppSettings>(data: {
		key: K;
		value: AppSettings[K];
	}): void;
	subModeChanged(data: boolean): void;
};

export const mainworldMessenger = defineCustomEventMessaging<MessageSchema>({
	namespace: "eyepatch-hNwD2gzX",
	// Logger: console,
});
