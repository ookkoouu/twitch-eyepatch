import type { TwitchUser, TwitchUserLogin } from "@/common/types";
import {
	blockUser,
	getBlockedUsers,
	getUserByLogin,
	unblockUser,
} from "@/lib/twitch";
import { useEffect, useState } from "react";

export const useBlock = (userLogin: TwitchUserLogin, fetched?: boolean) => {
	const [blocked, setBlocked] = useState(false);
	const [user, setUser] = useState<TwitchUser>();

	const fetchUser = async () => {
		const result = await getUserByLogin(userLogin).catch(
			(error) => new Failure(error),
		);
		dlog("user:", result);
		if (result.error != null) {
			dlog("[useBlock]", result.error);
			return;
		}

		setUser(result.value);
		return result.value;
	};

	const block = async () => {
		const _user = user ?? (await fetchUser().catch());
		if (_user == null) {
			return;
		}

		blockUser(_user.id);
		setBlocked(true);
	};

	const unblock = async () => {
		const _user = user ?? (await fetchUser().catch());
		if (_user == null) {
			return;
		}

		unblockUser(_user.id);
		setBlocked(false);
	};

	const _setBlocked = async (b: boolean) => {
		if (b) {
			block();
		} else {
			unblock();
		}
	};

	useEffect(() => {
		if (fetched) {
			getBlockedUsers().then((res) => {
				if (res.error != null) {
					dlog("[useBlock]", res.error);
					return;
				}

				if (res.value.some((user) => user.login === userLogin)) {
					setBlocked(true);
				}
			});
		}
	}, [userLogin, fetched]);

	return [blocked, _setBlocked] as const;
};
