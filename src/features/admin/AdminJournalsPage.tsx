import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, X } from "lucide-react";
import { userApi } from "../../api/userApi";
import { Spinner } from "../../components/common/Spinner";

const formatDate = (e: any) => {
  const raw = e?.date ?? e?.createdAt;
  return raw ? new Date(raw).toLocaleString() : "";
};

export const AdminJournalsPage: React.FC = () => {
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<any | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["adminJournals"],
    queryFn: userApi.adminGetAllJournals,
  });

  // close the pop-up with the Escape key
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const entries = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const list = data ?? [];
    if (!q) return list;
    return list.filter(
      (e: any) =>
        String(e.username ?? "").toLowerCase().includes(q) ||
        String(e.title ?? "").toLowerCase().includes(q) ||
        String(e.content ?? "").toLowerCase().includes(q)
    );
  }, [data, filter]);

  if (isLoading) return <Spinner />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
  <h2 className="text-2xl font-bold">All Journal Entries</h2>
  <input
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
    placeholder="Search by user, title, content or mood"
    className="w-full sm:w-80 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
  />

      </div>

      {entries.length === 0 ? (
        <p className="text-gray-500">No entries found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {entries.map((e: any, i: number) => (
            <div
              key={e.id ?? i}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium">
                    {e.username}
                  </span>
                  <span>{formatDate(e) && new Date(e.date ?? e.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{e.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{e.content}</p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => setSelected(e)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  Read more <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-8 shadow-lg"
            onClick={(ev) => ev.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-2xl font-bold text-gray-900">{selected.title}</h3>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-500 hover:text-gray-800"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 mb-6">
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium">
                {selected.username}
              </span>
              <span>{formatDate(selected)}</span>
            </div>
            <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{selected.content}</p>
          </div>
        </div>
      )}
    </div>
  );
};