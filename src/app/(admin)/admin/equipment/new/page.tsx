import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "../../_components/submit-button";
import { requireAdmin } from "@/lib/auth/admin";
import { AdminBreadcrumbs } from "../../_components/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createEquipment } from "../actions";
import {
  FormField,
  FieldGrid,
} from "../../_components/form-field";
import { Input } from "@/components/ui/input";
import { SwitchField } from "../../_components/switch-field";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { MediaUpload } from "@/components/admin/media-upload";
import { PdfUpload } from "@/components/admin/pdf-upload";

export const dynamic = "force-dynamic";

const categories = [
  "instrument", "sensor", "computer", "network",
  "mechanical", "chemical", "safety", "office", "other",
] as const;

const equipmentStatuses = [
  "operational", "maintenance", "repair", "calibration", "retired",
] as const;

const currencies = ["XAF", "EUR", "USD", "GBP", "CNY"] as const;

export default async function NewEquipmentPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();

  const params = await searchParams;

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs
        items={[{ label: "Equipment", href: "/admin/equipment" }, { label: "Register Equipment" }]}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Register Equipment</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add a new piece of equipment to the lab inventory.
          </p>
        </div>
      </div>

      {/* Error banner */}
      {params.error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
          <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {params.error}
        </div>
      )}

      <form action={createEquipment} className="grid gap-6 lg:grid-cols-2">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <FormField label="Equipment Name" name="name" required>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="e.g. Keithley 2400 SourceMeter"
              />
            </FormField>

            <FieldGrid cols={2}>
              <FormField label="Category" name="category">
                <NativeSelect id="category" name="category" defaultValue="instrument" className="w-full">
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </NativeSelect>
              </FormField>

              <FormField label="Status" name="status">
                <NativeSelect id="status" name="status" defaultValue="operational" className="w-full">
                  {equipmentStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </NativeSelect>
              </FormField>
            </FieldGrid>

            <FormField label="Description" name="description" helpText="Optional. Describe the equipment and its purpose.">
              <Textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Key features and intended use..."
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
                <Input id="manufacturer" name="manufacturer" type="text" placeholder="e.g. Keysight" />
              </FormField>
              <FormField label="Model" name="model">
                <Input id="model" name="model" type="text" placeholder="e.g. 34461A" />
              </FormField>
            </FieldGrid>

            <FieldGrid cols={2}>
              <FormField label="Serial Number" name="serialNumber">
                <Input id="serialNumber" name="serialNumber" type="text" placeholder="e.g. MY12345678" />
              </FormField>
              <FormField label="Location" name="location">
                <Input id="location" name="location" type="text" placeholder="e.g. Lab 201, Engineering Building" />
              </FormField>
            </FieldGrid>

            <FormField label="Specifications" name="specifications" helpText="Key technical specifications.">
              <Textarea
                id="specifications"
                name="specifications"
                rows={3}
                placeholder="e.g. 6.5 digit multimeter, 10 A max current..."
              />
            </FormField>

            <FormField label="Usage / Applications" name="usage" helpText="How the equipment is used and how to request access. Shown on the public detail page.">
              <Textarea
                id="usage"
                name="usage"
                rows={4}
                placeholder="Primary use, typical procedure, access conditions..."
              />
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
                <Input id="acquiredDate" name="acquiredDate" type="date" />
              </FormField>
              <FormField label="Value" name="value">
                <Input id="value" name="value" type="text" inputMode="decimal" placeholder="e.g. 2500000" />
              </FormField>
              <FormField label="Currency" name="currency">
                <NativeSelect id="currency" name="currency" defaultValue="XAF" className="w-full">
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
                <MediaUpload endpoint="gallery" inputName="gallery" />
              </FormField>
              <FormField label="Datasheet PDF" name="pdfUrl" helpText="Uploaded via UploadThing with inline preview.">
                <PdfUpload inputName="pdfUrl" />
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
            />
            <SwitchField
              id="availableForTesting"
              name="availableForTesting"
              label="Available for external testing / collaboration"
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pb-8 lg:col-span-2">
          <Button render={<Link href="/admin/equipment" />} variant="outline">
            Cancel
          </Button>
          <SubmitButton pendingText="Saving…">Register Equipment</SubmitButton>
        </div>
      </form>
    </div>
  );
}
