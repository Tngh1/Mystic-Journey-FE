import { get } from "./client";
import type {
  InventorySummaryResponse,
  ApiResponse,
} from "@/lib/types";

export type { InventorySummaryResponse, InventoryItemResponse } from "@/lib/types";

// Helper function executing get my inventory.
// Processes input parameters and returns the calculated result.
export const getMyInventory = async (): Promise<ApiResponse<InventorySummaryResponse>> => {
  return get<ApiResponse<InventorySummaryResponse>>("/api/inventory/me");
};
