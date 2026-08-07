import { eq, and, desc } from "drizzle-orm";
import { db } from "@/db";
import { labMembers, profiles } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SiteImage } from "@/components/site-image";

export const revalidate = 60;

const roleLabels: Record<string, string> = {
  director: "Director",
  pi: "Principal Investigator",
  researcher: "Researcher",
  phd_student: "PhD Student",
  master_student: "Master Student",
  technician: "Technician",
  visitor: "Visitor",
  external: "External Collaborator",
  client: "Client",
};

const rolePriority: Record<string, number> = {
  director: 0,
  pi: 1,
  technician: 2,
  researcher: 3,
  phd_student: 4,
  master_student: 5,
  visitor: 6,
  external: 7,
  client: 8,
};

export default async function PeoplePage() {
  const members = await db
    .select({
      name: profiles.fullName,
      title: profiles.title,
      avatarUrl: profiles.avatarUrl,
      role: labMembers.role,
      biography: profiles.biography,
      researchInterests: profiles.researchInterests,
      institution: profiles.institution,
      website: profiles.website,
      linkedIn: profiles.linkedIn,
      orcid: profiles.orcid,
      joinedAt: labMembers.joinedAt,
    })
    .from(labMembers)
    .innerJoin(profiles, eq(labMembers.userId, profiles.id))
    .where(and(eq(labMembers.status, "active"), eq(profiles.isPublic, true)))
    .orderBy(desc(labMembers.joinedAt));

  const sorted = [...members].sort(
    (a, b) =>
      (rolePriority[a.role] ?? 99) - (rolePriority[b.role] ?? 99) ||
      new Date(b.joinedAt ?? 0).getTime() - new Date(a.joinedAt ?? 0).getTime(),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <Badge variant="outline" className="mb-6">People</Badge>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
        Our Team
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12">
        Researchers and engineers driving innovation at LEEC.
      </p>

      <Separator className="mb-12" />

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-border p-12 text-center text-muted-foreground">
          <p className="text-lg font-medium">No team members yet</p>
          <p className="text-sm mt-1">
            Team members are added by the lab administrators.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((member) => (
            <Card
              key={member.name}
              className="group hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {member.avatarUrl ? (
                    <SiteImage
                      src={member.avatarUrl}
                      alt={member.name}
                      width={96}
                      height={96}
                      sizes="96px"
                      className="relative size-24 rounded-full object-cover border border-border shadow-sm"
                    />
                  ) : (
                    <div className="relative size-24 rounded-full bg-muted flex items-center justify-center border border-border">
                      <span className="text-2xl font-bold text-foreground/70">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-lg">{member.name}</h3>
                <Badge
                  variant="outline"
                  className="mt-1.5 mb-2 text-[10px] uppercase tracking-wider bg-primary/5 text-primary"
                >
                  {roleLabels[member.role] ?? member.role}
                </Badge>
                {member.title && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {member.title}
                  </p>
                )}
                {member.biography && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {member.biography}
                  </p>
                )}
                {member.researchInterests && member.researchInterests.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                    {member.researchInterests.slice(0, 3).map((interest) => (
                      <span
                        key={interest}
                        className="rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
                {(member.website || member.linkedIn || member.orcid) && (
                  <div className="flex items-center gap-3 mt-4 text-xs">
                    {member.website && (
                      <a
                        href={member.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline"
                      >
                        Website
                      </a>
                    )}
                    {member.linkedIn && (
                      <a
                        href={member.linkedIn}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline"
                      >
                        LinkedIn
                      </a>
                    )}
                    {member.orcid && (
                      <a
                        href={`https://orcid.org/${member.orcid.replace(/^https?:\/\/(www\.)?orcid\.org\//, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline"
                      >
                        ORCID
                      </a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
