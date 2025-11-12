import { createPerplexity } from "@ai-sdk/perplexity";
import { inngest } from "./client";
import { generateText } from "ai";

const perplexity = createPerplexity({
  apiKey: process.env.PERPLEXITY_API_KEY || "",
});

export const helloWorld = inngest.createFunction(
  { id: "sumit-ai" },
  { event: "sumit.ai" },
  async ({ event, step }) => {
    const { steps } = await step.ai.wrap(
      "perplexity-generated-text",
      generateText,
      {
        system:
          "You are a helpful assistant that provides concise information about the latest developments in quantum computing and software engineering.",
        model: perplexity("sonar"),
        prompt: "What are the latest developments in quantum computing?",

        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );
    return steps;
  }
);
