import React from "react";
import { Link } from "react-router-dom";

export const NotFoundPage: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
    <h1 className="text-6xl font-bold text-indigo-600">404</h1>
    <p className="mt-3 text-gray-600">The page you're looking for doesn't exist.</p>
    <Link to="/dashboard" className="mt-6 text-indigo-600 font-medium hover:underline">
      Back to dashboard
    </Link>
  </div>
);
