import { LocalStorage, Toast, closeMainWindow, popToRoot, showHUD, showToast } from "@raycast/api";
import { Prompt } from "../hooks";

export async function getPrompts() {
  const result = (await LocalStorage.getItem<string>("prompts")) ?? "[]";

  return JSON.parse(result);
}

export async function savePrompts(values: Prompt) {
  showToast({ style: Toast.Style.Animated, title: "Saving prompt..." });
  try {
    let prompts = await getPrompts();
    const nameOfPrompts: Array<string> = prompts.map((item: Prompt) => item.name);

    if (nameOfPrompts.includes(values.name)) {
      prompts = prompts.filter((item: Prompt) => item.name !== values.name);
      prompts.push(values);
    } else {
      prompts.push(values);
    }

    await LocalStorage.setItem("prompts", JSON.stringify(prompts));
  } catch (err) {
    showToast({ title: "Error submitting form", message: "See logs for submitted values" });
  }
  closeMainWindow();
  showHUD("Save successfully 🎉");
  popToRoot();
}
