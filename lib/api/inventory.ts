import { get } from "./client";
import type {
  InventorySummaryResponse,
  ApiResponse,
} from "@/lib/types";

export type { InventorySummaryResponse, InventoryItemResponse } from "@/lib/types";

/**
 * UC 20.1 – Get own inventory (player-side, requires auth cookie)
 * GET /api/inventory/me
 */
export const getMyInventory = async (): Promise<ApiResponse<InventorySummaryResponse>> => {
  return get<ApiResponse<InventorySummaryResponse>>("/api/inventory/me");
};
