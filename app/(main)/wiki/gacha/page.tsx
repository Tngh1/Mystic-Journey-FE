import { redirect } from "next/navigation";

// Section removed from the public wiki — only Items, Classes, Skills, Monsters remain.
export default function Page() {
  redirect("/wiki");
}
