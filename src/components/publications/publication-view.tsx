"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { SiteImage } from "@/components/site-image";
import { DocumentPreview, isPdfUrl } from "@/components/document-preview";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ExternalLink,
  BookOpen,
  FileText,
  Download,
  Mic,
  GraduationCap,
  Newspaper,
  Rocket,
  Users,
  Calendar,
  Tag,
  BarChart3,
  Lock,
  Unlock,
  ThumbsUp,
  MessageSquare,
  Star,
  Bookmark,
  Share2,
  ChevronDown,
  ChevronUp,
  Send,
  Eye,
  Maximize2,
  Check,
} from "lucide-react";

export interface Author {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  title: string | null;
  corresponding: boolean;
  authorOrder: number;
  affiliation: string | null;
}

export interface PublicationData {
  id: string;
  type: string;
  title: string;
  abstract: string | null;
  year: number;
  doi: string | null;
  journal: string | null;
  conference: string | null;
  publisher: string[];
  volume: string | null;
  issue: string | null;
  pages: string | null;
  patentNumber: string | null;
  citationCount: number | null;
  altmetricScore: number | null;
  pdfUrl: string | null;
  imageUrl: string | null;
  gallery: string[];
  documents: string[];
  sourceDataUrl: string | null;
  codeUrl: string | null;
  keywords: string[];
  researchDomains: string[];
  openAccess: boolean | null;
  issn: string | null;
  createdAt: string;
  authors: Author[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; fullName: string; avatarUrl: string | null };
}

export interface Review {
  id: string;
  title: string | null;
  content: string;
  rating: number;
  pros: string | null;
  cons: string | null;
  createdAt: string;
  user: { id: string; fullName: string; avatarUrl: string | null };
}

const typeConfig: Record<
  string,
  { icon: typeof BookOpen; color: string; label: string }
> = {
  journal: {
    icon: BookOpen,
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    label: "Journal Article",
  },
  conference: {
    icon: Mic,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    label: "Conference Paper",
  },
  preprint: {
    icon: FileText,
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    label: "Preprint",
  },
  thesis: {
    icon: GraduationCap,
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    label: "Thesis",
  },
  report: {
    icon: Newspaper,
    color:
      "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300",
    label: "Report",
  },
  book: {
    icon: BookOpen,
    color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
    label: "Book",
  },
  chapter: {
    icon: FileText,
    color:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    label: "Book Chapter",
  },
  patent: {
    icon: Rocket,
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
    label: "Patent",
  },
  software: {
    icon: Rocket,
    color:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
    label: "Software",
  },
  dataset: {
    icon: FileText,
    color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
    label: "Dataset",
  },
};

