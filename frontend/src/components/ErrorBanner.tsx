// frontend/src/components/ErrorBanner.tsx
import React from "react";

interface ErrorBannerProps {
  message: string | null;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm text-center">
      {message}
    </div>
  );
};