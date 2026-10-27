import React from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { journalApi } from "../../api/journalApi";
import { JournalCard } from "../../components/journal/JournalCard";
import { Spinner } from "../../components/common/Spinner";

export const JournalListPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["journal"], queryFn: journalApi.getAll });

  const deleteMutation = useMutation({
    mutationFn: journalApi.delete,
    onSuccess: () => {
      toast.success("Entry deleted");
      queryClient.invalidateQueries({ queryKey: ["journal"] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this entry? This cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <Spinner />;

  const entries = data ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Journal Entries</h2>
        <Link
          to="/journal/new"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
        >
          <PlusCircle className="w-4 h-4" /> New Entry
        </Link>
      </div>

      {entries.length === 0 ? (
        <p className="text-gray-500">No entries yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <JournalCard key={entry.id} entry={entry} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};
