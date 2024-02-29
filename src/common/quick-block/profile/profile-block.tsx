import BalloonButton from "@/common/components/balloon-button";
import type { TwitchUser } from "@/common/types";
import { useBlock } from "../use-block";

export type BlockRowProps = {
	readonly user: TwitchUser;
	readonly fetched?: boolean;
};

export default function ProfileBlock({ user, fetched }: BlockRowProps) {
	const [blocked, setBlocked] = useBlock(user.login, fetched);

	const toggleBlock = () => {
		blocked ? dlog("unblock:", user.login) : dlog("block:", user.login);
		setBlocked(!blocked);
	};

	return (
		<BalloonButton onClick={toggleBlock}>
			{blocked
				? `${user.displayName}さんをブロック解除`
				: `${user.displayName}さんをブロック`}
		</BalloonButton>
	);
}
