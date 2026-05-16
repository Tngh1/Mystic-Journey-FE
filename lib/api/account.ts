const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ApiResponse {
  success: boolean;
  message: string;
  Account?: {
    AccountId: string;
    FullName: string;
    UserName: string;
    EmailAddress: string;
    Gender: string;
    PhoneNumber?: string;
    Birthday?: string;
    Role: string;
    AccessToken?: string;
    AccessTokenExpiresAt?: string;
    RefreshToken?: string;
    RefreshTokenExpiresAt?: string;
  };
}

export const login = async (emailOrUsername: string, password: string): Promise<ApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/accounts/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ EmailOrUsername: emailOrUsername, Password: password }),
  });
  return response.json();
};

export const register = async (data: {
  fullName: string;
  userName: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
  gender: string;
  phoneNumber?: string;
  birthday?: string;
}): Promise<ApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/accounts/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      FullName: data.fullName,
      UserName: data.userName,
      EmailAddress: data.emailAddress,
      Password: data.password,
      ConfirmPassword: data.confirmPassword,
      Gender: data.gender,
      PhoneNumber: data.phoneNumber,
      Birthday: data.birthday,
    }),
  });
  return response.json();
};

export const forgotPassword = async (email: string): Promise<ApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/accounts/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Email: email }),
  });
  return response.json();
};

export const resetPassword = async (data: {
  email: string;
  verificationCode: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/accounts/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      Email: data.email,
      VerificationCode: data.verificationCode,
      NewPassword: data.newPassword,
      ConfirmPassword: data.confirmPassword,
    }),
  });
  return response.json();
};

export const sendVerificationCode = async (email: string): Promise<ApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/accounts/send-verification-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Email: email }),
  });
  return response.json();
};

export const verifyEmail = async (email: string, verificationCode: string): Promise<ApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/accounts/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Email: email, VerificationCode: verificationCode }),
  });
  return response.json();
};

export const changePassword = async (
  accessToken: string,
  data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
): Promise<ApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/accounts/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      CurrentPassword: data.currentPassword,
      NewPassword: data.newPassword,
      ConfirmPassword: data.confirmPassword,
    }),
  });
  return response.json();
};
