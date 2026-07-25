"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // You can send this error to Sentry/LogRocket here
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="rounded-full bg-red-100 p-3 text-red-600 mb-4">
        ⚠️
      </div>
      <h2 className="text-lg font-semibold text-zinc-900">Something went wrong</h2>
      <p className="mt-1 text-sm text-zinc-500 max-w-sm">
        We couldn&apos;t load this section. Please try again or contact support if the issue persists.
      </p>
      <button
        onClick={() => reset()}
        className="mt-4 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}