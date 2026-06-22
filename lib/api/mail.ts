import { get, post, del } from "./client";
import type { MailResponse, SendMailByListIdRequest, SendMailToAllRequest, PagedResponse } from "@/lib/types";
export type { MailResponse, SendMailByListIdRequest, SendMailToAllRequest, PagedResponse } from "@/lib/types";

export const getById = async (id: number): Promise<MailResponse> => {
  return get<MailResponse>(`/api/mails/${id}`);
};

export const getByPlayerId = async (playerProfileId: number): Promise<MailResponse[]> => {
  return get<MailResponse[]>(`/api/mails/player/${playerProfileId}`);
};

export const getAll = async (page = 1, pageSize = 10): Promise<PagedResponse<MailResponse>> => {
  return get<PagedResponse<MailResponse>>(
    `/api/mails?page=${page}&pageSize=${pageSize}`
  );
};

export const sendByList = async (data: SendMailByListIdRequest): Promise<void> => {
  await post("/api/mails/by-ids", data);
};

export const sendBroadcast = async (data: SendMailToAllRequest): Promise<void> => {
  await post("/api/mails/broadcast", data);
};

export const markAsRead = async (id: number): Promise<MailResponse> => {
  return post<MailResponse>(`/api/mails/${id}/read`);
};

export const claimReward = async (id: number): Promise<MailResponse> => {
  return post<MailResponse>(`/api/mails/${id}/claim`);
};

export const remove = async (mailId: number, playerProfileId: number): Promise<void> => {
  await del(`/api/mails/${mailId}`, { playerProfileId });
};
