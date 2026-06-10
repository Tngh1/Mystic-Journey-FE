import { get } from "./client";
import type {
  SaleResponse,
} from "@/lib/types";

export const getByPlayerId = async (playerProfileId: number): Promise<SaleResponse[]> => {
  return get<SaleResponse[]>(`/api/Sales/player/${playerProfileId}`);
};
