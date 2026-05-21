import Editor from "@/lib/components/Editor";
import Presence from "@/lib/components/Presence";
import SocketListener from "@/lib/components/SocketListener";


interface PageProps {
    params: Promise<{ roomId: string }>;
}

export default async function DocumentPage({ params }: PageProps) {
    const { roomId } = await params;

    return (
        <div>
            <SocketListener roomId={roomId} />

            <div>
                <h1 className="text-center text-5xl p-4 bg-gradient-to-b from-red-800  to-violet-700 bg-clip-text text-transparent font-mono">
                    DEVBOARD
                </h1>
                <p className="text-red-600">
                    Room Id: {roomId}
                </p>
            </div>
            <Presence />

            <div>
                <Editor />
            </div>

        </div>
    )
}