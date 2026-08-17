import { get, post, del } from "./client";
import type { MailboxResponse, SendMailboxByListIdRequest, SendMailboxToAllRequest, PagedResponse } from "@/lib/types";
export type { MailboxResponse, SendMailboxByListIdRequest, SendMailboxToAllRequest, PagedResponse } from "@/lib/types";


// Fetches detailed mail message and reward attachment by mail ID.
export const getById = async (id: number): Promise<MailboxResponse> => {
  return get<MailboxResponse>(`/api/mailboxes/${id}`); // Query mail details
};


// Retrieves inbox messages for the specified player profile.
export const getByPlayerId = async (playerProfileId: number): Promise<MailboxResponse[]> => {
  return get<MailboxResponse[]>(`/api/mailboxes/player/${playerProfileId}`); // GET /api/mailboxes/player/{profileId}
};

// Retrieves paginated list of all system mail records for admin panel.
export const getAll = async (page = 1, pageSize = 10): Promise<PagedResponse<MailboxResponse>> => {
  return get<PagedResponse<MailboxResponse>>(
    `/api/mailboxes?page=${page}&pageSize=${pageSize}`
  ); // GET /api/mailboxes
};

// Sends targeted system mails to a list of player profile IDs.
export const sendByList = async (data: SendMailboxByListIdRequest): Promise<void> => {
  await post("/api/mailboxes/by-ids", data); // POST /api/mailboxes/by-ids
};

// Broadcasts a gift or announcement mail to all registered players.
export const sendBroadcast = async (data: SendMailboxToAllRequest): Promise<void> => {
  await post("/api/mailboxes/broadcast", data); // POST /api/mailboxes/broadcast
};


// Marks a mail as opened.
export const markAsRead = async (id: number): Promise<MailboxResponse> => {
  return post<MailboxResponse>(`/api/mailboxes/${id}/read`); // POST /api/mailboxes/{id}/read
};

// Claims gift rewards from a mail.
export const claimReward = async (id: number): Promise<MailboxResponse> => {
  return post<MailboxResponse>(`/api/mailboxes/${id}/claim`); // POST /api/mailboxes/{id}/claim
};

// ─── Admin APIs ───────────────────────────────────────────────────────
// Deletes a mail message from player inbox.
export const remove = async (mailboxId: number, playerProfileId: number): Promise<void> => {
  await del(`/api/mailboxes/${mailboxId}`, { playerProfileId }); // DELETE /api/mailboxes/{id}
};
