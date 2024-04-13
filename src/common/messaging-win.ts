import { defineWindowMessaging } from "@webext-core/messaging/page";
import type { AppSettings } from "./storage";

export type MessageSchema = {
	copySettings(data: AppSettings): void;
	requestCopySettings(data: AppSettings): void;
};

export const mainworldMessenger = defineWindowMessaging<MessageSchema>({
	namespace: "eyepatch-hNwD2gzX",
	// logger: console,
});
