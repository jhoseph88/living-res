/// <reference types="vite/client" />

declare module 'https://esm.run/@mlc-ai/web-llm' {
  export function CreateMLCEngine(
    modelId: string,
    config?: {
      initProgressCallback?: (progress: { text: string }) => void;
    }
  ): Promise<any>;
}
