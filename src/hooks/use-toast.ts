
// Re-export toast from the original location
import { toast as toastOriginal, useToast as useToastOriginal } from "@/components/ui/toast";

export const useToast = useToastOriginal;
export const toast = toastOriginal;
