import { useEffect } from "react";

import { useStorage } from "@plasmohq/storage/hook";

import { newLogger } from "~/lib/logger";

const llog = newLogger("useBlock");

export const useBlockList = () => {
  return useStorage<string[]>("blockList", []);
};

export const useBlock = (userId: string) => {
  const [blockList, setBlockList] = useBlockList();

  const blocked = Array.isArray(blockList) ? blockList.some((e) => e === userId) : false;

  useEffect(() => {
    llog("render", userId, blocked);
    return () => {
      llog("unrender", userId, blocked);
    };
  });

  const setBlocked = (b: boolean) => {
    if (b) {
      if (!blocked) {
        setBlockList(blockList.concat(userId));
      }
    } else {
      if (blocked) {
        setBlockList(blockList.filter((e) => e !== userId));
      }
    }
  };

  return [blocked, setBlocked] as const;
};
