import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Edit } from "lucide-react";
import { journalApi } from "../../api/journalApi";
import { Spinner } from "../../components/common/Spinner";

export const JournalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: entry, isLoading } = useQuery({
    queryKey: ["journal", id],
    queryFn: () => journalApi.getById(id!),
    enabled: !!id,
  });

  if (isLoading) return <Spinner />;
  if (!entry) return <p className="text-gray-500">Entry not found.</p>;

  return (
    <article className="max-w-3xl bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-4">
        <h2 className="text-2xl font-bold">{entry.title}</h2>
        <Link
          to={`/journal/edit/${entry.id}`}
          className="flex items-center gap-1 text-sm text-indigo-600 hover:underline"
        >
          <Edit className="w-4 h-4" /> Edit
        </Link>
      </div>
      {entry.createdAt && (
        <p className="text-xs text-gray-500 mb-6">
          {new Date(entry.createdAt).toLocaleString()}
        </p>
      )}
      <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{entry.content}</p>
    </article>
  );
};
