import { ChakraProvider } from "@chakra-ui/react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import type { PlasmoCSConfig, PlasmoCSUIProps } from "plasmo";
import { type FC } from "react";

import { BlockButtonWrapper } from "./blockButtonWrapper";

export const config: PlasmoCSConfig = {
  matches: ["https://*.twitch.tv/*"],
};
export const getShadowHostId = () => `adonais`;
export const getStyle = () => document.createElement("style");

export const getInlineAnchor = () =>
  document.querySelector(
    "#VIEWER_CARD_ID > div > div.Layout-sc-1xcs6mc-0.jktnNx > div:nth-child(1)",
  );

const PlasmoMainUI: FC<PlasmoCSUIProps> = ({ anchor }) => {
  const styleCache = createCache({
    key: "plasmo-style-cache",
    prepend: true,
    container: anchor.element.nextElementSibling.shadowRoot.querySelector("style"),
  });

  return (
    <CacheProvider value={styleCache}>
      <ChakraProvider>
        <BlockButtonWrapper />
      </ChakraProvider>
    </CacheProvider>
  );
};

export default PlasmoMainUI;
