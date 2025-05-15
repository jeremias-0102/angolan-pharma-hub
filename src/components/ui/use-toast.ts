
// Re-export the hook and function from our implementation
import { useToast as useToastOriginal, toast as toastOriginal } from "@/hooks/use-toast";

// Re-export the hook and function
export const useToast = useToastOriginal;
export const toast = toastOriginal;
