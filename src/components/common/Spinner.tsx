import React from "react";
import { Loader2 } from "lucide-react";

export const Spinner: React.FC<{ label?: string }> = ({ label = "Loading..." }) => (
  <div className="flex items-center justify-center gap-2 py-16 text-gray-500">
    <Loader2 className="w-5 h-5 animate-spin" />
    <span className="text-sm">{label}</span>
  </div>
);
