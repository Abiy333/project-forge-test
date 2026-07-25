import * as Sentry from "@sentry/nextjs";

type ActionResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

/**
 * Wraps a Server Action with try-catch and Sentry exception tracking.
 */
export async function safeAction<T>(
  actionFn: () => Promise<T>,
  fallbackErrorMessage = "An unexpected error occurred. Please try again."
): Promise<ActionResponse<T>> {
  try {
    const data = await actionFn();
    return { success: true, data };
  } catch (error) {
    // 🚀 Send server-side error to Sentry with context
    Sentry.captureException(error);
    
    // Log in development for easy debugging
    if (process.env.NODE_ENV !== "production") {
      console.error("[Server Action Error]:", error);
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : fallbackErrorMessage,
    };
  }
}