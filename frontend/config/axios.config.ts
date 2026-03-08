import axios, { AxiosInstance } from "axios";
import { Cookies } from "react-cookie";
import { toast } from "sonner";

const cookies = new Cookies();

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const OCR_URL = process.env.NEXT_PUBLIC_OCR_URL;

const commonHeaders = {
  "Content-Type": "application/json",
};

export const ocrApi: AxiosInstance = axios.create({
  baseURL: OCR_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

const unauthorizedAxiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: commonHeaders,
});

const authorizedAxiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    ...commonHeaders,
    Authorization: `Bearer ${cookies.get("accessToken")}`,
  },
});

authorizedAxiosInstance.interceptors.request.use(
  async (config) => {
    const token = await cookies.get("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const errorMessage = error?.response?.data?.message;
    const isJWTError = Array.isArray(errorMessage)
      ? errorMessage.some((msg) => msg.startsWith("JWT"))
      : typeof errorMessage === "string" && errorMessage.startsWith("JWT");

    if (axios.isAxiosError(error) && isJWTError) {
      toast.error("Your Session has Expired, login again", {
        position: "top-center",
        richColors: true,
      });
    }
    return Promise.reject(error);
  }
);

export const generateRefreshToken = async () => {
  try {
    const refreshToken = await cookies.get("refreshToken");
    const response = await authorizedAPI.post(`/auth/refresh-token`, {
      refreshToken: refreshToken,
    });
    if (response.data.success) {
      cookies.set("accessToken", response.data.payload.accessToken);
    }
    return response.data;
  } catch (error: any) {
    if (
      error.response.status === 500 &&
      error.response.data.error === "Invalid Refresh token." &&
      process.env.NODE_ENV === "production"
    ) {
      cookies.remove("accessToken");
      window.location.href = "http://localhost:3000/en/login";
    } else {
      toast.error(error.response.data.error);
    }
  }
};

export const unauthorizedAPI = unauthorizedAxiosInstance;
export const authorizedAPI = authorizedAxiosInstance;
