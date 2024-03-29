import type {
	TwitchUser,
	TwitchUserId,
	TwitchUserLogin,
	TwitchUserName,
} from "@/common/types";
import { Failure, type Result, Success } from "@/utils/result";
import type {
	ApolloClient,
	ApolloQueryResult,
	DocumentNode,
	NormalizedCacheObject,
} from "@apollo/client";
import { gql } from "@apollo/client";
import type { GqlUser } from "./gql-types";

type GqlClient = ApolloClient<NormalizedCacheObject>;

type ReactRootContainer = {
	_internalRoot: {
		current: ReactNode;
	};
};

type ReactNode<Props = Record<string, unknown>> = {
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
	memoizedProps: Record<string, unknown> | null;
	memoizedState: Record<string, unknown> | null;
	mode: number;
	nextEffect: ReactNode | null;
	pendingProps: Props | null;
	ref: null | HTMLElement;
	return: ReactNode;
	sibling: ReactNode | null;
	stateNode: HTMLElement;
	tag: number;
	type: string;
};

function searchReactChildren<T>(
	node: ReactNode | undefined,
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

	const { child, sibling } = node;
	if (child !== null || sibling !== null) {
		return (
			searchReactChildren(sibling ?? undefined, predicate, maxDepth, depth) ??
			searchReactChildren(child ?? undefined, predicate, maxDepth, depth + 1)
		);
	}
}

function getReactRoot(target?: Element): ReactNode | undefined {
	if (target === undefined) {
		// biome-ignore lint/style/noParameterAssign: <explanation>
		target = document.querySelector("#root") ?? undefined;
	}
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

export function getGqlClient(): GqlClient | undefined {
	let client: GqlClient | undefined;
	try {
		const root = getReactRoot();
		if (root === undefined) return;

		const node = searchReactChildren<{ client: GqlClient }>(
			root,
			(n) => n.pendingProps?.client != null && !!n.pendingProps.client.query,
		);
		client = node?.pendingProps?.client;
	} catch {}

	return client as GqlClient;
}

export async function graphqlQuery<T>(
	query: DocumentNode,
	variables?: Record<string, unknown>,
): Promise<ApolloQueryResult<T>> {
	const client = getGqlClient();
	if (client === undefined) {
		throw new Error("gql client not found");
	}

	return client.query<T>({ query, variables });
}

export async function graphqlMutation<T>(
	mutation: DocumentNode,
	variables: Record<string, unknown>,
) {
	const client = getGqlClient();
	if (client === undefined) {
		throw new Error("gql client not found");
	}

	return client.mutate<T>({ mutation, variables });
}

export async function getUserByID(
	userId: TwitchUserId,
): Promise<Result<TwitchUser>> {
	const query = gql`
		query TEPGetUserByID($userId: ID!) {
			user(id: $userId) {
				id
				login
				displayName
			}
		}
	`;

	const { data } = await graphqlQuery<{ user: Partial<GqlUser> }>(query, {
		userId,
	}).catch(() => ({ data: null }));
	if (data?.user == null) return new Failure("user not found");

	const user = {
		id: data.user.id as TwitchUserId,
		displayName: data.user.displayName as TwitchUserName,
		login: data.user.login as TwitchUserLogin,
	} satisfies TwitchUser;

	return new Success(user);
}

export async function getUserByLogin(
	userLogin: TwitchUserLogin,
): Promise<Result<TwitchUser>> {
	const query = gql`
		query TEPGetUserByLogin($userLogin: String!) {
			user(login: $userLogin) {
				id
				login
				displayName
			}
		}
	`;

	const { data } = await graphqlQuery<{ user: Partial<GqlUser> }>(query, {
		userLogin,
	}).catch(() => ({ data: null }));
	if (data?.user == null) return new Failure("user not found");

	const user = {
		id: data.user.id as TwitchUserId,
		displayName: data.user.displayName as TwitchUserName,
		login: data.user.login as TwitchUserLogin,
	} satisfies TwitchUser;

	return new Success(user);
}

export async function getBlockedUsers(): Promise<Result<TwitchUser[]>> {
	const query = gql`
		query TEPBlockedUsers {
			currentUser {
				blockedUsers {
					id
					login
					displayName
				}
			}
		}
	`;

	const { data } = await graphqlQuery<{ currentUser: Partial<GqlUser> }>(
		query,
	).catch(() => ({ data: null }));
	if (data?.currentUser?.blockedUsers == null)
		return new Failure("authorized session required");

	const users = data.currentUser.blockedUsers?.map(
		(u) =>
			({
				id: u.id as TwitchUserId,
				displayName: u.displayName as TwitchUserName,
				login: u.login as TwitchUserLogin,
			}) satisfies TwitchUser,
	);
	if (users == null) {
		return new Failure("cannot get blocked users");
	}

	return new Success(users);
}

export async function blockUser(userId: TwitchUserId): Promise<boolean> {
	const mutation = gql`
		mutation TEPBlockUser($input: BlockUserInput!) {
			blockUser(input: $input) {
				targetUser {
					id
				}
			}
		}
	`;

	const input = {
		targetUserID: userId,
		sourceContext: "CHAT",
		reason: "other",
	};

	const { data } = await graphqlMutation<{
		blockUser: { targetUser: Partial<TwitchUser> };
	}>(mutation, {
		input,
	}).catch((error) => {
		dlog("blockUser failed:", error);
		return { data: null };
	});

	if (data == null) return false;
	return data.blockUser.targetUser.id === userId;
}

export async function unblockUser(userId: TwitchUserId): Promise<boolean> {
	const mutation = gql`
		mutation TEPUnblockUser($input: UnblockUserInput!) {
			unblockUser(input: $input) {
				targetUser {
					id
				}
			}
		}
	`;

	const input = {
		targetUserID: userId,
	};
	const { data } = await graphqlMutation<{
		unblockUser: { targetUser: Partial<TwitchUser> };
	}>(mutation, {
		input,
	}).catch((error) => {
		dlog("unblockUser failed:", error);
		return { data: null };
	});
	if (data?.unblockUser?.targetUser?.id == null) {
		return false;
	}

	return data.unblockUser.targetUser.id === userId;
}
