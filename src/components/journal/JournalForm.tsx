import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CreateJournalDTO } from "../../types";

const SENTIMENTS = [
  { value: "Happy", emoji: "😊" },
  { value: "Sad", emoji: "😢" },
  { value: "Angry", emoji: "😠" },
  { value: "Anxious", emoji: "😰" },
] as const;

const journalSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  sentiment: z.enum(["Happy", "Sad", "Angry", "Anxious"], {
    required_error: "Select how you feel",
    invalid_type_error: "Select how you feel",
  }),
});

type JournalFormData = z.infer<typeof journalSchema>;

interface JournalFormProps {
  initialData?: CreateJournalDTO;
  onSubmit: (data: JournalFormData) => void;
  isLoading: boolean;
  submitLabel?: string;
}

export const JournalForm: React.FC<JournalFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  submitLabel = "Save Entry",
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JournalFormData>({
    resolver: zodResolver(journalSchema),
    defaultValues: initialData ?? { title: "", content: "" },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-2xl bg-white p-8 rounded-xl border border-gray-200 shadow-sm"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          {...register("title")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          placeholder="What's on your mind today?"
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
        <textarea
          rows={8}
          {...register("content")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y"
          placeholder="Write your thoughts..."
        />
        {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">How are you feeling?</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SENTIMENTS.map((s) => (
            <label key={s.value} className="cursor-pointer">
              <input type="radio" value={s.value} {...register("sentiment")} className="peer sr-only" />
              <div className="flex flex-col items-center gap-1 py-3 rounded-lg border border-gray-300 text-sm text-gray-600 transition-colors peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500">
                <span className="text-2xl">{s.emoji}</span>
                {s.value}
              </div>
            </label>
          ))}
        </div>
        {errors.sentiment && <p className="text-red-500 text-xs mt-1">{errors.sentiment.message}</p>}
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {isLoading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};