'use client';

import {useEffect, useState} from "react";
import useSupabaseClient from "@/lib/supabase/client";
import {useRouter} from "next/navigation";

export default function ShowCreate() {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedModel, setSelectedModel] = useState(null);
    const [sessionList, setSessionList] = useState<any[]>([]);
    const supabase = useSupabaseClient();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const {data, error} = await supabase
                .from("session")
                .select();

            if (data) {
                setSessionList(data);
                setSelectedModel(data.length > 0 ? data[0] : null);
            }
            if (error) {
                console.error("Error fetching sessions:", error);
            }
            setIsLoading(false);
        };

        fetchData();
    }, [supabase]);

    const handleCreateSession = async () => {
        const {data, error} = await supabase.from("session").insert({}).select();

        if (error) {
            console.error("Error creating a new session:", error);
            return;
        }

        if (data) {
            console.log("b", data[0].id);
            router.push(`/create/${data[0].id}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <button onClick={handleCreateSession}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                    Create New Session
                </button>

                {isLoading ? (
                    <div className="mt-4 text-gray-600">Loading...</div>
                ) : (
                    <div className="mt-4">
                        {sessionList.length > 0 ? (
                            <ul className="space-y-2">
                                {sessionList.map((session) => (
                                    <li key={session.id}
                                        className="py-2 px-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                                        <button onClick={() => router.push(`/create/${session.id}`)}
                                                className="text-blue-500 hover:text-blue-600 transition-colors w-full text-left">
                                            {session.id}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-gray-600">No sessions found.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
