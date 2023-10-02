import {
  ChakraProvider,
  Checkbox,
  Container,
  extendTheme,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
} from "@chakra-ui/react";

import { useStorage } from "@plasmohq/storage/hook";

const theme = extendTheme({
  fontSizes: {
    md: "14px",
  },
});

const IndexPopup = () => {
  const [quickBlock, setQuickBlock] = useStorage("quickBlock", true);
  const [followerMode, setFollowerMode] = useStorage("followerMode", false);
  const [followerModeDays, setFollowerModeDays] = useStorage("followerModeDays", "7");

  return (
    <ChakraProvider theme={theme}>
      <Container minW={"2xs"} maxW={"2xs"} p={0} centerContent>
        <Stack direction="column" p="1em" pt="0.5em">
          <Heading size="md" mt="0">
            Twitch Chat Mask
          </Heading>

          <Checkbox isChecked={quickBlock} onChange={() => setQuickBlock(!quickBlock)}>
            ブロックボタンを表示
          </Checkbox>

          <Checkbox
            isDisabled={true}
            isChecked={followerMode}
            onChange={() => setFollowerMode(!followerMode)}>
            フォロワー限定モード
          </Checkbox>

          <Container p={0} pl={6}>
            <Text fontSize={"xs"}>必要なフォロー期間</Text>
            <NumberInput
              isDisabled={true}
              value={followerModeDays}
              onChange={(v) => setFollowerModeDays(v)}
              min={0}
              size="xs">
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Container>
        </Stack>
      </Container>
    </ChakraProvider>
  );
};

export default IndexPopup;
