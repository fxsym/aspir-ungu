import NavigationBar from "@/components/ui/navbar/user/NavigationBar";
import HomeContent from "@/features/home/components/HomeContent";
import { getDashboardStats, getTimelineData } from "@/services/aspiration.services";

export default async function Home() {
    const [{ total, resolved }, timelineData] = await Promise.all([
        getDashboardStats(),
        getTimelineData(),
    ])

    return (
        <>
            <NavigationBar />
            <HomeContent
                totalIn={total}
                totalResolved={resolved}
                timelineData={timelineData}
            />
        </>
    )
}
