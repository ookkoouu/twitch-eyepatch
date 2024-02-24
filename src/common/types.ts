export type TwitchUserId = Brand<string, "UserID">;
export type TwitchUserLogin = Brand<string, "UserLogin">;
export type TwitchUserName = Brand<string, "UserName">;

export type TwitchUser = {
	id: TwitchUserId;
	login: TwitchUserLogin;
	displayName: TwitchUserName;
};
