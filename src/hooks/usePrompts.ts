import { LocalStorage, Toast, showToast } from "@raycast/api";
import { useEffect, useState } from "react";

export type Prompt = {
  name: string,
  prompt: string,
  isPaste: boolean,
  showView: boolean
};

export function usePrompts() {
  const [ prompts, setPrompts ] = useState<Prompt[]>([]);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const result = (await LocalStorage.getItem<string>("prompts")) ?? '[{"a":"hello"}]';
        const prompts = JSON.parse(result)

        setPrompts(prompts)
        setIsLoading(false)
      } catch (err) {
        console.log(err)
        showToast(Toast.Style.Failure, "Get prompts faile")
      }
    })();
  }, []);

  return {prompts, isLoading}
}
