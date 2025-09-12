import { ChevronLeft } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onBackClick?: () => void;
}

export default function Breadcrumbs({ items, onBackClick }: BreadcrumbsProps) {
  return (
    <nav className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 py-3">
          <div className="flex items-center space-x-2 text-sm">
            {items.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                {item.href && !item.isActive ? (
                  <a
                    href={item.href}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span
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
                  <span className="text-gray-400">›</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
