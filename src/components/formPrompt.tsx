import { Action, ActionPanel, Form } from "@raycast/api";
import { Prompt, usePrompts } from "../hooks";
import { useState } from "react";
import { savePrompts } from "../utils/storage";

export function FormPrompt(props: { prompt?: Prompt }) {
  const [nameError, setNameError] = useState<string | undefined>();
  const { prompts, isLoading } = usePrompts();

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={savePrompts} />
        </ActionPanel>
      }
    >
      {props.prompt ? (
        <>
          <Form.Description text="This form to rewrite prompt." />
          <Form.TextField
            id="name"
            title="Name"
            defaultValue={props.prompt.name}
            error={nameError}
            onChange={() => {
              if (nameError && nameError.length > 0) {
                setNameError(undefined);
              }
            }}
            onBlur={(event) => {
              const nameOfPrompts = prompts
                .map((item: Prompt) => item.name)
                .filter((item) => item !== props.prompt?.name);

              if (event.target.value?.length === 0) {
                setNameError("Name should't be empty!");
              } else if (event.target.value && nameOfPrompts.includes(event.target.value)) {
                setNameError("The name already exists!");
              }
            }}
          />
          <Form.TextArea
            id="prompt"
            title="prompt"
            placeholder="Input prompt here"
            defaultValue={props.prompt.prompt}
          />
          <Form.Separator />
          <Form.Checkbox
            id="isPaste"
            title="Paste to cursor"
            label="Selected text will be replace by response if you choose isPaste"
            defaultValue={props.prompt.isPaste}
          />
          <Form.Checkbox
            id="showView"
            title="Show result in view"
            label="The Ai response will show in the view if you choose showView"
            defaultValue={props.prompt.showView}
          />
        </>
      ) : (
        <>
          <Form.Description text="This form to create prompt." />
          <Form.TextField id="name" title="Name" error={nameError} />
          <Form.TextArea id="prompt" title="prompt" placeholder="Input prompt here" />
          <Form.Separator />
          <Form.Checkbox
            id="isPaste"
            title="Paste to cursor"
            label="Selected text will be replace by response if you choose isPaste"
          />
          <Form.Checkbox
            id="showView"
            title="Show result in view"
            label="The Ai response will show in the view if you choose showView"
          />
        </>
      )}
    </Form>
  );
}
