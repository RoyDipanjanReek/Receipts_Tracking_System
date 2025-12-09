import {
  createNetwork,
  getDefaultRoutingAgent,
  openai,
} from "@inngest/agent-kit";
import { createServer } from "@inngest/agent-kit/server";
import { inngest } from "./client";
import Events from "./constants";
import { databaseAgent } from "./agents/databaseAgent";
import { receiptScanningAgent } from "./agents/receiptScanningAgent";

const agentNetwork = createNetwork({
  name: "Agent Team",
  agents: [databaseAgent, receiptScanningAgent],
  defaultModel: openai({
    model: "gpt-4.1-mini",
    defaultParameters: {
      max_completion_tokens: 1000,
    },
  }),
  defaultRouter: ({ network }) => {
    const savedToNetwork = network.state.kv.get("saved-to-database");

    if (savedToNetwork !== undefined) {
      return undefined;
    }

    return getDefaultRoutingAgent();
  },
});

export const server = createServer({
  agents: [databaseAgent, receiptScanningAgent],
  networks: [agentNetwork],
});

export const extractAndSavedPDF = inngest.createFunction(
  { id: "Extract PDF from Saved in Database" },
  { event: Events.EXTRACT_DATA_FROM_PDF_AND_SAVED_TO_DATABASE },
  async ({ event }) => {
    const result = await agentNetwork.run(
      `Extract the key data from this pdf: ${event.data.url}. Once the data is extracted, save it to the database using the receiptId: ${event.data.receiptId}. Once the receipt is successfully saved to the database you can terminate the agent process.`,
    );
    return result.state.kv.get("receipt");
  },
);
