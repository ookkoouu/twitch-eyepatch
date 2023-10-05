import { Center, Icon, IconButton } from "@chakra-ui/react";
import { useEffect, type FC } from "react";
import { BiUserX } from "react-icons/bi";

import { useBlock } from "~/lib/useBlockList";
import { newLogger } from "~lib/logger";

const llog = newLogger("BlockButton");

const getBlockButton = () =>
  document.querySelector<HTMLButtonElement>(
    "#VIEWER_CARD_ID div[data-toggle-balloon-id] div[role='dialog'] > div > button:nth-child(1)",
  );

const getConfirmButton = () =>
  document.querySelector<HTMLButtonElement>(
    "div.ReactModalPortal div:not(.modal__close-button) button[class*='ScCoreButtonDestructive']",
  );

export interface BlockButtonProps {
  userId: string;
}

export const BlockButton: FC<BlockButtonProps> = ({ userId }) => {
  const [blocked, setBlocked] = useBlock(userId);

  const blockUser = (userId: string) => {
    const blockButton = getBlockButton();
    if (blockButton == null) {
      return;
    }

    blockButton.click();

    const confirmButton = getConfirmButton();
    if (confirmButton != null) {
      // block
      confirmButton.click();
      llog("User Blocked", userId);
      setBlocked(true);
    } else {
      // unblock
      llog("User Unblocked", userId);
      setBlocked(false);
    }
  };

  useEffect(() => {
    llog("render", userId, blocked);
    return () => {
      llog("unrender", userId, blocked);
    };
  });

  return (
    <Center w="3rem" h="3rem" m="0.5rem">
      <IconButton
        onClick={() => {
          blockUser(userId);
        }}
        w="3rem"
        h="3rem"
        m="0"
        p="0"
        background="none"
        borderRadius="var(--border-radius-medium)"
        _hover={{
          backgroundColor: "var(--color-background-button-text-hover)",
        }}
        _active={{
          backgroundColor: "var(--color-background-button-text-active)",
        }}
        aria-label="Block user">
        <Icon color={blocked ? "red.600" : "blackAlpha.400"} boxSize="2.8rem" as={BiUserX} />
      </IconButton>
    </Center>
  );
};
