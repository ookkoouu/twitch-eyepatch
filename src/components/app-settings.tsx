import { SettingStorage } from "@/common/storage";
import { useKVStorage } from "@/lib/webext-storage/react";
import {
	ChakraProvider,
	Container,
	FormControl,
	Heading,
	VStack,
	extendTheme,
} from "@chakra-ui/react";
import OpNumber from "./op-number";
import OpSwitch from "./op-switch";

const theme = extendTheme({
	fontSizes: {
		md: "16px",
	},
	styles: {
		global: {
			html: {
				userSelect: "none",
			},
		},
	},
});

export default function AppSettings() {
	const [
		{ followerMode, quickBlock, subMode, requiredFollowDays, hideReply },
		setSettings,
	] = useKVStorage(SettingStorage);

	return (
		<ChakraProvider theme={theme}>
			<Container maxW="md" minW="xs" p="0">
				<VStack alignItems="start" p="4" spacing="4">
					<Heading size="md">Twitch Chat Mask</Heading>

					<FormControl alignItems="start">
						<VStack spacing="1rem">
							<OpSwitch
								checked={quickBlock}
								description="返信ボタンの隣にブロックボタンを表示"
								onChange={(e) => {
									setSettings("quickBlock", e.target.checked);
								}}
							>
								クイックブロック
							</OpSwitch>

							<OpSwitch
								checked={subMode}
								description="サブスクバッジの無いチャットを非表示"
								onChange={(e) => {
									setSettings("subMode", e.target.checked);
								}}
							>
								疑似サブ限
							</OpSwitch>

							<OpSwitch
								checked={hideReply}
								description="誰かへ返信しているチャットを非表示 (ライブのみ)"
								onChange={(e) => {
									setSettings("hideReply", e.target.checked);
								}}
							>
								返信隠し
							</OpSwitch>

							<OpSwitch
								disabled
								checked={followerMode}
								description="フォローしたばかりのチャットを非表示"
								onChange={(e) => {
									setSettings("followerMode", e.target.checked);
								}}
							>
								フォロー限
							</OpSwitch>

							<OpNumber
								isDisabled
								defaultValue={30}
								min={0}
								value={requiredFollowDays}
								onChange={(s) => {
									if (Number.isNaN(Number(s))) return;
									setSettings("requiredFollowDays", Number(s));
								}}
							>
								必要なフォロー日数
							</OpNumber>
						</VStack>
					</FormControl>
				</VStack>
			</Container>
		</ChakraProvider>
	);
}