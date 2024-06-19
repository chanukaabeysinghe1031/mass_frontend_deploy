import getUserSession from '@/lib/getUserSession';
import {redirect} from 'next/navigation';
import Create from "@/app/create/[id]/Create";


export default async function Page() {
    const {
        data: {session},
    } = await getUserSession();

    if (!session) {
        return redirect('/login');
    }

    const user = session.user;


    return (
        <>
            <Create user={user}/>
        </>
    );
};