'use client';

import { useEffect, useState } from "react";
import useSupabaseClient from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ShowCreate() {
    const [isLoading, setIsLoading] = useState(true);
    const [sessionList, setSessionList] = useState<any[]>([]);
    const supabase = useSupabaseClient();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from("session")
                .select()
                .order('created_at', { ascending: false });

            if (data) {
                setSessionList(data);
            }
            if (error) {
                console.error("Error fetching sessions:", error);
            }
            setIsLoading(false);
        };

        fetchData();
    }, [supabase]);

    const handleCreateSession = async () => {
        const { data, error } = await supabase.from("session").insert({}).select();

        if (error) {
            console.error("Error creating a new session:", error);
            return;
        }

        if (data) {
            router.push(`/create/${data[0].id}`);
        }
    };

    const handleUpdateSession = async (id, field, value) => {
        const { data, error } = await supabase
            .from('session')
            .update({ [field]: value })
            .eq('id', id)
            .select();

        if (error) {
            console.error(`Error updating session ${id}:`, error);
        }

        if (data) {
            setSessionList((prev) =>
                prev.map((session) => (session.id === id ? data[0] : session))
            );
        }
    };

    const handleRowClick = (id) => {
        router.push(`/create/${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-6xl h-full max-h-[80vh] overflow-auto">
                <button onClick={handleCreateSession}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors mb-4">
                    Create New Session
                </button>

                {isLoading ? (
                    <div className="mt-4 text-gray-600">Loading...</div>
                ) : (
                    <div className="mt-4 overflow-auto max-h-[70vh]">
                        {sessionList.length > 0 ? (
                            <table className="min-w-full bg-white">
                                <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b">ID</th>
                                    <th className="py-2 px-4 border-b">Name</th>
                                    <th className="py-2 px-4 border-b">Description</th>
                                    <th className="py-2 px-4 border-b">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {sessionList.map((session) => (
                                    <tr key={session.id} onClick={() => handleRowClick(session.id)} className="cursor-pointer hover:bg-gray-100 transition-colors">
                                        <td className="py-2 px-4 border-b">{session.id}</td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="text"
                                                value={session.name || ""}
                                                onChange={(e) => handleUpdateSession(session.id, 'name', e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="text"
                                                value={session.description || ""}
                                                onChange={(e) => handleUpdateSession(session.id, 'description', e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <button onClick={() => router.push(`/create/${session.id}`)}
                                                    className="text-blue-500 hover:text-blue-600 transition-colors"
                                                    onClick={(e) => e.stopPropagation()}>
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-gray-600">No sessions found.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
