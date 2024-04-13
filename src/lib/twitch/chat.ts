import { Selector, getReactInstance, searchReactParents } from "./elements";

export type ChatMessage = {
	badges: Record<string, string>;
	badgeDynamicData: Record<string, string>;
	bits: number;
	user: User;
	messageParts: MessagePart[];
	messageBody: string;
	deleted: boolean;
	banned: boolean;
	hidden: boolean;
	timestamp: number;
	type: number;
	messageType: number;
	id: string;
	isFirstMsg: boolean;
	isVip?: boolean;
	reply?: MessageReply;
};

export type MessagePart = {
	type: number;
	content: Record<string, unknown> | string;
};

export type MessageReply = {
	parentMsgId: string;
	parentDeleted: boolean;
	parentUid: string;
	parentUserLogin: string;
	parentDisplayName: string;
	parentMessageBody: string;
	threadParentMsgId: string;
	threadParentDeleted: boolean;
	threadParentUserLogin: string;
};

export type User = {
	userDisplayName: string;
	isIntl: boolean;
	userLogin: string;
	userID: string;
	userType: string;
	color: string;
	isSubscriber: boolean;
};

export function getChatMetadata(e: Element): ChatMessage | undefined {
	const reactNode = searchReactParents<{ message: unknown }>(
		getReactInstance(e),
		(n) => n?.pendingProps?.message != null,
		5,
	);
	return (reactNode?.pendingProps?.message as ChatMessage) ?? undefined;
}

export type ChatContainer = {
	channelDisplayName: string;
	channelID: string;
	channelLogin: string;
};

export function getCurrentChat(): ChatContainer | undefined {
	const reactNode = searchReactParents<{ props?: { onSendMessage?: unknown } }>(
		getReactInstance(
			document.querySelector(Selector.ChatContainer) ?? undefined,
		),
		(n) => n.stateNode?.props?.onSendMessage != null,
	);
	return (reactNode?.stateNode.props as ChatContainer) ?? undefined;
}
