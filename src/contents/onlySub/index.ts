import cssText from "data-text:./onlySub.css";
import type { PlasmoCSConfig } from "plasmo";

import { Storage } from "@plasmohq/storage";

import { newLogger } from "~lib/logger";

const llog = newLogger("subMode");

export const config: PlasmoCSConfig = {
  matches: ["https://*.twitch.tv/*", "https://twitchtheater.tv/*", "https://multistre.am/*"],
  all_frames: true,
};

export const enableSubMode = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  style.id = "tcm-submode";
  document.head.appendChild(style);
};

export const disableSubMode = () => {
  document.querySelectorAll("#tcm-submode").forEach((e) => e.remove());
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
