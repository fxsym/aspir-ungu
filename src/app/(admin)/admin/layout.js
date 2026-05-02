import MainLayout from "@/components/layouts/MainLayout";
import LogoutButton from "@/components/ui/button/LogoutButton";
import { getCurrentUser } from "@/services/auth.services";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }) {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <MainLayout className="flex flex-col items-center" user={user}>
            {children}
            <LogoutButton>Logout</LogoutButton>
        </MainLayout>
    );
}