import apiClient, { handleApiError } from "./client";

export interface MailResponse {
  id: number;
  playerProfileId: number;
  playerName: string | null;
  title: string;
  content: string;
  type: string;
  attachedGold: number;
  attachedGems: number;
  attachedItemId: number | null;
  attachedItemName: string | null;
  attachedItemQuantity: number;
  isRead: boolean;
  isClaimed: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  sentAt: string;
  expiredAt: string | null;
}

export interface SendMailByListIdRequest {
  playerProfileIds: number[];
  title: string;
  content: string;
  type?: string;
  attachedGold?: number;
  attachedGems?: number;
  attachedItemId?: number;
  attachedItemQuantity?: number;
  expiredAt?: string;
}

export interface SendMailToAllRequest {
  title: string;
  content: string;
  type?: string;
  attachedGold?: number;
  attachedGems?: number;
  attachedItemId?: number;
  attachedItemQuantity?: number;
  expiredAt?: string;
}

export const getById = async (id: number): Promise<MailResponse> => {
  try {
    const response = await apiClient.get<MailResponse>(`/api/mails/${id}`);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getByPlayerId = async (playerProfileId: number): Promise<MailResponse[]> => {
  try {
    const response = await apiClient.get<MailResponse[]>(`/api/mails/player/${playerProfileId}`);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getAll = async (page = 1, pageSize = 10): Promise<{ totalCount: number; items: MailResponse[] }> => {
  try {
    const response = await apiClient.get<{ totalCount: number; items: MailResponse[] }>(
      `/api/mails?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const sendByList = async (data: SendMailByListIdRequest): Promise<void> => {
  try {
    await apiClient.post("/api/mails/by-ids", data);
  } catch (err) {
    handleApiError(err);
  }
};

export const sendBroadcast = async (data: SendMailToAllRequest): Promise<void> => {
  try {
    await apiClient.post("/api/mails/broadcast", data);
  } catch (err) {
    handleApiError(err);
  }
};

export const markAsRead = async (id: number): Promise<MailResponse> => {
  try {
    const response = await apiClient.post<MailResponse>(`/api/mails/${id}/read`);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const claimReward = async (id: number): Promise<MailResponse> => {
  try {
    const response = await apiClient.post<MailResponse>(`/api/mails/${id}/claim`);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const remove = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/mails/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};
