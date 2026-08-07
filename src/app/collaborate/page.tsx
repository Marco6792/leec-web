"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  FlaskConical,
  Wrench,
  DollarSign,
  Users,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Building2,
  FileText,
  Shield,
  Mail,
  Send,
  Quote,
  Star,
  Handshake,
} from "lucide-react";

// ─── Collaboration Types ──────────────────────────────────────────────────

const collaborationTypes = [
  {
    id: "contract_research",
    icon: FlaskConical,
    title: "Contract Research",
    description:
      "Your company has a technical problem that needs solving. We conduct targeted research, deliver a solution, and transfer the results to your team.",
    benefits: [
      "Access to world-class researchers",
      "State-of-the-art lab equipment",
      "Confidential research agreements",
      "Custom timelines and deliverables",
    ],
    color: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "equipment_access",
    icon: Wrench,
    title: "Equipment & Testing",
    description:
      "Need access to specialized instruments for material characterization, NDT analysis, or electronic testing? Our facilities are available for external use.",
    benefits: [
      "Leica microscopes & analyzers",
      "Electromagnetic testing stations",
      "RF & power electronics lab",
      "Technician-assisted measurements",
    ],
    color: "from-emerald-500/20 to-emerald-600/5",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "joint_grant",
    icon: DollarSign,
    title: "Joint Grant Applications",
    description:
      "We collaborate on funding proposals for bilateral research projects — from EU Horizon and IRD programs to African Union and national research funds.",
    benefits: [
      "Proven track record with grants",
      "International consortium experience",
      "Cameroon-France partnership leverage",
      "Full proposal development support",
    ],
    color: "from-amber-500/20 to-amber-600/5",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "consulting",
    icon: Lightbulb,
    title: "Technical Consulting",
    description:
      "Our researchers provide expert advice on electrical engineering challenges — power systems, IoT architecture, sensor design, and electromagnetic compatibility.",
    benefits: [
      "Expert review & analysis",
      "Feasibility studies",
      "Technology roadmap planning",
      "Knowledge transfer & training",
    ],
    color: "from-violet-500/20 to-violet-600/5",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    id: "visiting_scholar",
    icon: Users,
    title: "Visiting Scholar Program",
    description:
      "Send your researchers to LEEC for short-term or long-term stays. They gain hands-on experience, contribute to joint projects, and build lasting collaborations.",
    benefits: [
      "Shared desk & lab space",
      "Mentorship by LEEC PIs",
      "Access to all lab facilities",
      "Joint publication opportunities",
    ],
    color: "from-rose-500/20 to-rose-600/5",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
];

// ─── How It Works Steps ──────────────────────────────────────────────────

const steps = [
  {
    step: 1,
    title: "Submit a Collaboration Request",
    description:
      "Tell us about your organization, project idea, and what kind of collaboration you're looking for. We'll review within 5 business days.",
    icon: FileText,
  },
  {
    step: 2,
    title: "Initial Scoping & Matchmaking",
    description:
      "Our technology transfer team reviews your request and identifies the best principal investigator and research team for your project.",
    icon: Users,
  },
  {
    step: 3,
    title: "Agreement & Legal Framework",
    description:
      "We work together on an MOU, NDA, or research contract that defines scope, IP terms, funding, and deliverables. Digital signing available.",
    icon: Shield,
  },
  {
    step: 4,
    title: "Research & Collaboration",
    description:
      "Research kicks off with regular milestone reviews. Collaboration progress is tracked on a public project page with transparent updates.",
    icon: FlaskConical,
  },
  {
    step: 5,
    title: "Delivery & Impact",
    description:
      "Results delivered, publications co-authored, IP protected where applicable. Long-term partnerships continue with follow-on projects.",
    icon: CheckCircle,
  },
];

// ─── Success Stories ──────────────────────────────────────────────────────

const successStories = [
  {
    quote:
      "Collaborating with LEEC gave us access to characterization equipment we couldn't afford in-house. Their NDT expertise helped us improve our quality control process by 40%.",
    author: "Dr. Emmanuel Nkwi",
    role: "R&D Director, CAMTECH Industries",
  },
  {
    quote:
      "The joint grant application with LEEC researchers was seamless. Their experience with international consortia was invaluable for our Horizon proposal.",
    author: "Prof. Marie Dupont",
    role: "Research Partnerships, INSA Lyon",
  },
];

// ─── FAQ Data ─────────────────────────────────────────────────────────────

const faqs = [
  {
    q: "Do I need to be a registered partner to submit a request?",
    a: "Yes. You'll need to create a partner account first. Registration is free and takes about 2 minutes. Once registered, you can submit collaboration requests, track their status, and view active project milestones from your dashboard.",
  },
  {
    q: "What types of organizations can collaborate with LEEC?",
    a: "We welcome universities, research institutes, industry partners (from startups to multinationals), government agencies, NGOs, and funding organizations. Each partnership type has a tailored collaboration framework.",
  },
  {
    q: "How are intellectual property rights handled?",
    a: "IP terms are negotiated per project and documented in the collaboration agreement. LEEC follows standard university-industry IP frameworks, with options for exclusive licensing, joint ownership, or publication-only arrangements depending on funding and contribution levels.",
  },
  {
    q: "Is there a cost to collaborate?",
    a: "It depends on the collaboration type. Contract research and equipment access involve cost-recovery fees. Joint grant applications are typically funded by the grant. Consulting engagements have negotiated rates. We'll discuss costs during the scoping phase.",
  },
  {
    q: "How long does it take to set up a collaboration?",
    a: "Simple equipment access arrangements can be set up in 1-2 weeks. Contract research projects typically take 3-4 weeks for agreement finalization. Large joint grants follow the funding calendar. The scoping call usually happens within 5 business days of your request.",
  },
  {
    q: "Can I visit the lab before committing?",
    a: "Absolutely. We welcome potential partners to tour our facilities, meet the research team, and discuss project ideas in person. Use the collaboration form to request a visit, and we'll arrange a convenient time.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────

export default function CollaboratePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [formStep, setFormStep] = useState<"auth" | "form" | "submitted">(
    "auth"
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationType: "industry",
    website: "",
    contactName: "",
    contactEmail: "",
    country: "",
    collaborationType: "contract_research",
    projectTitle: "",
    description: "",
    timeline: "",
    budget: "",
    ndaRequired: false,
    heardAbout: "",
  });

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
        });
      }
    });
  }, []);

  async function handleStartCollaboration() {
    if (!user) {
      // Not logged in — redirect to signup with return URL
      router.push("/signup?redirect=/collaborate");
      return;
    }
    setFormStep("form");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    // Simulate submission (DB not migrated yet)
    await new Promise((r) => setTimeout(r, 1500));
    setFormStep("submitted");
    setSubmitting(false);
  }

  function updateField(field: string, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="min-h-screen">
      {/* ─── Hero ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background via-muted/30 to-background py-28 sm:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Badge variant="outline" className="mb-6">
            <Handshake className="h-3.5 w-3.5 mr-1.5" />
            Collaboration
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 max-w-4xl">
            Partner with{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              LEEC
            </span>{" "}
            to Advance Research &amp; Innovation
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10">
            Whether you&apos;re a company needing contract research, a
            university seeking joint grants, or an organization wanting access to
            world-class equipment — let&apos;s build something together.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button size="lg" onClick={handleStartCollaboration}>
              Start a Collaboration
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
            <Link href="#types">
              <Button variant="outline" size="lg">
                Explore Collaboration Types
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 sm:gap-12 mt-14">
            {[
              { value: "4+", label: "Active partnerships" },
              { value: "5", label: "Collaboration types" },
              { value: "50+", label: "Researchers & engineers" },
              { value: "3", label: "Continents connected" },
            ].map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Collaboration Types ────────────────────────────────────── */}
      <section id="types" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Collaboration Types
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              How We Can Work Together
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Flexible collaboration models designed to match your needs — from
              quick equipment access to long-term research partnerships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collaborationTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.id}
                  className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg hover:border-foreground/20 transition-all duration-300"
                >
                  <div
                  className={cn(
                      "h-2",
                      type.color
                    )}
                  />
                  <div className="p-6">
                    <div
                      className={cn(
                        "w-11 h-11 rounded-lg flex items-center justify-center mb-4 bg-muted",
                        type.iconColor
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{type.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {type.description}
                    </p>
                    <ul className="space-y-1.5">
                      {type.benefits.map((benefit) => (
                        <li
                          key={benefit}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
                          <CheckCircle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-500" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── How It Works ────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Process
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From your first inquiry to a fully operational collaboration —
              a transparent, structured journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-border" />

            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative z-10 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mb-4 shadow-md">
                    {step.step}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-foreground/70" />
                  </div>
                  <h3 className="font-semibold text-sm mb-2">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Success Stories ─────────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Success Stories
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Trusted by Industry &amp; Academia
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real partnerships that have delivered real results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {successStories.map((story) => (
              <div
                key={story.author}
                className="relative rounded-xl border bg-card p-8 hover:shadow-md transition-shadow"
              >
                <Quote className="h-8 w-8 text-primary/20 absolute top-6 right-6" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 italic">
                  &ldquo;{story.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {story.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{story.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {story.role}
                    </p>
                  </div>
                  <div className="ml-auto flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Collaboration Form Section ─────────────────────────────── */}
      <section
        id="form"
        className="py-20 sm:py-28 bg-gradient-to-b from-muted/30 to-background border-t border-border"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {formStep === "submitted" ? (
            /* Submitted state */
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Request Submitted!
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Thank you, {formData.contactName || "Partner"}! We&apos;ve
                received your collaboration request. Our technology transfer team
                will review it and reach out within 5 business days at{" "}
                <strong>{formData.contactEmail}</strong>.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={() => setFormStep("auth")}>
                  Submit Another Request
                </Button>
                <Link href="/">
                  <Button variant="outline">Back to Home</Button>
                </Link>
              </div>
            </div>
          ) : formStep === "form" ? (
            /* Collaboration form */
            <div>
              <div className="text-center mb-10">
                <Badge variant="outline" className="mb-4">
                  Get Started
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                  Start a Collaboration
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Tell us about your project. Fields marked with * are required.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-xl border bg-card p-6 sm:p-8"
              >
                {/* Organization Info */}
                <div>
                  <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    Organization Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1.5">
                        Organization Name <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="text"
                        required
                        value={formData.organizationName}
                        onChange={(e) =>
                          updateField("organizationName", e.target.value)
                        }
                        placeholder="e.g. CAMTECH Industries"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Organization Type <span className="text-destructive">*</span>
                      </label>
                      <NativeSelect
                        value={formData.organizationType}
                        onChange={(e) =>
                          updateField("organizationType", e.target.value)
                        }
                        required
                        className="w-full"
                      >
                        <option value="industry">Industry / Company</option>
                        <option value="startup">Startup</option>
                        <option value="university">University</option>
                        <option value="research_institute">
                          Research Institute
                        </option>
                        <option value="government">Government Agency</option>
                        <option value="ngo">NGO / Non-profit</option>
                        <option value="funding_agency">Funding Agency</option>
                      </NativeSelect>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Country
                      </label>
                      <Input
                        type="text"
                        value={formData.country}
                        onChange={(e) => updateField("country", e.target.value)}
                        placeholder="e.g. Cameroon, France, ..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Website
                      </label>
                      <Input
                        type="url"
                        value={formData.website}
                        onChange={(e) => updateField("website", e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Contact Person */}
                <div>
                  <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Contact Person
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Full Name <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="text"
                        required
                        value={formData.contactName}
                        onChange={(e) =>
                          updateField("contactName", e.target.value)
                        }
                        placeholder="Dr. Your Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Email <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.contactEmail}
                        onChange={(e) =>
                          updateField("contactEmail", e.target.value)
                        }
                        placeholder="you@organization.com"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Project Details */}
                <div>
                  <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-muted-foreground" />
                    Project Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Collaboration Type{" "}
                        <span className="text-destructive">*</span>
                      </label>
                      <NativeSelect
                        value={formData.collaborationType}
                        onChange={(e) =>
                          updateField("collaborationType", e.target.value)
                        }
                        required
                        className="w-full"
                      >
                        <option value="contract_research">
                          Contract Research
                        </option>
                        <option value="equipment_access">
                          Equipment Access & Testing
                        </option>
                        <option value="joint_grant">
                          Joint Grant Application
                        </option>
                        <option value="consulting">Technical Consulting</option>
                        <option value="visiting_scholar">
                          Visiting Scholar Program
                        </option>
                      </NativeSelect>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Project Title{" "}
                        <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="text"
                        required
                        value={formData.projectTitle}
                        onChange={(e) =>
                          updateField("projectTitle", e.target.value)
                        }
                        placeholder="e.g. Development of an IoT-based predictive maintenance system"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Description &amp; Objectives{" "}
                        <span className="text-destructive">*</span>
                      </label>
                      <Textarea
                        required
                        rows={4}
                        value={formData.description}
                        onChange={(e) =>
                          updateField("description", e.target.value)
                        }
                        placeholder="Describe your project, the problem you're trying to solve, and what kind of support you're looking for from LEEC..."
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">
                          Expected Timeline
                        </label>
                        <NativeSelect
                          value={formData.timeline}
                          onChange={(e) =>
                            updateField("timeline", e.target.value)
                          }
                          className="w-full"
                        >
                          <option value="">Select timeline</option>
                          <option value="1-3_months">1–3 months</option>
                          <option value="3-6_months">3–6 months</option>
                          <option value="6-12_months">6–12 months</option>
                          <option value="12+_months">More than 1 year</option>
                          <option value="not_sure">Not sure yet</option>
                        </NativeSelect>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">
                          Estimated Budget
                        </label>
                        <NativeSelect
                          value={formData.budget}
                          onChange={(e) =>
                            updateField("budget", e.target.value)
                          }
                          className="w-full"
                        >
                          <option value="">Select range</option>
                          <option value="under_5k">Under 5,000 €</option>
                          <option value="5k_20k">5,000 – 20,000 €</option>
                          <option value="20k_50k">20,000 – 50,000 €</option>
                          <option value="50k_100k">50,000 – 100,000 €</option>
                          <option value="100k+">100,000 €+</option>
                          <option value="not_sure">Not sure yet</option>
                        </NativeSelect>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Legal & Discovery */}
                <div>
                  <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    Legal &amp; Discovery
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.ndaRequired}
                        onChange={(e) =>
                          updateField("ndaRequired", e.target.checked)
                        }
                        className="mt-0.5 size-4 rounded border-border accent-primary"
                      />
                      <span className="text-sm">
                        <span className="font-medium">
                          I would like to discuss under NDA
                        </span>
                        <br />
                        <span className="text-muted-foreground">
                          We can sign a Non-Disclosure Agreement before
                          discussing project details.
                        </span>
                      </span>
                    </label>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        How did you hear about us?
                      </label>
                      <NativeSelect
                        value={formData.heardAbout}
                        onChange={(e) =>
                          updateField("heardAbout", e.target.value)
                        }
                        className="w-full"
                      >
                        <option value="">Select an option</option>
                        <option value="website">Website</option>
                        <option value="conference">Conference / Event</option>
                        <option value="referral">Referral</option>
                        <option value="publication">Publication</option>
                        <option value="social_media">Social Media</option>
                        <option value="other">Other</option>
                      </NativeSelect>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormStep("auth")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>Submitting&hellip;</>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-1.5" />
                        Submit Collaboration Request
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            /* CTA to start form */
            <div className="text-center">
              <Badge variant="outline" className="mb-4">
                Get Started
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Ready to Collaborate?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Submit a collaboration request and our team will get back to you
                within 5 business days to schedule an initial scoping call.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" onClick={handleStartCollaboration}>
                  <Send className="h-4 w-4 mr-1.5" />
                  Start Your Collaboration
                </Button>
                <a href="mailto:leec@ubuea.cm">
                  <Button variant="outline" size="lg">
                    <Mail className="h-4 w-4 mr-1.5" />
                    Email Us Directly
                  </Button>
                </a>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Or contact us at{" "}
                <a
                  href="mailto:leec@ubuea.cm"
                  className="text-primary hover:underline"
                >
                  leec@ubuea.cm
                </a>{" "}
                &middot; +237 XXX XXX XXX
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-muted/30 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              FAQ
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to know about collaborating with LEEC.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border bg-card overflow-hidden transition-shadow hover:shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer"
                >
                  <span className="font-medium text-sm pr-4">{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                      openFaq === i && "rotate-180"
                    )}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ───────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-blue-700 overflow-hidden px-8 py-16 sm:py-20 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
                Let&apos;s Build the Future Together
              </h2>
              <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
                Whether you have a specific project in mind or just exploring
                possibilities — we&apos;re here to help.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={handleStartCollaboration}
                >
                  <Send className="h-4 w-4 mr-1.5" />
                  Start a Collaboration
                </Button>
                <a href="mailto:leec@ubuea.cm">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  >
                    <Mail className="h-4 w-4 mr-1.5" />
                    Contact Us
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
