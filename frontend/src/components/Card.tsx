// frontend/src/components/Card.tsx
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`w-full max-w-md rounded-2xl bg-slate-900 p-6 shadow-2xl border border-slate-800 ${className}`}>
      {children}
    </div>
  );
};