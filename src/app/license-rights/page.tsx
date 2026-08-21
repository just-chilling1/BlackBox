import { redirect } from "next/navigation";

/** License Rights lives on Account — keep old URL working. */
export default function Page() {
  redirect("/account#license");
}
