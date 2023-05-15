import { Toast, showToast } from "@raycast/api";
import { useEffect, useState } from "react";
import { getPrompts } from "../utils/storage";

type Model = "text-davinci-003" | "gpt-3.5-turbo";
type Creativity = "none" | "low" | "medium" | "high" | "maximum";

export type Prompt = {
  name: string;
  model: Model;
  prompt: string;
  isPaste: boolean;
  showView: boolean;
  creativity: Creativity;
};

export function usePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const prompts = await getPrompts();

        setPrompts(prompts);
        setIsLoading(false);
      } catch (err) {
        showToast(Toast.Style.Failure, "Get prompts faile");
      }
    })();
  }, []);

  return { prompts, isLoading };
}
