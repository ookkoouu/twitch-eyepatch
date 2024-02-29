import { Flex, FormLabel, Spacer, Stack } from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { useMemo } from "react";
import AsyncSwitch, { type AsyncSwitchProps } from "./async-switch";

export type OpSwitchProps = AsyncSwitchProps & { readonly description: string };

export default function OpSwitch({
	checked,
	onChange,
	children,
	id,
	description,
	...properties
}: OpSwitchProps) {
	const _id = useMemo(() => {
		return nanoid(6);
	}, []);

	return (
		<Flex sx={{ "& *": { cursor: "pointer" } }} w="100%">
			<Stack direction="column" marginInlineEnd="4" spacing="0">
				<FormLabel fontSize="md" htmlFor={id ?? _id} m="0">
					{children}
				</FormLabel>
				<FormLabel
					fontSize="xs"
					fontWeight="light"
					htmlFor={id ?? _id}
					m="0"
					textColor="blackAlpha.700"
				>
					{description}
				</FormLabel>
			</Stack>
			<Spacer />
			<AsyncSwitch
				id={id ?? _id}
				isChecked={checked}
				onChange={onChange}
				{...properties}
			/>
		</Flex>
	);
}
