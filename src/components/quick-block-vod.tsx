import { useBlock } from "@/common/quick-block";
import "@/common/quick-block/quick-block-vod.css";
import { type TwitchUser } from "@/common/types";

export type QuickBlockVodProps = {
	readonly user: TwitchUser;
};

export default function QuickBlockVod({ user }: QuickBlockVodProps) {
	const [blocked, setBlocked] = useBlock(user.login);

	const toggleBlock = () => {
		blocked ? dlog("unblock:", user.login) : dlog("block:", user.login);
		setBlocked(!blocked);
	};

	return (
		<div className="tcm-qb-vod">
			<button type="button" onClick={toggleBlock}>
				{blocked
					? `${user.displayName}さんをブロック解除`
					: `${user.displayName}さんをブロック`}
			</button>
		</div>
	);
}
