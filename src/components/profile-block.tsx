import { useBlock } from "@/common/quick-block";
import { type TwitchUserLogin } from "@/common/types";

export type BlockRowProps = {
	readonly userLogin: TwitchUserLogin;
	readonly fetched?: boolean;
};

export default function BlockRow({ userLogin, fetched }: BlockRowProps) {
	const [blocked, setBlocked] = useBlock(userLogin, fetched ?? false);

	return (
		<div className="profile-block">
			<button
				type="button"
				data-is-blocked={blocked}
				onClick={async () => setBlocked(!blocked)}
			>
				{blocked ? "ブロック解除する" : "ブロックする"}
			</button>
		</div>
	);
}
