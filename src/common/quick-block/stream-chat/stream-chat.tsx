import type { TwitchUserLogin } from "@/common/types";
import { BiUserX } from "react-icons/bi";
import { useBlock } from "../use-block";
import "./stream-chat.css";

export type QuickBlockProps = {
	readonly userLogin: TwitchUserLogin;
};

export default function StreamChatBlock({ userLogin }: QuickBlockProps) {
	const [blocked, setBlocked] = useBlock(userLogin);

	const toggleBlock = () => {
		dlog("ToggleBlock:", userLogin, !blocked);
		setBlocked(!blocked);
	};

	return (
		<div
			className="chat-line__reply-icon eyepatch-chat-line__icon"
			aria-label={blocked ? "クリックしてブロック解除" : "クリックしてブロック"}
			data-is-blocked={blocked}
			data-tooltip-position="top"
			role="tooltip"
		>
			<button
				type="button"
				className="eyepatch-icon-button"
				onClick={toggleBlock}
			>
				<div className="eyepatch-center">
					<BiUserX className="eyepatch-icon-button-figure" />
				</div>
			</button>
		</div>
	);
}
