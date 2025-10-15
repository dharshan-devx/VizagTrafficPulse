import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { KeyIndicators } from "@shared/schema";

export function useKeyIndicators() {
  return useQuery<KeyIndicators>({
    queryKey: ["/api/indicators"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useLoadCSV() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/load-csv");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      console.log("CSV loaded successfully:", data);
      // Invalidate and refetch all related data
      queryClient.invalidateQueries({ queryKey: ["/api/indicators"] });
      queryClient.invalidateQueries({ queryKey: ["/api/traffic-data"] });
      queryClient.invalidateQueries({ queryKey: ["/api/charts"] });
    },
    onError: (error) => {
      console.error("CSV loading failed:", error);
      // Force refresh of indicators to show updated error state
      queryClient.invalidateQueries({ queryKey: ["/api/indicators"] });
    },
  });
}

export function useUploadCSV() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('csvFile', file);
      
      // Use custom fetch for FormData (apiRequest doesn't support multipart/form-data)
      // Use the correct API endpoint for Vercel
      const response = await fetch('/api/upload-csv', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Match apiRequest behavior
        // Note: Don't set Content-Type header - browser will set it with boundary for FormData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      console.log("CSV uploaded successfully:", data);
      // Immediately invalidate and refetch all related data since server has completed processing
      queryClient.invalidateQueries({ queryKey: ["/api/indicators"] });
      queryClient.invalidateQueries({ queryKey: ["/api/traffic-data"] });
      queryClient.invalidateQueries({ queryKey: ["/api/charts"] });
    },
    onError: (error) => {
      console.error("CSV upload failed:", error);
      // Force refresh of indicators to show updated error state
      queryClient.invalidateQueries({ queryKey: ["/api/indicators"] });
    },
  });
}

export function useTrafficData() {
  return useQuery({
    queryKey: ["/api/traffic-data"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useChartData(chartType: string) {
  return useQuery({
    queryKey: ["/api/charts", chartType],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
