import { SitePage } from "@/components/site-page";

export const metadata = {
  title: "About LEEC",
  description: "About the Laboratory of Electrical Engineering and Computing (LEEC).",
};

export default function AboutPage() {
  return <SitePage slug="about" badge="About" />;
}
