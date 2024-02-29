import type { ComponentProps } from "react";
import "./balloon-button.css";

type BalloonButtonProps = ComponentProps<"div"> &
	Pick<ComponentProps<"button">, "onClick">;

export default function BalloonButton({
	children,
	onClick,
	...props
}: BalloonButtonProps) {
	return (
		<div className="tcm-balloon-button" {...props}>
			<button type="button" onClick={onClick}>
				{children}
			</button>
		</div>
	);
}
