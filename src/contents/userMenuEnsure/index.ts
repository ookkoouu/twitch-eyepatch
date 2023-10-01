/**
 * 「〇〇さんをブロック」ボタンを表示させる
 * マウスホバーしないとメニュー要素が生成されないため
 */
import type { PlasmoCSConfig } from "plasmo";

import { newLogger } from "~lib/logger";

const llog = newLogger("Ensure");

export {};

export const config: PlasmoCSConfig = {
  matches: ["https://*.twitch.tv/*"],
};

const getUserMenuButton = () =>
  document.querySelector(
    "#VIEWER_CARD_ID div[data-test-selector*='toggle-balloon-wrapper'] button",
  );

const getBlockButton = () =>
  document.querySelector(
    "#VIEWER_CARD_ID div[data-toggle-balloon-id] div[role='dialog'] > div > button:nth-child(1)",
  );

let obs = new MutationObserver((muts) => {
  const viewerCard = muts
    .flatMap((e) => [...e.addedNodes])
    .flatMap((node) => (node instanceof HTMLElement ? [node] : []))
    .find((e) => e.id == "VIEWER_CARD_ID");

  if (viewerCard == null) {
    return;
  }

  const umb = getUserMenuButton();
  if (umb == null) {
    return;
  }

  umb.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
  llog(getBlockButton());
});

obs.observe(document.body, { childList: true, subtree: true });
