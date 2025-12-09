"use server";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import convex from "@/lib/convexClient";

export async function deleteReceipts(receiptId: string) {
  try {
    await convex.mutation(api.receipts.deleteReceipts, {
      id: receiptId as Id<"receipts">,
    });

    return { success: true };
  } catch (error) {
    console.error("error deleting receipt:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occured",
    };
  }
}
