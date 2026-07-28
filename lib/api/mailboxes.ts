import { get, post, del } from "./client";
import type { MailboxResponse, SendMailboxByListIdRequest, SendMailboxToAllRequest, PagedResponse } from "@/lib/types";
export type { MailboxResponse, SendMailboxByListIdRequest, SendMailboxToAllRequest, PagedResponse } from "@/lib/types";

export const getById = async (id: number): Promise<MailboxResponse> => {
  return get<MailboxResponse>(`/api/mailboxes/${id}`);
};

export const getByPlayerId = async (playerProfileId: number): Promise<MailboxResponse[]> => {
  return get<MailboxResponse[]>(`/api/mailboxes/player/${playerProfileId}`);
};

export const getAll = async (page = 1, pageSize = 10): Promise<PagedResponse<MailboxResponse>> => {
  return get<PagedResponse<MailboxResponse>>(
    `/api/mailboxes?page=${page}&pageSize=${pageSize}`
  );
};

export const sendByList = async (data: SendMailboxByListIdRequest): Promise<void> => {
  await post("/api/mailboxes/by-ids", data);
};

export const sendBroadcast = async (data: SendMailboxToAllRequest): Promise<void> => {
  await post("/api/mailboxes/broadcast", data);
};

export const markAsRead = async (id: number): Promise<MailboxResponse> => {
  return post<MailboxResponse>(`/api/mailboxes/${id}/read`);
};

export const claimReward = async (id: number): Promise<MailboxResponse> => {
  return post<MailboxResponse>(`/api/mailboxes/${id}/claim`);
};

export const remove = async (mailboxId: number, playerProfileId: number): Promise<void> => {
  await del(`/api/mailboxes/${mailboxId}`, { playerProfileId });
};
