import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { journalApi } from "../../api/journalApi";
import { userApi } from "../../api/userApi";
import { Spinner } from "../../components/common/Spinner";

export const DashboardPage: React.FC = () => {
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: userApi.getProfile });
  const { data: entries, isLoading } = useQuery({
    queryKey: ["journal"],
    queryFn: journalApi.getAll,
  });

  if (isLoading) return <Spinner />;

  const list = entries ?? [];
  const recent = list.slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Hello{profile ? `, ${profile.username}` : ""} 👋</h2>
          <p className="text-gray-500 text-sm mt-1">Here's an overview of your journal.</p>
        </div>
        <Link
          to="/journal/new"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
        >
          <PlusCircle className="w-4 h-4" /> New Entry
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-500">Total entries</p>
          <p className="text-3xl font-bold mt-1">{list.length}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Recent entries</h3>
        {recent.length === 0 ? (
          <p className="text-gray-500 text-sm">No entries yet. Write your first one!</p>
        ) : (
          <ul className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
            {recent.map((e) => (
              <li key={e.id}>
                <Link to={`/journal/${e.id}`} className="block px-6 py-4 hover:bg-gray-50">
                  <p className="font-medium">{e.title}</p>
                  <p className="text-sm text-gray-500 line-clamp-1">{e.content}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
