import { Failure, type Result } from "@/utils/result";
import Cookies from "js-cookie";
import type { TwitchUser, TwitchUserLogin } from "../../common/types";
import { getUserByLogin } from "./gql";

export type ReactRootContainer = {
	_internalRoot: {
		current: ReactNode;
	};
};

export type ReactNode<Props = Record<string, unknown>> = {
	alternate: ReactNode | null;
	child: ReactNode | null;
	childExpirationTime: number;
	effectTag: number;
	elementType: string | null;
	expirationTime: number;
	firstEffect: ReactNode | null;
	index: number;
	key: string | null;
	lastEffect: ReactNode | null;
	memoizedProps: Props | null;
	memoizedState: Record<string, unknown> | null;
	mode: number;
	nextEffect: ReactNode | null;
	pendingProps: Props | null;
	ref: null | HTMLElement;
	return: ReactNode;
	sibling: ReactNode | null;
	stateNode: Props;
	tag: number;
	type: string;
};

export function searchReactParents<T>(
	node: ReactNode<unknown> | undefined,
	predicate: (node: Partial<ReactNode<T>>) => boolean,
	maxDepth = 15,
	depth = 0,
): ReactNode<T> | undefined {
	if (node === undefined || depth > maxDepth) {
		return;
	}
	try {
		if (predicate(node as ReactNode<T>)) {
			return node as ReactNode<T>;
		}
	} catch {
		return;
	}

	const { return: parent } = node;
	if (parent != null) {
		return searchReactParents(parent, predicate, maxDepth, depth + 1);
	}
}

export function searchReactChildren<T>(
	node: ReactNode<unknown> | undefined,
	predicate: (node: Partial<ReactNode<T>>) => boolean,
	maxDepth = 15,
	depth = 0,
	pending: ReactNode<unknown>[] = [],
): ReactNode<T> | undefined {
	if (node === undefined || depth > maxDepth) {
		return;
	}
	try {
		if (predicate(node as ReactNode<T>)) {
			return node as ReactNode<T>;
		}
	} catch {
		return;
	}

	const { child, sibling } = node;
	if (child != null) {
		pending.push(child);
	}
	if (sibling != null) {
		pending.push(sibling);
	}
	return searchReactChildren(
		pending.shift(),
		predicate,
		maxDepth,
		depth + 1,
		pending,
	);
}

export function getReactRoot(target?: Element): ReactNode | undefined {
	// biome-ignore lint/style/noParameterAssign:
	target = target ?? document.querySelector("#root") ?? undefined;
	if (target === undefined) return;

	for (let [key, value] of Object.entries(target)) {
		if (/^_reactRootContainer/.exec(key)) {
			value = value as ReactRootContainer;
			return value._internalRoot.current;
		}
		if (/^__reactContainer/.exec(key)) {
			return value as ReactNode;
		}
	}
}

export function getReactInstance<T>(e?: Element): ReactNode<T> | undefined {
	if (e == null) return;
	for (const [key, value] of Object.entries(e)) {
		if (
			key.startsWith("__reactInternalInstance$") ||
			key.startsWith("__reactFiber$")
		) {
			return value as ReactNode<T>;
		}
	}
}

export const Selector = {
	ViewerCard: ".viewer-card",
	ViewerCardName: ".viewer-card-header__display-name a.tw-link",
	ViewerCardKebabButton:
		".viewer-card > div:has(button[data-test-selector=whisper-button]) > div:has(div[data-toggle-balloon-id])",
	LiveChat: ".chat-line__message",
	VodChat: ".video-chat__message-list-wrapper li",
	ClipsChat: ".clips-chat-replay>div",
	ChatBadgeImg: "img.chat-badge",
	ChatContainer: "section[data-test-selector=chat-room-component-layout]",
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

export function getCurrentUser(): TwitchUser | undefined {
	const userStr = Cookies.get("twilight-user");
	if (userStr === undefined) {
		return;
	}
	const { id, login, displayName } = JSON.parse(
		decodeURIComponent(userStr),
	) as TwitchUser;
	return { id, login, displayName };
}

export function isLoggedInPage(): boolean {
	return isDev() || Boolean(Cookies.get("login"));
}

export function getLanguage() {
	return document.documentElement.lang;
}
