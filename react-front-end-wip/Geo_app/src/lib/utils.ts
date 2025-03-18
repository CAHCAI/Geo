import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export const API_KEY = import.meta.env.VITE_API_KEY; // Read API key from .env
const API_BASE_URL = "http://localhost:8000/api";

export async function fetchProtectedData() {
    const response = await fetch("http://localhost:8000/api/protected-view/", {
        method: "GET",
        headers: {
            "X-API-KEY": API_KEY, // Securely send API key
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Unauthorized access");
    }

    return response.json();
}


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


import axios from "axios";

export interface OverrideLocationIn {
  address: string;
  latitude: number;
  longitude: number;
}

export interface OverrideLocationOut {
  id: number;
  address: string;
  latitude: number;
  longitude: number;
}

// Create a reusable Axios instance with default headers
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "X-API-KEY": API_KEY,
  },
});

//Upload XLSX: Expects a file containing columns: address, latitude, longitude.
export async function uploadXlsx(file: File): Promise<{ success: boolean; message: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post("/manual-overrides/upload-xlsx", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data; // { success: true/false, message: string }
}

//List all overrides (GET /manual-overrides).
export async function listOverrides(): Promise<OverrideLocationOut[]> {
  const response = await axiosInstance.get<OverrideLocationOut[]>("/manual-overrides");
  return response.data;
}

//Create a single override (POST /manual-overrides).
export async function createOverride(payload: OverrideLocationIn): Promise<OverrideLocationOut> {
  const response = await axiosInstance.post<OverrideLocationOut>("/manual-overrides", payload);
  return response.data;
}

//Retrieve a single override (GET /manual-overrides/{id}).
export async function retrieveOverride(id: number): Promise<OverrideLocationOut> {
  const response = await axiosInstance.get<OverrideLocationOut>(`/manual-overrides/${id}`);
  return response.data;
}

//Update an override (PUT /manual-overrides/{id}).
export async function updateOverride(
  id: number,
  payload: OverrideLocationIn
): Promise<OverrideLocationOut> {
  const response = await axiosInstance.put<OverrideLocationOut>(
    `/manual-overrides/${id}`,
    payload
  );
  return response.data;
}

//Delete an override (DELETE /manual-overrides/{id}).
export async function deleteOverride(
  id: number
): Promise<{ success: boolean; message: string }> {
  const response = await axiosInstance.delete<{ success: boolean; message: string }>(
    `/manual-overrides/${id}`
  );
  return response.data;
}
