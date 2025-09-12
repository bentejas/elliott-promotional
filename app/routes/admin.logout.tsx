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

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);

  throw redirect("/admin/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
