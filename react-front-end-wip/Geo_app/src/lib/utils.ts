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

//Fetch the number of active admin sessions from the backend.
export interface ActiveSessionsResponse {
  admin_count: number;
  normal_count: number;
}

export async function getActiveSessions(): Promise<ActiveSessionsResponse> {
  const response = await axiosInstance.get<ActiveSessionsResponse>("/active-sessions");
  return response.data;
}

export const getApiKey = async (): Promise<void> => {
  try {
      const response = await fetch("/api/generate-api-key/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
          throw new Error("Failed to generate API key");
      }

      const data = await response.json();
      localStorage.setItem("api_key", data.api_key);
  } catch (error) {
      console.error("Error generating API key:", error);
  }
};

export const validateKey = async (): Promise<void> => {
  try {
      const apiKey = localStorage.getItem("api_key");

      if (!apiKey) {
          console.error("No API key found in local storage");
          return;
      }

      const response = await fetch("/api/validate-api-key/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ api_key: apiKey }),
      });

      if (!response.ok) {
          throw new Error("API key validation failed");
      }

      const data = await response.json();
      console.log(data.message);
  } catch (error) {
      console.error("Error validating API key:", error);
  }
};



const AXIOS = axios.create({
  baseURL: "http://localhost:8000/api",
  // if you need to send cookies or an API key
  //withCredentials: true,
  headers: {
    "X-API-KEY": API_KEY
  }
});

// Check override location in Django
export async function checkOverrideLocation(address: string) {
  // e.g. GET /override-locations?address=...
  const resp = await AXIOS.get<{
    found: boolean;
    latitude?: number;
    longitude?: number;
    error?: string;
  }>("/override-locations", {
    params: { address },
  });
  return resp.data;
}

// Call Azure geocoding if not found in override
export async function getCoordinatesFromAzure(address: string) {
  // Replace with Azure endpoint from MSA
  const azureKey = "YOUR_AZURE_KEY";
  const url = `https://atlas.microsoft.com/search/address/json?api-version=1.0&subscription-key=${azureKey}&query=${encodeURIComponent(address)}`;
  
  const resp = await fetch(url);
  const data = await resp.json();
  // parse lat/lon from data
  if (data && data.results && data.results.length > 0) {
    const lat = data.results[0].position.lat;
    const lng = data.results[0].position.lon;
    return { lat, lng };
  }
  return { lat: null, lng: null };
}
