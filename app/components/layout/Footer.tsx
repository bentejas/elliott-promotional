import { CompanyDetails } from "~/components/forms";

export function Footer() {
  return (
    <footer className="bg-background border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Company Details */}
          <div>
            <CompanyDetails />
          </div>

          {/* Logo and Copyright */}
          <div className="text-center lg:text-right">
            <div className="mb-8">
              <img
                src="/images/epp-logo-horizontal.png"
                alt="Elliott Promotional Products"
                className="h-16 mx-auto lg:ml-auto lg:mr-0"
              />
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Elliott Promotional Products. All
              rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
