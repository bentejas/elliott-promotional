import { Link } from "react-router";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            {items.map((item, index) => (
              <li key={index} className="flex items-center space-x-2">
                {item.href && !item.isActive ? (
                  <Link
                    to={item.href}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={item.isActive ? "page" : undefined}
                    className={
                      item.isActive
                        ? "text-gray-900 font-medium"
                        : "text-gray-500"
                    }
                  >
                    {item.label}
                  </span>
                )}
                {index < items.length - 1 && (
                  <span aria-hidden="true" className="text-gray-400">
                    ›
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </nav>
  );
}
