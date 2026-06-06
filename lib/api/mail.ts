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
  sentAt: string;
  expiredAt: string | null;
}

export interface SendMailRequest {
  playerProfileId: number;
  title: string;
  content: string;
  type?: string;
  attachedGold?: number;
  attachedGems?: number;
  attachedItemId?: number;
  attachedItemQuantity?: number;
  expiredAt?: string;
}

export interface SendBulkMailRequest {
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

export const send = async (data: SendMailRequest): Promise<MailResponse> => {
  try {
    const response = await apiClient.post<MailResponse>("/api/mails", data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const sendBulk = async (data: SendBulkMailRequest): Promise<void> => {
  try {
    await apiClient.post("/api/mails/bulk", data);
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
