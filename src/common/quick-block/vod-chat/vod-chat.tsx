import BalloonButton from "@/common/components/balloon-button";
import { useBlock } from "@/common/quick-block/use-block";
import type { TwitchUser } from "@/common/types";

export type QuickBlockVodProps = {
	readonly user: TwitchUser;
	readonly fetched?: boolean;
};

export default function VodChatBlock({ user, fetched }: QuickBlockVodProps) {
	const [blocked, setBlocked] = useBlock(user.login, fetched);

	const toggleBlock = () => {
		blocked ? dlog("unblock:", user.login) : dlog("block:", user.login);
		setBlocked(!blocked);
	};

	return (
		<BalloonButton onClick={toggleBlock} style={{ padding: "0 0.5rem" }}>
			{blocked
				? `${user.displayName}さんをブロック解除`
				: `${user.displayName}さんをブロック`}
		</BalloonButton>
	);
}
