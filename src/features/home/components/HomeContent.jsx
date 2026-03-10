import SectionOne from "./sections/SectionOne";
import Hero from "./Hero";
import OrganizationLogo from "@/components/ui/OrganizationLogo";

export default function HomeContent() {
    return (
        <Hero>
            <SectionOne></SectionOne>
            <OrganizationLogo></OrganizationLogo>
        </Hero>
    )
}