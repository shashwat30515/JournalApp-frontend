import React from "react";
import { JournalEntry } from "../../types";
import { Calendar, Trash2, Edit, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface JournalCardProps {
  entry: JournalEntry;
  onDelete: (id: string) => void;
}

export const JournalCard: React.FC<JournalCardProps> = ({ entry, onDelete }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : "Recent"}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{entry.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{entry.content}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <Link
          to={`/journal/${entry.id}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
        >
          Read more <ArrowRight className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to={`/journal/edit/${entry.id}`}
            className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onDelete(entry.id)}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
