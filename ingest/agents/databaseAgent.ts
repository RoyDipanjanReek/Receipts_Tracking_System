import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import convex from "@/lib/convexClient";
import { createAgent, createTool, openai } from "@inngest/agent-kit";
import { id } from "date-fns/locale";
import z from "zod";

const savedToDatabaseTool = createTool({
  name: "save-to-database",
  description: "save the given data to the convex database.",
  parameters: z.object({
    fileDisplayName: z
      .string()
      .describe(
        "The readable display name of the receipt to show in the UI. If the file name is not human readable, use this to give a more readable name.",
      ),
    receiptId: z.string().describe("The ID of the receipt to update."),
    merchantName: z.string(),
    merchantAddress: z.string(),
    merchantContact: z.string(),
    transactionDate: z.string(),
    transactionAmount: z
      .string()
      .describe(
        "The total amount of the transaction, summing all the items on the receipt.",
      ),
    receiptSummary: z
      .string()
      .describe(
        "A summary of the receipt, including the merchant name, address, contact, transaction data, transaction amount, and currency. Include a human readable summary of the receipt. Mention both invoice number and receipt number if both are present. Include some key details about the items on the receipt, this is a special featured summary so it should include some key details about the items on the receipts with some context.",
      ),
    currency: z.string(),
    items: z.array(
      z
        .object({
          name: z.string(),
          quantity: z.number(),
          unitPrice: z.number(),
          totalPrice: z.number(),
        })
        .describe(
          "An array of items on the receipt. Include the name, quantity, unit Price, and total price of each item.",
        ),
    ),
  }),
  handler: async (params, context) => {
    const {
      fileDisplayName,
      receiptId,
      merchantName,
      merchantAddress,
      merchantContact,
      transactionDate,
      transactionAmount,
      receiptSummary,
      currency,
      items,
    } = params;

    const result = await context.step?.run(
      "save-receipt-to-database",
      async () => {
        try {
          // call the Convex mutation to upload the receipt with extracted data.
          const { userId } = await convex.mutation(
            api.receipts.updateReceiptWithExtractedData,
            {
              id: receiptId as Id<"receipts">,
              fileDisplayName,
              merchantName,
              merchantAddress,
              merchantContact,
              transactionDate,
              transactionAmount,
              receiptSummary,
              currency,
              items,
            },
          );

          // ** - Track events in schematic
          /**  await client.track({
            event: "scan",
            company: {
            id: userId,
            },
            user: {
            id: userId,
            },
        });*/

          return {
            addedToDb: "Success",
            receiptId,
            fileDisplayName,
            merchantName,
            merchantAddress,
            merchantContact,
            transactionDate,
            transactionAmount,
            receiptSummary,
            currency,
            items,
          };
        } catch (error) {
          return {
            addedToDb: "Failed",
            error: error instanceof Error ? error.message : "Unknown Error",
          };
        }
      },
    );

    if (result?.addedToDb === "Success") {
      //Only set KV values if the operation was successfully
      context.network?.state.kv.set("saved-to-database", true);
      context.network?.state.kv.set("receipt", receiptId);
    }

    return result;
  },
});

export const databaseAgent = createAgent({
  name: "Database Agent",
  description:
    "responsible for taking key information regarding receipts and saving it to the convex database.",
  system:
    "You are helpful assistent that takes information regarding receipts and saves it to the convex database.",
  model: openai({
    model: "gpt-4o-mini",
    defaultParameters: {
      max_completion_tokens: 1000,
    },
  }),
  tools: [savedToDatabaseTool],
});
