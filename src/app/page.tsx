import { Hero } from "@/components/home/hero";
import { ResearchAreas } from "@/components/home/research-areas";
import { EquipmentShowcase } from "@/components/home/equipment-showcase";
import { PublicationsPreview } from "@/components/home/publications-preview";
import { Partners } from "@/components/home/partners";
import { NewsPreview } from "@/components/home/news-preview";
import { EventsPreview } from "@/components/home/events-preview";
import { ProjectsPreview } from "@/components/home/projects-preview";
import { JoinCTA } from "@/components/home/join-cta";

export const revalidate = 60;

export default async function Home() {
  return (
    <>
      <Hero />
      <PublicationsPreview />
      <NewsPreview />
      <EventsPreview />
      <ProjectsPreview />
      <EquipmentShowcase />
      <ResearchAreas />
      <Partners />
      <JoinCTA />
    </>
  );
}
