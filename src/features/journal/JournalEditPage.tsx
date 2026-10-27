import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { journalApi } from "../../api/journalApi";
import { JournalForm } from "../../components/journal/JournalForm";
import { Spinner } from "../../components/common/Spinner";

export const JournalEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: entry, isLoading } = useQuery({
    queryKey: ["journal", id],
    queryFn: () => journalApi.getById(id!),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (data: { title: string; content: string }) => journalApi.update(id!, data),
    onSuccess: () => {
      toast.success("Entry updated");
      queryClient.invalidateQueries({ queryKey: ["journal"] });
      navigate("/journal");
    },
  });

  if (isLoading) return <Spinner />;
  if (!entry) return <p className="text-gray-500">Entry not found.</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Edit Entry</h2>
      <JournalForm
        initialData={{ title: entry.title, content: entry.content }}
        onSubmit={(data) => mutation.mutate(data)}
        isLoading={mutation.isPending}
        submitLabel="Update Entry"
      />
    </div>
  );
};
