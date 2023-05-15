import { Toast, showToast } from "@raycast/api";
import { useEffect, useState } from "react";
import { getPrompts } from "../utils/storage";

export type Prompt = {
  name: string;
  prompt: string;
  isPaste: boolean;
  showView: boolean;
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
