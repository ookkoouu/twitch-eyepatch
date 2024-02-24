import { useBlock } from "@/common/quick-block";
import { type TwitchUserLogin } from "@/common/types";
import { BiUserX } from "react-icons/bi";

export type QuickBlockProps = {
	readonly userLogin: TwitchUserLogin;
};

export default function QuickBlock({ userLogin }: QuickBlockProps) {
	const [blocked, setBlocked] = useBlock(userLogin);

	const toggleBlock = () => {
		dlog("ToggleBlock:", userLogin, !blocked);
		setBlocked(!blocked);
	};

	return (
		<div
			className="chat-line__reply-icon tcm-chat-line__icon"
			aria-label={blocked ? "クリックしてブロック解除" : "クリックしてブロック"}
			data-is-blocked={blocked}
			data-tooltip-position="top"
			role="tooltip"
		>
			<button type="button" className="tcm-icon-button" onClick={toggleBlock}>
				<div className="tcm-center">
					<BiUserX className="tcm-icon-button-figure" />
				</div>
			</button>
		</div>
	);
}
