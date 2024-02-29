import {
	Box,
	Flex,
	FormHelperText,
	FormLabel,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Spacer,
	Stack,
} from "@chakra-ui/react";

export type OpNumberProps = Parameters<typeof NumberInput>[0] & {
	readonly description?: string;
};

export default function OpNumber({
	children,
	max,
	min,
	value,
	defaultValue,
	description,
	isDisabled,
	id,
	onChange,
}: OpNumberProps) {
	return (
		<Flex alignItems="center" w="100%">
			<Box w="1rem" />
			<Stack direction="column" marginInlineEnd="4" spacing="0">
				<FormLabel m="0">{children}</FormLabel>
				<FormHelperText m="0">{description}</FormHelperText>
			</Stack>
			<Spacer />
			<NumberInput
				defaultValue={defaultValue}
				id={id}
				isDisabled={isDisabled}
				max={max}
				min={min}
				size="sm"
				value={value}
				w="6rem"
				onChange={onChange}
			>
				<NumberInputField />
				<NumberInputStepper>
					<NumberIncrementStepper />
					<NumberDecrementStepper />
				</NumberInputStepper>
			</NumberInput>
		</Flex>
	);
}
