import {
  ActionPanel,
  List,
  Action,
  LocalStorage,
  popToRoot,
  showHUD,
  closeMainWindow,
  showToast,
  Toast,
  Icon,
  Clipboard,
  getSelectedText,
  Detail,
  AI,
} from "@raycast/api";
import { Prompt, usePrompts } from "./hooks";
import { fillPrompt } from "./utils";
import { useEffect, useState } from "react";
import { FormPrompt } from "./components";
import { useAI } from "@raycast/utils";

async function handleDelete(name: string) {
  showToast({ style: Toast.Style.Animated, title: "Delete prompt..." });
  try {
    const result = (await LocalStorage.getItem<string>("prompts")) ?? "[]";
    let prompts = JSON.parse(result);

    prompts = prompts.filter((item: Prompt) => item.name !== name);

    await LocalStorage.setItem("prompts", JSON.stringify(prompts));
  } catch (err) {
    showToast({ title: "Error delete", message: "See logs" });
  }
  closeMainWindow();
  showHUD("Delete successfully 🎉");
  popToRoot();
}

async function compilePrompt(prompt: Prompt) {
  let selected = null;
  let clipboard = null;
  try {
    // get selected
    selected = await getSelectedText();

    // get clipboard
    const { text } = await Clipboard.read();
    clipboard = text;
    // eslint-disable-next-line no-empty
  } catch (err) {}

  return fillPrompt(prompt.prompt, selected, clipboard);
}

function ShowResult(props: { prompt: Prompt }) {
  const [compliedPrompt, setCompliedPrompt] = useState("");
  useEffect(() => {
    (async () => {
      setCompliedPrompt(await compilePrompt(props.prompt));
    })();
  }, []);

  const { isLoading, data, error } = useAI(compliedPrompt, {
    model: props.prompt.model,
    creativity: props.prompt.creativity,
    stream: true,
  });

  if (error) throw error;

  return (
    <Detail
      isLoading={isLoading}
      markdown={data}
      actions={
        <ActionPanel>
          <Action.CopyToClipboard content={data} />
        </ActionPanel>
      }
    />
  );
}

function EditView(props: { prompt: Prompt }) {
  return <FormPrompt prompt={props.prompt} />;
}

export default function Command() {
  const { prompts, isLoading } = usePrompts();

  return (
    <List isLoading={isLoading} isShowingDetail>
      {prompts.map((item: Prompt) => (
        <List.Item
          title={item.name}
          detail={
            <List.Item.Detail
              markdown={item.prompt}
              metadata={
                <List.Item.Detail.Metadata>
                  <List.Item.Detail.Metadata.Label
                    icon={Icon.TextCursor}
                    title="Paste to cursor"
                    text={`${item.isPaste}`}
                  />
                  <List.Item.Detail.Metadata.Label
                    icon={Icon.AppWindow}
                    title="Show result in view"
                    text={`${item.showView}`}
                  />
                  <List.Item.Detail.Metadata.Label icon={Icon.AppWindowGrid3x3} title="Model" text={`${item.model}`} />
                  <List.Item.Detail.Metadata.Label icon={Icon.Wand} title="Creativity" text={`${item.creativity}`} />
                </List.Item.Detail.Metadata>
              }
            />
          }
          actions={
            <ActionPanel>
              {item.showView ? (
                <Action.Push icon={Icon.Rocket} title="Run Prompt" target={<ShowResult prompt={item} />} />
              ) : (
                <Action
                  icon={Icon.Rocket}
                  title="Run Prompt"
                  onAction={async () => {
                    const compliedPrompt = await compilePrompt(item);

                    const answer = await AI.ask(compliedPrompt, {
                      model: item.model,
                      creativity: item.creativity,
                    });

                    if (item.isPaste) {
                      await Clipboard.paste(answer);
                    } else {
                      await Clipboard.copy(answer);
                    }

                    closeMainWindow();
                    showHUD("Run successfully 🎉");
                    popToRoot();
                  }}
                />
              )}
              <Action.Push icon={Icon.Pencil} title="Edit Prompt" target={<EditView prompt={item} />} />
              <Action icon={Icon.Trash} title="Delete Prompt" onAction={() => handleDelete(item.name)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
