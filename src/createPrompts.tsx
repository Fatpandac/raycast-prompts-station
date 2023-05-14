import {
  Action,
  ActionPanel,
  Form,
  LocalStorage,
  Toast,
  closeMainWindow,
  popToRoot,
  showHUD,
  showToast,
} from "@raycast/api";
import { Prompt } from "./hooks";

async function handleSubmit(values: Prompt) {
  showToast({ style: Toast.Style.Animated, title: "Saving prompt..." });
  try {
    const result = (await LocalStorage.getItem<string>("prompts")) ?? "[]";
    const prompts = JSON.parse(result);

    prompts.push(values);

    await LocalStorage.setItem("prompts", JSON.stringify(prompts));
  } catch (err) {
    showToast({ title: "Error submitting form", message: "See logs for submitted values" });
  }
  closeMainWindow();
  showHUD("Save successfully 🎉");
  popToRoot();
}

export default function Command() {
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description text="This form to create prompt." />
      <Form.TextField id="name" title="Name" />
      <Form.TextArea id="prompt" title="prompt" placeholder="Input prompt here" />
      <Form.Separator/>
      <Form.Checkbox id="isPaste" title="Paste to cursor" label="Selected text will be replace by response if you choose isPaste" />
      <Form.Checkbox id="showView" title="Show result in view" label="The Ai response will show in the view if you choose showView" />
    </Form>
  );
}
