import { closeMainWindow, popToRoot, showHUD } from "@raycast/api";
import dayjs from "dayjs";

const enum ReplaceFlags {
  // get the current date in the format specified if has format
  DATE = "date",
  // get the selected text
  SELECTED = "selected",
  // get the clipboard content
  CLIPBOARD = "clipboard",
}

type ReplaceSwitch = {
  [key: string]: (match: string) => string;
};

export function fillPrompt(prompt: string, selected: string | null, clipboard: string | null) {
  const replaceSwitch: ReplaceSwitch = {
    [ReplaceFlags.DATE]: (match) => {
      const format = match.split(":")[1];
      const date = dayjs().format(format);

      return date;
    },
    [ReplaceFlags.SELECTED]: () => {
      if (!selected) {
        showHUD("Get selected failed 💩");
        closeMainWindow();
        popToRoot();

        return "";
      } else {
        return selected;
      }
    },
    [ReplaceFlags.CLIPBOARD]: () => {
      if (!clipboard) {
        showHUD("Get clipboard failed 💩");
        closeMainWindow();
        popToRoot();

        return "";
      } else {
        return clipboard;
      }
    },
  };

  function compiled(prompt: string) {
    return prompt.replace(/{{(.*?)}}/g, (match, p1) => {
      const flag = p1.split(":")[0] as ReplaceFlags;

      return flag in replaceSwitch ? replaceSwitch[flag](p1) : match;
    });
  }

  const prompted = compiled(prompt);

  console.log(prompted);

  return prompted;
}
