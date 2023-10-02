import { useEffect, useState, type FC } from "react";

import { useStorage } from "@plasmohq/storage/hook";

import { newLogger } from "~lib/logger";

import { BlockButton } from "./blockButton";

const llog = newLogger("ButtonWrapper");

export const BlockButtonWrapper = () => {
  const getUserID = () =>
    document
      .querySelector<HTMLAnchorElement>(
        "#VIEWER_CARD_ID div.viewer-card-header__display-name a.tw-link",
      )
      ?.href.split("/")
      .at(-1) ?? "";

  llog("rendering", getUserID());

  const [userId, setUserId] = useState(getUserID());
  const [quickBlock] = useStorage("quickBlock");

  useEffect(() => {
    const obs = new MutationObserver((muts) => {
      const userpageLink = muts
        .filter((mut) => mut.type == "attributes")
        .map((mut) => mut.target)
        .flatMap((node) => (node instanceof HTMLElement ? [node] : []))
        .find((e) => e.classList.contains("tw-link"));

      if (userpageLink == null || !(userpageLink instanceof HTMLAnchorElement)) {
        return;
      }
      const id = userpageLink.href.split("/").at(-1) ?? "";
      llog("card changed");
      setUserId(id);
    });
    if (document.getElementById("VIEWER_CARD_ID")) {
      obs.observe(document.getElementById("VIEWER_CARD_ID"), {
        subtree: true,
        attributes: true,
        attributeFilter: ["href"],
      });
    }
    return () => {
      obs.disconnect();
    };
  });

  return <div>{quickBlock ? <BlockButton userId={userId}></BlockButton> : <></>}</div>;
};
