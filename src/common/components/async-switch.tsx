import { Switch, type SwitchProps } from "@chakra-ui/react";
import { useState } from "react";

export type AsyncSwitchProps = React.ComponentProps<"input"> & SwitchProps;

export default function AsyncSwitch({
	onChange,
	...properties
}: Parameters<typeof Switch>[0]) {
	const [disabled, setDisabled] = useState(false);
	const change = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (onChange === undefined) return;
		setDisabled(true);
		await onChange(e);
		setDisabled(false);
	};

	return (
		<Switch
			{...properties}
			disabled={properties.disabled || disabled}
			onChange={async (e) => change(e)}
		/>
	);
}
