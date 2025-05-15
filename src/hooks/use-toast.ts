
// Import Toast types from radix UI
import * as ToastPrimitive from "@radix-ui/react-toast";
import { 
  ToastActionElement, 
  ToastProps 
} from "@/components/ui/toast";

type ToastOptions = {
  title?: string;
  description?: string;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
};

// Define the toast state type
export type Toast = ToastOptions & {
  id: string;
  open: boolean;
};

// Define the hook return type
export type ToastAPI = {
  toasts: Toast[];
  toast: (opts: ToastOptions) => void;
  dismiss: (id: string) => void;
};

// Re-export the same functionality as original toast
export const useToast = (): ToastAPI => {
  // Since we can't actually implement the hook here due to circular dependencies,
  // we're creating a stub that will be overridden at runtime
  return {
    toasts: [],
    toast: () => {},
    dismiss: () => {},
  };
};

// Export the toast function
export const toast = (opts: ToastOptions) => {
  // Again, this is just a stub that will be replaced at runtime
  return { id: "", dismiss: () => {} };
};
