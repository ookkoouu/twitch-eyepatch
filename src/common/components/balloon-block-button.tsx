import {
	BalloonButton,
	BalloonButtonProps,
} from "@/common/components/balloon-button";
import { useBlock } from "@/common/quick-block/use-block";
import type { TwitchUser } from "@/common/types";

export type BalloonBlockButtonProps = {
	readonly user: TwitchUser;
	readonly fetched?: boolean;
} & BalloonButtonProps;

export function BalloonBlockButton({
	user,
	fetched,
	...props
}: BalloonBlockButtonProps) {
	const [blocked, setBlocked] = useBlock(user.login, fetched);

	const toggleBlock = () => {
		blocked ? dlog("unblock:", user.login) : dlog("block:", user.login);
		setBlocked(!blocked);
	};

	return (
		<BalloonButton onClick={toggleBlock} {...props}>
			{blocked
				? `${user.displayName}さんをブロック解除`
				: `${user.displayName}さんをブロック`}
		</BalloonButton>
	);
}

export default BalloonBlockButton;
