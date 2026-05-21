import Editor from "@/lib/components/Editor";
import SocketListener from "@/lib/components/SocketListener";


interface PageProps {
    params: Promise<{roomId: string}>;
}

export default async function DocumentPage({params}: PageProps){
   const { roomId } = await params;
   const randomId = Math.random().toString(36).substring(2,9);

   return(<>
   <SocketListener roomId={roomId}/>
   <Editor/>
   </>)
}