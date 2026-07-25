import { useState } from "react";
import { Form, redirect } from "react-router";
import type { Route } from "./+types/admin.login";
import {
  validateAdminCredentials,
  getWhitelistedEmails,
  createAdminSession,
  commitSession,
  getSession,
} from "~/utils/auth.server";
import { ChevronDown, Lock, Mail } from "lucide-react";

export async function loader({ request }: Route.LoaderArgs) {
  // Check if already authenticated
  const session = await getSession(request);
  if (session.get("isAuthenticated")) {
    throw redirect("/admin");
  }

  return {
    whitelistedEmails: getWhitelistedEmails(),
  };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return {
      error: "Email and password are required",
    };
  }

  if (!validateAdminCredentials(email, password)) {
    return {
      error: "Invalid credentials",
    };
  }

  // Create session and redirect to admin
  const session = await createAdminSession(email);

  throw redirect("/admin", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function AdminLogin({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { whitelistedEmails } = loaderData;
  const [selectedEmail, setSelectedEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Access
          </h1>
          <p className="text-gray-600">
            Select your email and enter the gateway password
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <Form method="post" className="space-y-6">
            {/* Error Message */}
            {actionData?.error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="text-red-800 text-sm font-medium">
                  {actionData.error}
                </p>
              </div>
            )}

            {/* Email Selection — native select for keyboard/screen-reader support */}
            <div className="space-y-2">
              <label
                htmlFor="admin-email"
                className="block text-sm font-semibold text-gray-900"
              >
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select
                  id="admin-email"
                  name="email"
                  value={selectedEmail}
                  onChange={(e) => setSelectedEmail(e.target.value)}
                  required
                  className={`w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-colors ${
                    selectedEmail ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  <option value="" disabled>
                    Select your email address
                  </option>
                  {whitelistedEmails.map((email) => (
                    <option key={email} value={email}>
                      {email}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Gateway Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter gateway password"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-colors"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!selectedEmail || !password}
              className="w-full bg-black text-white rounded-xl py-3 px-4 font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Access Admin Panel
            </button>
          </Form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Elliott Promotional Products Admin Portal
          </p>
        </div>
      </div>
    </div>
  );
}
