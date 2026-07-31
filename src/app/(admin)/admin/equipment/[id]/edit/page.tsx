import { eq } from "drizzle-orm";
import { db } from "@/db";
import { equipment } from "@/db/schema";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateEquipment } from "../../actions";
import {
  FormField,
  FieldGrid,
  inputClass,
  selectClass,
  textareaClass,
} from "../../../_components/form-field";

export const dynamic = "force-dynamic";

const categories = [
  "instrument", "sensor", "computer", "network",
  "mechanical", "chemical", "safety", "office", "other",
] as const;

const equipmentStatuses = [
  "operational", "maintenance", "repair", "calibration", "retired",
] as const;

const currencies = ["XAF", "EUR", "USD", "GBP", "CNY"] as const;

export default async function EditEquipmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const sp = await searchParams;

  const [item] = await db
    .select()
    .from(equipment)
    .where(eq(equipment.id, id))
    .limit(1);

  if (!item) redirect("/admin/equipment?error=Equipment+not+found");

  const boundAction = updateEquipment.bind(null, id);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Equipment</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Editing: {item.name}
          </p>
        </div>
        <a
          href="/admin/equipment"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to equipment
        </a>
      </div>

      {/* Saved banner */}
      {sp.saved === "true" && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
          <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Equipment saved successfully.
        </div>
      )}

      {/* Error banner */}
      {sp.error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
          <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {sp.error}
        </div>
      )}

      <form action={boundAction} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Hidden slug field for editing */}
            <input type="hidden" name="slug" value={item.slug} />

            <FormField label="Equipment Name" name="name" required>
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={item.name}
                required
                className={inputClass}
              />
            </FormField>

            <FieldGrid cols={2}>
              <FormField label="Category" name="category">
                <select id="category" name="category" defaultValue={item.category ?? "instrument"} className={selectClass}>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Status" name="status">
                <select id="status" name="status" defaultValue={item.status ?? "operational"} className={selectClass}>
                  {equipmentStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </FormField>
            </FieldGrid>

            <FormField label="Description" name="description">
              <textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={item.description ?? ""}
                className={textareaClass}
              />
            </FormField>
          </CardContent>
        </Card>

        {/* Manufacturer & Model */}
        <Card>
          <CardHeader>
            <CardTitle>Manufacturer &amp; Model</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <FieldGrid cols={2}>
              <FormField label="Manufacturer" name="manufacturer">
                <input id="manufacturer" name="manufacturer" type="text" defaultValue={item.manufacturer ?? ""} className={inputClass} />
              </FormField>
              <FormField label="Model" name="model">
                <input id="model" name="model" type="text" defaultValue={item.model ?? ""} className={inputClass} />
              </FormField>
            </FieldGrid>

            <FieldGrid cols={2}>
              <FormField label="Serial Number" name="serialNumber">
                <input id="serialNumber" name="serialNumber" type="text" defaultValue={item.serialNumber ?? ""} className={inputClass} />
              </FormField>
              <FormField label="Location" name="location">
                <input id="location" name="location" type="text" defaultValue={item.location ?? ""} className={inputClass} />
              </FormField>
            </FieldGrid>

            <FormField label="Specifications" name="specifications">
              <textarea
                id="specifications"
                name="specifications"
                rows={3}
                defaultValue={item.specifications ?? ""}
                className={textareaClass}
              />
            </FormField>

            <FormField label="Usage / Applications" name="usage">
              <textarea
                id="usage"
                name="usage"
                rows={4}
                defaultValue={item.usage ?? ""}
                className={textareaClass}
              />
              <p className="text-xs text-muted-foreground mt-1">
                How the equipment is used and how to request access. Shown on the public detail page.
              </p>
            </FormField>
          </CardContent>
        </Card>

        {/* Acquisition & Value */}
        <Card>
          <CardHeader>
            <CardTitle>Acquisition &amp; Value</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <FieldGrid cols={3}>
              <FormField label="Acquired Date" name="acquiredDate">
                <input id="acquiredDate" name="acquiredDate" type="date" defaultValue={item.acquiredDate ?? ""} className={inputClass} />
              </FormField>
              <FormField label="Value" name="value">
                <input id="value" name="value" type="text" inputMode="decimal" defaultValue={item.value ?? ""} className={inputClass} />
              </FormField>
              <FormField label="Currency" name="currency">
                <select id="currency" name="currency" defaultValue={item.currency ?? "XAF"} className={selectClass}>
                  {currencies.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </FormField>
            </FieldGrid>

            <FormField label="Image URL" name="imageUrl">
              <input id="imageUrl" name="imageUrl" type="url" defaultValue={item.imageUrl ?? ""} className={inputClass} />
            </FormField>
          </CardContent>
        </Card>

        {/* Visibility & Availability */}
        <Card>
          <CardHeader>
            <CardTitle>Visibility &amp; Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                id="isPublic"
                name="isPublic"
                type="checkbox"
                defaultChecked={item.isPublic ?? false}
                className="size-4 rounded border-border accent-primary"
              />
              <label htmlFor="isPublic" className="text-sm">
                Visible on public website
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="availableForTesting"
                name="availableForTesting"
                type="checkbox"
                defaultChecked={item.availableForTesting ?? false}
                className="size-4 rounded border-border accent-primary"
              />
              <label htmlFor="availableForTesting" className="text-sm">
                Available for external testing / collaboration
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <a
            href="/admin/equipment"
            className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
          >
            Cancel
          </a>
          <button
            type="submit"
            className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
