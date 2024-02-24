import { Failure, type Result } from "@/utils/result";
import { type TwitchUser, type TwitchUserLogin } from "../types";
import { getUserByLogin } from "./gql";

export const Selector = {
	ViewerCard: ".viewer-card",
	ViewerCardName: ".viewer-card-header__display-name a.tw-link",
	ViewerCardKebabButton:
		".viewer-card > div:has(button[data-test-selector=whisper-button]) > div:has(div[data-toggle-balloon-id])",
	LiveChat: ".chat-line__message",
	VodChat: ".video-chat__message-list-wrapper li",
	ClipsChat: ".clips-chat-replay>div",
	ChatBadgeImg: "img.chat-badge",
};

export function getViewerCardName() {
	return (
		document.querySelector(Selector.ViewerCardName)?.textContent ?? undefined
	);
}

export function getViewerCardUserLogin(): Result<TwitchUserLogin> {
	const a = document.querySelector<HTMLAnchorElement>(Selector.ViewerCardName);
	if (a == null) {
		return new Failure("viewer card not found");
	}

	return new Success(a.href.slice(1) as TwitchUserLogin);
}

export function getViewerCardKebabButton() {
	return document.querySelector(Selector.ViewerCardKebabButton) ?? undefined;
}

export async function getViewerCardUser(): Promise<Result<TwitchUser>> {
	const login = document
		.querySelector<HTMLAnchorElement>(Selector.ViewerCardName)
		?.href.slice(1) as TwitchUserLogin;
	if (login == null) {
		return new Failure("viewer card not found");
	}

	return getUserByLogin(login);
}

export function getCurrentUser(): TwitchUser {
	const { id, login, displayName } = JSON.parse(
		// @ts-expect-error cookies
		decodeURIComponent(window.cookies["twilight-user"]),
	);
	return { id, login, displayName };
}

export function isLoggedInPage() {
	// @ts-expect-error cookies
	return isDev() ? true : Boolean(cookies.login);
}

export function getLanguage() {
	return document.documentElement.lang;
}
