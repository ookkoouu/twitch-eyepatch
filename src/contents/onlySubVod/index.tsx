import cssText from "data-text:./index.css";
import type { PlasmoCSConfig } from "plasmo";

import { Storage } from "@plasmohq/storage";

import { newLogger } from "~lib/logger";

const llog = newLogger("subModeVod");

export const config: PlasmoCSConfig = {
  matches: [
    "https://clips.twitch.tv/*",
    "https://www.twitch.tv/videos/*",
    "https://www.twitch.tv/*/clip/*",
  ],
};

export const enableSubMode = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  style.id = "tcm-submode-vod";
  document.head.appendChild(style);
};

export const disableSubMode = () => {
  document.querySelectorAll("#tcm-submode-vod").forEach((e) => e.remove());
};

const storage = new Storage({ area: "sync" });

storage.watch({
  subscriberMode: (change) => {
    if (change.newValue == true) {
      llog("enable");
      enableSubMode();
    } else {
      llog("disable");
      disableSubMode();
    }
  },
});

storage.get("subscriberMode").then((enable) => {
  if (enable) {
    enableSubMode();
  }
  llog("Loaded as", enable);
});
