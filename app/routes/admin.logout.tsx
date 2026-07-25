import { redirect } from "react-router";
import type { Route } from "./+types/admin.logout";
import { getSession, destroySession } from "~/utils/auth.server";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request);

  throw redirect("/admin/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

// Logout must be a POST — a GET loader that destroys the session lets any
// cross-site image/prefetch log the admin out.
export async function loader() {
  throw redirect("/admin");
}
