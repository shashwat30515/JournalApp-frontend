import React from "react";
import { useQuery } from "@tanstack/react-query";
import { CloudSun, CloudOff } from "lucide-react";
import { userApi } from "../../api/userApi";

// the backend currently fetches weather for this city
const CITY = "Mumbai";

export const WeatherCard: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["weatherGreeting"],
    queryFn: userApi.getGreeting,
    staleTime: 30 * 60 * 1000, // reuse the result for 30 minutes, so the API limit isn't wasted
    retry: false,
    refetchOnWindowFocus: false,
  });

  const base = "bg-white border border-gray-200 rounded-xl p-6 min-h-[104px]";

  // placeholder with the same size, so the page doesn't jump when it loads
  if (isLoading) {
    return (
      <div className={`${base} animate-pulse`}>
        <div className="h-3 w-24 bg-gray-200 rounded mb-3" />
        <div className="h-8 w-20 bg-gray-200 rounded" />
      </div>
    );
  }

  // "feels like 29" -> 29
  const match = data?.ok ? data.text.match(/feels like\s+(-?\d+(?:\.\d+)?)/i) : null;

  if (isError || !data?.ok || !match) {
    const limitReached = data?.status === 504;
    return (
      <div className={`${base} flex items-center gap-3 text-gray-500`}>
        <CloudOff className="w-6 h-6 shrink-0" />
        <div>
          <p className="text-sm font-medium text-gray-700">Weather</p>
          <p className="text-xs">
            {limitReached ? "Weather service limit reached" : "Weather unavailable right now"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${base} flex items-center justify-between`}>
      <div>
        <p className="text-sm text-gray-500">Weather in {CITY}</p>
        <p className="text-3xl font-bold mt-1">{match[1]}°C</p>
        <p className="text-xs text-gray-400 mt-0.5">Feels like</p>
      </div>
      <CloudSun className="w-10 h-10 text-amber-500" />
    </div>
  );
};