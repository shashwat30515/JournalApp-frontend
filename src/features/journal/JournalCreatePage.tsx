import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { journalApi } from "../../api/journalApi";
import { JournalForm } from "../../components/journal/JournalForm";

export const JournalCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: journalApi.create,
    onSuccess: () => {
      toast.success("Entry created");
      queryClient.invalidateQueries({ queryKey: ["journal"] });
      navigate("/journal");
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">New Entry</h2>
      <JournalForm
        onSubmit={(data) => mutation.mutate(data)}
        isLoading={mutation.isPending}
        submitLabel="Create Entry"
      />
    </div>
  );
};
