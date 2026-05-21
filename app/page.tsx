import DocumentPage from "./documents/[roomId]/page";
import {redirect} from "next/navigation"


export default function Home() {
  const randomId = Math.random().toString(30).substring(2,9);
  redirect(`/documents/${randomId}`);
}
