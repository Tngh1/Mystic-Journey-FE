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

/**
 * UC 20.1 – Get any player's inventory by playerProfileId (admin view)
 * GET /api/inventory/{playerProfileId}
 */
export const getInventoryByProfileId = async (
  playerProfileId: number
): Promise<ApiResponse<InventorySummaryResponse>> => {
  return get<ApiResponse<InventorySummaryResponse>>(
    `/api/inventory/${playerProfileId}`
  );
};
