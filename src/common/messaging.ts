import { defineExtensionMessaging } from "@webext-core/messaging";
import type { AppSettings } from "./storage";

export type MessageSchema = {
	copySettings(data: AppSettings): void;
	requestCopySettings(data: AppSettings): boolean;
	noticeTab(): void;
};

export const appMessenger = defineExtensionMessaging<MessageSchema>();
