import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export const API_KEY = import.meta.env.VITE_API_KEY; // Read API key from .env

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
