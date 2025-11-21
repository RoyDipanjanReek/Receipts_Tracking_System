import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Function to generate a Convex upload url for the client
export const generatedUploaded = mutation({
  args: {},
  handler: async (ctx) => {
    // Generate a URL that the client can use to uplode a file
    return await ctx.storage.generateUploadUrl();
  },
});

export const storageReceipt = mutation({
  args: {
    userId: v.string(),
    fileId: v.id("_storage"),
    fileName: v.string(),
    size: v.number(),
    mimeType: v.string(),
  },

  handler: async (ctx, args) => {
    // Save the receipts to the database
    const receiptsId = await ctx.db.insert("receipts", {
      userId: args.userId,
      fileName: args.fileName,
      fileId: args.fileId,
      uploadedAt: Date.now(),
      size: args.size,
      mimeType: args.mimeType,
      status: "pending",

      // Initialize extracted data fields as null
      merchantName: undefined,
      merchantAddress: undefined,
      merchantContact: undefined,
      transactionDate: undefined,
      transactionAmount: undefined,
      currency: undefined,
      items: [],
    });

    return receiptsId;
  },
});

//Function to get all receipts
export const getReceipts = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // only return recipts for authenticated user
    return await ctx.db
      .query("receipts")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();
  },
});

//Function to get a single recipts by ID
export const getReceiptsById = query({
  args: {
    id: v.id("receipts"),
  },
  handler: async (ctx, args) => {
    //get the recipts
    const receipt = await ctx.db.get(args.id);

    //verify user has access to this receipts
    if (receipt) {
      const identity = await ctx.auth.getUserIdentity();

      if (!identity) {
        throw new Error("Not Authenticated");
      }

      const userId = identity.subject;

      if (receipt.userId !== userId) {
        throw new Error("Not authorized to access this receipt");
      }
    }
    return receipt;
  },
});

// Generate a URL to download a receipts file
export const getReceiptDownlodedUrl = query({
  args: {
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // Get a temporary URL that can be used to download the file
    return await ctx.storage.getUrl(args.fileId);
  },
});

// Update status of a receipts
export const updateReceiptsStatus = mutation({
  args: {
    id: v.id("receipts"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    // verify user to access to this receipts
    const receipt = await ctx.db.get(args.id);
    if (!receipt) {
      throw new Error("Receipt not found");
    }
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not Authenticated");
    }
    const userId = identity.subject;
    if (receipt.userId !== userId) {
      throw new Error("Not authorized to update this reciept");
    }

    await ctx.db.patch(args.id, {
      status: args.status,
    });

    return true;
  },
});

export const deleteReceipts = mutation({
  args: {
    id: v.id("receipts"),
  },
  handler: async (ctx, args) => {
    // verify user to access to this receipts
    const receipt = await ctx.db.get(args.id);
    if (!receipt) {
      throw new Error("Receipt not found");
    }
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not Authenticated");
    }
    const userId = identity.subject;
    if (receipt.userId !== userId) {
      throw new Error("Not authorized to update this reciept");
    }

    // Delete file from record
    await ctx.storage.delete(receipt.fileId);

    //Delete the receipt record
    await ctx.db.delete(args.id);

    return true;
  },
});

// Update a receipts with extracted data

export const updateReceiptWithExtractedData = mutation({
  args: {
    id: v.id("receipts"),
    fileDisplayName: v.string(),
    merchantName: v.optional(v.string()),
    merchantAddress: v.optional(v.string()),
    merchantContact: v.optional(v.string()),
    transactionDate: v.optional(v.string()),
    transactionAmount: v.optional(v.string()),
    currency: v.optional(v.string()),
    receiptSummary: v.optional(v.string()),
    items: v.array(
      v.object({
        name: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
        totalPrice: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const receipt = await ctx.db.get(args.id);
    if (!receipt) {
      throw new Error("Receipt not found");
    }

    await ctx.db.patch(args.id, {
      fileDisplayName: args.fileDisplayName,
      merchantName: args.merchantName,
      merchantAddress: args.merchantAddress,
      merchantContact: args.merchantContact,
      transactionDate: args.transactionDate,
      transactionAmount: args.transactionAmount,
      currency: args.currency,
      receiptSummary: args.receiptSummary,
      items: args.items,
      status: "processed", //Mark as  processed now we have extracted data
    });

    return {
      userId: receipt.userId,
    };
  },
});
