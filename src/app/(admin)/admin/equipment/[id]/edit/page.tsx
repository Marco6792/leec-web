import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { equipment } from "@/db/schema";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "../../../_components/submit-button";
import { updateEquipment } from "../../actions";
import {
  FormField,
  FieldGrid,
} from "../../../_components/form-field";
import { Input } from "@/components/ui/input";
import { SwitchField } from "../../../_components/switch-field";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { MediaUpload } from "@/components/admin/media-upload";
import { PdfUpload } from "@/components/admin/pdf-upload";
import { DeleteButton } from "../../../_components/delete-button";
import { AdminBreadcrumbs } from "../../../_components/breadcrumbs";
import { ViewPublicPage } from "../../../_components/view-public-page";
import { deleteEquipment } from "../../actions";

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
    <div className="space-y-6">
      <AdminBreadcrumbs
        items={[{ label: "Equipment", href: "/admin/equipment" }, { label: "Edit Equipment" }]}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Equipment</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Editing: {item.name}
          </p>
        </div>
        <ViewPublicPage href={`/equipment/${item.slug}`} />
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

      <form action={boundAction} className="grid gap-6 lg:grid-cols-2">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Hidden slug field for editing */}
            <input type="hidden" name="slug" value={item.slug} />

            <FormField label="Equipment Name" name="name" required>
              <Input
                id="name"
                name="name"
                type="text"
                defaultValue={item.name}
                required
              />
            </FormField>

            <FieldGrid cols={2}>
              <FormField label="Category" name="category">
                <NativeSelect id="category" name="category" defaultValue={item.category ?? "instrument"} className="w-full">
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </NativeSelect>
              </FormField>

              <FormField label="Status" name="status">
                <NativeSelect id="status" name="status" defaultValue={item.status ?? "operational"} className="w-full">
                  {equipmentStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </NativeSelect>
              </FormField>
            </FieldGrid>

            <FormField label="Description" name="description">
              <Textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={item.description ?? ""}
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
                <Input id="manufacturer" name="manufacturer" type="text" defaultValue={item.manufacturer ?? ""} />
              </FormField>
              <FormField label="Model" name="model">
                <Input id="model" name="model" type="text" defaultValue={item.model ?? ""} />
              </FormField>
            </FieldGrid>

            <FieldGrid cols={2}>
              <FormField label="Serial Number" name="serialNumber">
                <Input id="serialNumber" name="serialNumber" type="text" defaultValue={item.serialNumber ?? ""} />
              </FormField>
              <FormField label="Location" name="location">
                <Input id="location" name="location" type="text" defaultValue={item.location ?? ""} />
              </FormField>
            </FieldGrid>

            <FormField label="Specifications" name="specifications">
              <Textarea
                id="specifications"
                name="specifications"
                rows={3}
                defaultValue={item.specifications ?? ""}
              />
            </FormField>

            <FormField label="Usage / Applications" name="usage">
              <Textarea
                id="usage"
                name="usage"
                rows={4}
                defaultValue={item.usage ?? ""}
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
                <Input id="acquiredDate" name="acquiredDate" type="date" defaultValue={item.acquiredDate ?? ""} />
              </FormField>
              <FormField label="Value" name="value">
                <Input id="value" name="value" type="text" inputMode="decimal" defaultValue={item.value ?? ""} />
              </FormField>
              <FormField label="Currency" name="currency">
                <NativeSelect id="currency" name="currency" defaultValue={item.currency ?? "XAF"} className="w-full">
                  {currencies.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </NativeSelect>
              </FormField>
            </FieldGrid>

          </CardContent>
        </Card>

        {/* Photos & Documents — full width so uploads aren't cramped */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Photos &amp; Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGrid cols={2}>
              <FormField label="Equipment photos" name="gallery" helpText="Upload one or more images. The first image is used as the cover.">
                <MediaUpload
                  endpoint="gallery"
                  inputName="gallery"
                  value={item.gallery?.length ? item.gallery : item.imageUrl ? [item.imageUrl] : []}
                />
              </FormField>
              <FormField label="Datasheet PDF" name="pdfUrl" helpText="Uploaded via UploadThing with inline preview.">
                <PdfUpload inputName="pdfUrl" value={item.pdfUrl ?? ""} />
              </FormField>
            </FieldGrid>
          </CardContent>
        </Card>

        {/* Visibility & Availability */}
        <Card>
          <CardHeader>
            <CardTitle>Visibility &amp; Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SwitchField
              id="isPublic"
              name="isPublic"
              label="Visible on public website"
              defaultChecked={item.isPublic ?? false}
            />
            <SwitchField
              id="availableForTesting"
              name="availableForTesting"
              label="Available for external testing / collaboration"
              defaultChecked={item.availableForTesting ?? false}
            />
          </CardContent>
        </Card>

        {/* Submit */}
                <div className="flex items-center justify-end gap-3 pb-8 lg:col-span-2">
          <Button render={<Link href="/admin/equipment" />} variant="outline">
            Cancel
          </Button>
          <SubmitButton pendingText="Saving…">Save Changes</SubmitButton>
        </div>
      </form>

      {/* Delete (outside the main form to keep HTML valid) */}
      <div className="flex items-center justify-end gap-3 border-t border-border pt-6 pb-8">
        <DeleteButton action={deleteEquipment.bind(null, id)} label="Delete Equipment" />
      </div>
    </div>
  );
}
