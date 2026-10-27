import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length === 0 || pathnames[0] === "login" || pathnames[0] === "register") {
    return null;
  }

  return (
    <nav className="flex items-center text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
      <Link to="/dashboard" className="flex items-center hover:text-gray-900 transition-colors">
        <Home className="w-4 h-4 mr-1" />
        Dashboard
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");

        if (name === "dashboard") return null;

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            {isLast ? (
              <span className="font-semibold text-gray-800" aria-current="page">
                {formattedName.length > 20 ? `${formattedName.substring(0, 20)}...` : formattedName}
              </span>
            ) : (
              <Link to={routeTo} className="hover:text-gray-900 transition-colors">
                {formattedName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