function StarRating({
  rating,
  onRate,
  readonly = false,
}: {
  rating: number;
  onRate?: (r: number) => void;
  readonly?: boolean;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={`${
            readonly ? "cursor-default" : "cursor-pointer"
          } transition-colors`}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          onClick={() => !readonly && onRate?.(star)}
        >
          <Star
            className={`h-5 w-5 ${
              star <= (hover || rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

/**
 * Shown to visitors who are not signed in, so they know they can join the
 * discussion — with direct links back to this page after login/register.
 */
function AuthPrompt({ message }: { message: string }) {
  const pathname = usePathname();
  const redirectTo = encodeURIComponent(pathname);

  return (
    <div className="rounded-2xl border border-dashed bg-muted/30 p-6 text-center">
      <p className="text-sm text-muted-foreground mb-4">{message}</p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Link href={`/login?redirect=${redirectTo}`}>
          <Button size="sm" className="gap-1.5">
            <Lock className="size-3.5" /> Sign in
          </Button>
        </Link>
        <Link href={`/signup?redirect=${redirectTo}`}>
          <Button size="sm" variant="outline" className="gap-1.5">
            Create an account
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function PublicationView({
  publication,
  initialLikes = 0,
  initialComments = [],
  initialReviews = [],
  initialAvgRating = 0,
  initialTotalRatings = 0,
  isLiked = false,
  currentUserId = null,
}: {
  publication: PublicationData;
  initialLikes?: number;
  initialComments?: Comment[];
  initialReviews?: Review[];
  initialAvgRating?: number;
  initialTotalRatings?: number;
  isLiked?: boolean;
  currentUserId?: string | null;
}) {
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [reviews, setReviews] = useState(initialReviews);
  const [avgRating, setAvgRating] = useState(initialAvgRating);
  const [totalRatings, setTotalRatings] = useState(initialTotalRatings);
  const [userRating, setUserRating] = useState(0);
  // Open by default so visitors can see they can review & comment.
  const [showComments, setShowComments] = useState(true);
  const [showReviews, setShowReviews] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [newReview, setNewReview] = useState({
    title: "",
    content: "",
    rating: 3,
    pros: "",
    cons: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  /**
   * Guests get routed to the login page (with a way back to this page via
   * `?redirect=`) instead of a silent no-op.
   */
  function requireAuth(): boolean {
    if (currentUserId) return true;
    router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    return false;
  }

  const config = typeConfig[publication.type] || typeConfig.journal;
  const TypeIcon = config.icon;
  const venue =
    publication.journal ||
    publication.conference ||
    ((publication.publisher ?? []).length > 0 ? publication.publisher![0] : "");

  async function handleLike() {
    if (!requireAuth()) return;
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    await fetch(`/api/v1/publications/${publication.id}/like`, {
      method: liked ? "DELETE" : "POST",
    });
  }

  async function handleComment() {
    if (!newComment.trim()) return;
    if (!requireAuth()) return;
    setSubmitting(true);
    const res = await fetch(`/api/v1/publications/${publication.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newComment }),
    });
    if (res.ok) {
      const data = await res.json();
      setComments([data, ...comments]);
      setNewComment("");
    }
    setSubmitting(false);
  }

  async function handleRate(rating: number) {
    if (!requireAuth()) return;
    setUserRating(rating);
    await fetch(`/api/v1/publications/${publication.id}/rating`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating }),
    });
  }

  async function handleShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: publication.title, url });
        return;
      }
    } catch {
      // User dismissed the share sheet — fall through to clipboard.
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleReview() {
    if (!newReview.content.trim()) return;
    if (!requireAuth()) return;
    setSubmitting(true);
    const res = await fetch(`/api/v1/publications/${publication.id}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReview),
    });
    if (res.ok) {
      const data = await res.json();
      setReviews([data, ...reviews]);
      setNewReview({ title: "", content: "", rating: 3, pros: "", cons: "" });
    }
    setSubmitting(false);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* ─── Main Content ──────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Cover image */}
          {publication.imageUrl && (
            <div className="relative rounded-2xl overflow-hidden border aspect-video">
              <SiteImage
                src={publication.imageUrl}
                alt={publication.title}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>
          )}

          {/* Gallery */}
          {(publication.gallery?.length ?? 0) > 1 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Gallery
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(publication.gallery ?? []).map((url, i) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-video overflow-hidden rounded-xl border"
                  >
                    <SiteImage
                      src={url}
                      alt={`${publication.title} — image ${i + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge
                variant="secondary"
                className={`${config.color} gap-1.5 px-3 py-1 text-xs font-medium`}
              >
                <TypeIcon className="h-3 w-3" />
                {config.label}
              </Badge>
              {publication.openAccess && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <Unlock className="h-3 w-3" /> Open Access
                </Badge>
              )}
              {!publication.openAccess && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <Lock className="h-3 w-3" /> Restricted
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug mb-4">
              {publication.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {publication.year}
              </span>
              {venue && <span className="italic">{venue}</span>}
              {publication.volume && <span>Vol. {publication.volume}</span>}
              {publication.issue && <span>Issue {publication.issue}</span>}
              {publication.pages && <span>pp. {publication.pages}</span>}
            </div>
          </div>

          <Separator />

          {/* Authors */}
          {publication.authors.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Authors
              </h3>
              <div className="flex flex-wrap gap-4">
                {publication.authors
                  .sort((a, b) => a.authorOrder - b.authorOrder)
                  .map((author) => {
                    const initials = author.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();
                    return (
                      <Link
                        key={author.id}
                        href={`/profile/${author.id}`}
                        className="group/av flex items-center gap-3 p-3 rounded-xl border hover:shadow-md transition-all duration-200"
                      >
                        <div className="relative">
                          <div className="relative size-12 rounded-full overflow-hidden border-2 border-background bg-muted">
                            {author.avatarUrl ? (
                              <SiteImage
                                src={author.avatarUrl}
                                alt={author.fullName}
                                fill
                                sizes="48px"
                              />
                            ) : (
                              <div className="size-full flex items-center justify-center text-sm font-bold text-muted-foreground">
                                {initials}
                              </div>
                            )}
                          </div>
                          {author.corresponding && (
                            <span className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-primary flex items-center justify-center">
                              <span className="size-2 rounded-full bg-primary-foreground" />
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold group-hover/av:text-primary transition-colors">
                            {author.fullName}
                          </p>
                          {author.title && (
                            <p className="text-xs text-muted-foreground">
                              {author.title}
                            </p>
                          )}
                          {author.affiliation && (
                            <p className="text-xs text-muted-foreground italic">
                              {author.affiliation}
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
              </div>
            </div>
          )}

          <Separator />

          {/* Abstract */}
          {publication.abstract && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Abstract
              </h3>
              <div
                className="text-sm leading-relaxed text-muted-foreground prose-content"
                dangerouslySetInnerHTML={{ __html: publication.abstract }}
              />
            </div>
          )}

          {/* Keywords */}
          {publication.keywords.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {publication.keywords.map((kw) => (
                  <Badge key={kw} variant="secondary" className="text-xs">
                    {kw}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* PDF Viewer */}
          {publication.pdfUrl && (
            <div className="rounded-2xl border overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center gap-3 p-4 bg-muted/50 border-b">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="size-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">Full Paper</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {publication.pdfUrl.split("/").pop()}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={publication.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-muted transition-colors"
                  >
                    <Maximize2 className="size-3.5" /> Open in New Tab
                  </a>
                  <a
                    href={publication.pdfUrl}
                    download
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-2 text-xs font-semibold hover:bg-primary/90 transition-colors"
                  >
                    <Download className="size-3.5" /> Download PDF
                  </a>
                </div>
              </div>

              {/* Embedded PDF */}
              <div className="bg-muted/20">
                <iframe
                  src={publication.pdfUrl}
                  title={`${publication.title} — Full paper`}
                  className="w-full h-[520px] sm:h-[640px] border-0 bg-white"
                />
              </div>
            </div>
          )}

          {/* Other Links */}
          {(publication.doi ||
            publication.codeUrl ||
            (publication.sourceDataUrl && !isPdfUrl(publication.sourceDataUrl))) && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Resources
              </h3>
              <div className="flex flex-wrap gap-2">
                {publication.doi && (
                  <a
                    href={`https://doi.org/${publication.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm hover:bg-muted transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" /> DOI
                  </a>
                )}
                {publication.codeUrl && (
                  <a
                    href={publication.codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm hover:bg-muted transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" /> Source Code
                  </a>
                )}
                {publication.sourceDataUrl && !isPdfUrl(publication.sourceDataUrl) && (
                  <a
                    href={publication.sourceDataUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm hover:bg-muted transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" /> Dataset
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Documents & Attachments — inline PDF previews + file cards */}
          {(publication.documents?.length ?? 0) > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Documents &amp; Attachments
              </h3>
              <div className="space-y-4">
                {(publication.sourceDataUrl && isPdfUrl(publication.sourceDataUrl)
                  ? [publication.sourceDataUrl]
                  : []
                )
                  .filter((doc) => !(publication.documents ?? []).includes(doc))
                  .map((doc) => (
                    <DocumentPreview key={doc} url={doc} title="Dataset" />
                  ))}
                {(publication.documents ?? [])
                  .filter((doc) => doc !== publication.pdfUrl)
                  .map((doc) => (
                    <DocumentPreview key={doc} url={doc} />
                  ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Comments Section */}
          <div>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors w-full"
            >
              <MessageSquare className="h-4 w-4" />
              Comments ({comments.length})
              {showComments ? (
                <ChevronUp className="h-4 w-4 ml-auto" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-auto" />
              )}
            </button>
            {showComments && (
              <div className="mt-4 space-y-4">
                {currentUserId ? (
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleComment()}
                      placeholder="Add a comment..."
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={handleComment}
                      disabled={submitting || !newComment.trim()}
                      className="gap-1"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <AuthPrompt message="Sign in to join the discussion and leave a comment." />
                )}
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic py-4 text-center">
                    No comments yet. Be the first to comment.
                  </p>
                ) : (
                  comments.map((comment) => {
                    const user = comment.user;
                    const ci =
                      user?.fullName
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() ?? "??";
                    return (
                      <div
                        key={comment.id}
                        className="flex gap-3 p-4 rounded-xl border"
                      >
                        <div className="relative size-9 rounded-full overflow-hidden bg-muted shrink-0">
                          {user?.avatarUrl ? (
                            <SiteImage
                              src={user.avatarUrl}
                              alt={user.fullName}
                              fill
                              sizes="36px"
                            />
                          ) : (
                            <div className="size-full flex items-center justify-center text-xs font-bold text-muted-foreground">
                              {ci}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {user?.id ? (
                              <Link
                                href={`/profile/${user.id}`}
                                className="text-sm font-semibold hover:text-primary transition-colors"
                              >
                                {user.fullName}
                              </Link>
                            ) : (
                              <span className="text-sm font-semibold">
                                Unknown
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Reviews Section */}
          <div>
            <button
              onClick={() => setShowReviews(!showReviews)}
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors w-full"
            >
              <Star className="h-4 w-4" />
              Reviews ({reviews.length})
              {showReviews ? (
                <ChevronUp className="h-4 w-4 ml-auto" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-auto" />
              )}
            </button>
            {showReviews && (
              <div className="mt-4 space-y-4">
                {currentUserId ? (
                  <Card className="bg-muted/30">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">
                          Your rating:
                        </span>
                        <StarRating rating={userRating} onRate={handleRate} />
                      </div>
                      <Input
                        type="text"
                        value={newReview.title}
                        onChange={(e) =>
                          setNewReview({ ...newReview, title: e.target.value })
                        }
                        placeholder="Review title (optional)"
                      />
                      <Textarea
                        value={newReview.content}
                        onChange={(e) =>
                          setNewReview({
                            ...newReview,
                            content: e.target.value,
                          })
                        }
                        placeholder="Write your review..."
                        rows={3}
                        className="resize-none"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          type="text"
                          value={newReview.pros}
                          onChange={(e) =>
                            setNewReview({ ...newReview, pros: e.target.value })
                          }
                          placeholder="Pros"
                        />
                        <Input
                          type="text"
                          value={newReview.cons}
                          onChange={(e) =>
                            setNewReview({ ...newReview, cons: e.target.value })
                          }
                          placeholder="Cons"
                        />
                      </div>
                      <Button
                        size="sm"
                        onClick={handleReview}
                        disabled={submitting || !newReview.content.trim()}
                        className="gap-1"
                      >
                        Submit Review
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <AuthPrompt message="Share your experience — sign in to rate and review this publication." />
                )}
                {reviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic py-4 text-center">
                    No reviews yet. Be the first to review.
                  </p>
                ) : (
                  reviews.map((review) => {
                    const user = review.user;
                    const ri =
                      user?.fullName
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() ?? "??";
                    return (
                      <Card key={review.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="relative size-9 rounded-full overflow-hidden bg-muted shrink-0">
                              {user?.avatarUrl ? (
                                <SiteImage
                                  src={user.avatarUrl}
                                  alt={user.fullName}
                                  fill
                                  sizes="36px"
                                />
                              ) : (
                                <div className="size-full flex items-center justify-center text-xs font-bold text-muted-foreground">
                                  {ri}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                {user?.id ? (
                                  <Link
                                    href={`/profile/${user.id}`}
                                    className="text-sm font-semibold hover:text-primary transition-colors"
                                  >
                                    {user.fullName}
                                  </Link>
                                ) : (
                                  <span className="text-sm font-semibold">
                                    Unknown
                                  </span>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <StarRating rating={review.rating} readonly />
                            </div>
                          </div>
                          {review.title && (
                            <h4 className="font-semibold text-sm mb-1">
                              {review.title}
                            </h4>
                          )}
                          <p className="text-sm text-muted-foreground mb-2">
                            {review.content}
                          </p>
                          {(review.pros || review.cons) && (
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              {review.pros && (
                                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/10">
                                  <span className="font-medium text-emerald-700 dark:text-emerald-300">
                                    Pros:
                                  </span>{" "}
                                  <span className="text-muted-foreground">
                                    {review.pros}
                                  </span>
                                </div>
                              )}
                              {review.cons && (
                                <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-900/10">
                                  <span className="font-medium text-rose-700 dark:text-rose-300">
                                    Cons:
                                  </span>{" "}
                                  <span className="text-muted-foreground">
                                    {review.cons}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* ─── Sidebar ──────────────────────────────────────────── */}
        <div className="lg:w-80 shrink-0 space-y-6">
          {/* Stats Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <div className="text-2xl font-bold">
                    {publication.citationCount ?? 0}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Citations
                  </div>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <div className="text-2xl font-bold">{likes}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Likes
                  </div>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <div className="text-2xl font-bold">{totalRatings}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Ratings
                  </div>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <div className="text-2xl font-bold">{reviews.length}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Reviews
                  </div>
                </div>
              </div>
              {totalRatings > 0 && (
                <div className="flex items-center justify-center gap-2 py-2">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="text-lg font-bold">
                    {avgRating.toFixed(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">/ 5.0</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Button
                variant={liked ? "default" : "outline"}
                className="w-full gap-2"
                onClick={handleLike}
              >
                <ThumbsUp
                  className={`h-4 w-4 ${liked ? "fill-current" : ""}`}
                />
                {liked ? "Liked" : "Recommend"}
              </Button>
              <Button
                variant={saved ? "default" : "outline"}
                className="w-full gap-2"
                onClick={() => {
                  if (!requireAuth()) return;
                  setSaved(!saved);
                }}
              >
                <Bookmark
                  className={`h-4 w-4 ${saved ? "fill-current" : ""}`}
                />
                {saved ? "Saved" : "Save to List"}
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handleShare}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
                {copied ? "Link copied" : "Share"}
              </Button>
              {publication.pdfUrl && (
                <a
                  href={publication.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold px-2.5 py-2.5 transition-colors shadow-sm"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M12 18v-6m-3 3l3 3 3-3" />
                  </svg>
                  Download PDF
                </a>
              )}
            </CardContent>
          </Card>

          {/* Publication Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {publication.doi && (
                <div>
                  <span className="text-muted-foreground">DOI</span>
                  <a
                    href={`https://doi.org/${publication.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-primary hover:underline break-all"
                  >
                    {publication.doi}
                  </a>
                </div>
              )}
              {(publication.publisher ?? []).length > 0 && (
                <div>
                  <span className="text-muted-foreground">
                    Publisher
                    {(publication.publisher ?? []).length > 1 ? "s" : ""}
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {(publication.publisher ?? []).map((pub) => (
                      <span key={pub} className="font-medium text-sm">
                        {pub}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {publication.issn && (
                <div>
                  <span className="text-muted-foreground">ISSN</span>
                  <p className="font-medium">{publication.issn}</p>
                </div>
              )}
              {publication.patentNumber && (
                <div>
                  <span className="text-muted-foreground">Patent Number</span>
                  <p className="font-medium">{publication.patentNumber}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Link href="/publications">
            <Button variant="outline" size="sm" className="w-full gap-2">
              ← All Publications
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
