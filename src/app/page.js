import HomeContent from "@/features/home/components/HomeContent";
import { getDashboardStats, getTimelineData } from "@/services/aspiration.services";

export default async function Home() {
    const [{ total, resolved }, timelineData] = await Promise.all([
        getDashboardStats(),
        getTimelineData(),
    ])

    return (
        <HomeContent
            totalIn={total}
            totalResolved={resolved}
            timelineData={timelineData}
        />
    )
}
