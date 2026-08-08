"use server";

import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import {
  publications,
  projects,
  news,
  events,
  profiles,
  equipment,
  trainingSessions,
  sitePages,
  researchDomains,
  partners,
} from "@/db/schema";
import { SearchDocument } from "@/lib/search/types";
import { stripHtml } from "@/lib/strip-html";

function cleanText(text: string | null | undefined): string {
  if (!text) return "";
  return stripHtml(text).trim();
}

function truncate(text: string, maxLen = 200): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + "...";
}

export async function getSearchDocuments(): Promise<SearchDocument[]> {
  const results: SearchDocument[] = [];

  const [pubRows, projectRows, newsRows, eventRows, profileRows, equipmentRows, trainingRows, pageRows, domainRows, partnerRows] =
    await Promise.all([
      db
        .select({
          id: publications.id,
          title: publications.title,
          abstract: publications.abstract,
          keywords: publications.keywords,
          researchDomains: publications.researchDomains,
          year: publications.year,
          type: publications.type,
        })
        .from(publications)
        .where(eq(publications.openAccess, true))
        .limit(500),
      db
        .select({
          id: projects.id,
          title: projects.title,
          description: projects.description,
          researchDomains: projects.researchDomains,
          status: projects.status,
          fundingSource: projects.fundingSource,
          slug: projects.slug,
        })
        .from(projects)
        .where(eq(projects.status, "active"))
        .limit(500),
      db
        .select({
          id: news.id,
          title: news.title,
          excerpt: news.excerpt,
          content: news.content,
          tags: news.tags,
          publishedAt: news.publishedAt,
          slug: news.slug,
        })
        .from(news)
        .where(eq(news.published, true))
        .orderBy(desc(news.publishedAt))
        .limit(200),
      db
        .select({
          id: events.id,
          title: events.title,
          description: events.description,
          eventType: events.eventType,
          location: events.location,
          startDate: events.startDate,
        })
        .from(events)
        .where(eq(events.published, true))
        .limit(200),
      db
        .select({
          id: profiles.id,
          fullName: profiles.fullName,
          title: profiles.title,
          institution: profiles.institution,
          speciality: profiles.speciality,
          researchInterests: profiles.researchInterests,
          biography: profiles.biography,
        })
        .from(profiles)
        .where(eq(profiles.isPublic, true))
        .limit(200),
      db
        .select({
          id: equipment.id,
          name: equipment.name,
          description: equipment.description,
          category: equipment.category,
          manufacturer: equipment.manufacturer,
          model: equipment.model,
          specifications: equipment.specifications,
          location: equipment.location,
          slug: equipment.slug,
        })
        .from(equipment)
        .where(eq(equipment.isPublic, true))
        .limit(200),
      db
        .select({
          id: trainingSessions.id,
          title: trainingSessions.title,
          description: trainingSessions.description,
          tags: trainingSessions.tags,
          level: trainingSessions.level,
          status: trainingSessions.status,
          slug: trainingSessions.slug,
        })
        .from(trainingSessions)
        .where(eq(trainingSessions.published, true))
        .limit(200),
      db
        .select({
          id: sitePages.id,
          title: sitePages.title,
          subtitle: sitePages.subtitle,
          content: sitePages.content,
          slug: sitePages.slug,
        })
        .from(sitePages)
        .where(eq(sitePages.published, true))
        .limit(100),
      db
        .select({
          id: researchDomains.id,
          name: researchDomains.name,
          description: researchDomains.description,
          slug: researchDomains.slug,
        })
        .from(researchDomains)
        .limit(100),
      db
        .select({
          id: partners.id,
          name: partners.name,
          description: partners.description,
          partnerType: partners.partnerType,
          country: partners.country,
          slug: partners.slug,
        })
        .from(partners)
        .limit(200),
    ]);

  for (const row of pubRows) {
    const descParts = [
      cleanText(row.abstract),
      row.keywords?.length ? cleanText(row.keywords.join(", ")) : "",
      row.researchDomains?.length ? cleanText(row.researchDomains.join(", ")) : "",
      row.year ? `Year: ${row.year}` : "",
      row.type ? `Type: ${row.type}` : "",
    ].filter(Boolean);
    results.push({
      id: row.id,
      type: "publication",
      title: row.title,
      description: truncate(descParts.join(" | ")),
      href: `/publications/${row.id}`,
      category: row.type,
      tags: row.keywords ?? [],
      date: row.year?.toString(),
    });
  }

  for (const row of projectRows) {
    const descParts = [
      cleanText(row.description),
      row.researchDomains?.length ? cleanText(row.researchDomains.join(", ")) : "",
      row.fundingSource ? `Funding: ${row.fundingSource}` : "",
      `Status: ${row.status}`,
    ].filter(Boolean);
    results.push({
      id: row.id,
      type: "project",
      title: row.title,
      description: truncate(descParts.join(" | ")),
      href: `/projects/${row.slug}`,
      category: row.status ?? undefined,
      tags: row.researchDomains ?? [],
    });
  }

  for (const row of newsRows) {
    const descParts = [
      cleanText(row.excerpt),
      cleanText(row.content),
      row.tags?.length ? cleanText(row.tags.join(", ")) : "",
    ].filter(Boolean);
    results.push({
      id: row.id,
      type: "news",
      title: row.title,
      description: truncate(descParts.join(" | ")),
      href: `/news/${row.slug}`,
      tags: row.tags ?? [],
      date: row.publishedAt?.toISOString(),
    });
  }

  for (const row of eventRows) {
    const descParts = [
      cleanText(row.description),
      row.location ? `Location: ${row.location}` : "",
      row.eventType ? `Type: ${row.eventType}` : "",
      row.startDate ? `Date: ${new Date(row.startDate).toLocaleDateString()}` : "",
    ].filter(Boolean);
    results.push({
      id: row.id,
      type: "event",
      title: row.title,
      description: truncate(descParts.join(" | ")),
      href: `/events/${row.id}`,
      category: row.eventType ?? undefined,
      date: row.startDate?.toISOString(),
    });
  }

  for (const row of profileRows) {
    const descParts = [
      row.title ? `Title: ${row.title}` : "",
      row.institution ? `Institution: ${row.institution}` : "",
      row.speciality ? `Speciality: ${row.speciality}` : "",
      row.researchInterests?.length ? cleanText(row.researchInterests.join(", ")) : "",
      cleanText(row.biography),
    ].filter(Boolean);
    results.push({
      id: row.id,
      type: "person",
      title: row.fullName,
      description: truncate(descParts.join(" | ")),
      href: `/people`,
      category: row.title ?? undefined,
      tags: row.researchInterests ?? [],
    });
  }

  for (const row of equipmentRows) {
    const descParts = [
      cleanText(row.description),
      row.manufacturer ? `Manufacturer: ${row.manufacturer}` : "",
      row.model ? `Model: ${row.model}` : "",
      row.category ? `Category: ${row.category}` : "",
      row.location ? `Location: ${row.location}` : "",
      cleanText(row.specifications),
    ].filter(Boolean);
    results.push({
      id: row.id,
      type: "equipment",
      title: row.name,
      description: truncate(descParts.join(" | ")),
      href: `/equipment/${row.slug}`,
      category: row.category ?? undefined,
      tags: row.manufacturer ? [row.manufacturer] : [],
    });
  }

  for (const row of trainingRows) {
    const descParts = [
      cleanText(row.description),
      row.tags?.length ? cleanText(row.tags.join(", ")) : "",
      row.level ? `Level: ${row.level}` : "",
    ].filter(Boolean);
    results.push({
      id: row.id,
      type: "training",
      title: row.title,
      description: truncate(descParts.join(" | ")),
      href: `/training/${row.slug}`,
      category: row.level ?? undefined,
      tags: row.tags ?? [],
    });
  }

  for (const row of pageRows) {
    const descParts = [
      cleanText(row.subtitle),
      cleanText(row.content),
    ].filter(Boolean);
    results.push({
      id: row.id,
      type: "page",
      title: row.title,
      description: truncate(descParts.join(" | ")),
      href: `/${row.slug}`,
    });
  }

  for (const row of domainRows) {
    results.push({
      id: row.id,
      type: "research",
      title: row.name,
      description: truncate(cleanText(row.description)),
      href: `/research/${row.slug}`,
    });
  }

  for (const row of partnerRows) {
    const descParts = [
      cleanText(row.description),
      row.partnerType ? `Type: ${row.partnerType}` : "",
      row.country ? `Country: ${row.country}` : "",
    ].filter(Boolean);
    results.push({
      id: row.id,
      type: "partner",
      title: row.name,
      description: truncate(descParts.join(" | ")),
      href: `/partnership/${row.slug}`,
      category: row.partnerType ?? undefined,
    });
  }

  return results;
}
