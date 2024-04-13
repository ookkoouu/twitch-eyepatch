import type {
	TwitchUser,
	TwitchUserId,
	TwitchUserLogin,
	TwitchUserName,
} from "@/common/types";
import { Failure, type Result, Success } from "@/utils/result";
import type { PartialDeep } from "@/utils/types";
import type {
	ApolloClient,
	ApolloQueryResult,
	DocumentNode,
	NormalizedCacheObject,
} from "@apollo/client";
import { gql } from "@apollo/client";
import { getReactRoot, searchReactChildren } from "./elements";
import type { GqlUser, GqlUserRelationship } from "./gql-types";

type GqlClient = ApolloClient<NormalizedCacheObject>;

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

export async function getUserFollowedAt(
	userLogin: TwitchUserLogin,
	channelId: TwitchUserId,
): Promise<Result<GqlUserRelationship>> {
	const query = gql`
		query TEPGetFollowedAt($userLogin: String!, $channelId: ID!) {
			user(login: $userLogin) {
				relationship(targetUserID: $channelId) {
					followedAt
				}
			}
		}
	`;

	const { data, error } = await graphqlQuery<PartialDeep<{ user: GqlUser }>>(
		query,
		{
			userLogin,
			channelId,
		},
	).catch((error) => {
		return { data: null, error };
	});

	const relationship = data?.user?.relationship;
	if (relationship?.followedAt == null) {
		return new Failure(error);
	}

	return new Success(relationship as GqlUserRelationship);
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
