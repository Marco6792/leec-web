import { requireAdmin } from "@/lib/auth/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createEquipment } from "../actions";
import {
  FormField,
  FieldGrid,
  inputClass,
  selectClass,
  textareaClass,
} from "../../_components/form-field";

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
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Register Equipment</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add a new piece of equipment to the lab inventory.
          </p>
        </div>
        <a
          href="/admin/equipment"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to equipment
        </a>
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

      <form action={createEquipment} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <FormField label="Equipment Name" name="name" required>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="e.g. Keithley 2400 SourceMeter"
                className={inputClass}
              />
            </FormField>

            <FieldGrid cols={2}>
              <FormField label="Category" name="category">
                <select id="category" name="category" defaultValue="instrument" className={selectClass}>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Status" name="status">
                <select id="status" name="status" defaultValue="operational" className={selectClass}>
                  {equipmentStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </FormField>
            </FieldGrid>

            <FormField label="Description" name="description" helpText="Optional. Describe the equipment and its purpose.">
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Key features and intended use..."
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
                <input id="manufacturer" name="manufacturer" type="text" placeholder="e.g. Keysight" className={inputClass} />
              </FormField>
              <FormField label="Model" name="model">
                <input id="model" name="model" type="text" placeholder="e.g. 34461A" className={inputClass} />
              </FormField>
            </FieldGrid>

            <FieldGrid cols={2}>
              <FormField label="Serial Number" name="serialNumber">
                <input id="serialNumber" name="serialNumber" type="text" placeholder="e.g. MY12345678" className={inputClass} />
              </FormField>
              <FormField label="Location" name="location">
                <input id="location" name="location" type="text" placeholder="e.g. Lab 201, Engineering Building" className={inputClass} />
              </FormField>
            </FieldGrid>

            <FormField label="Specifications" name="specifications" helpText="Key technical specifications.">
              <textarea
                id="specifications"
                name="specifications"
                rows={3}
                placeholder="e.g. 6.5 digit multimeter, 10 A max current..."
                className={textareaClass}
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
                <input id="acquiredDate" name="acquiredDate" type="date" className={inputClass} />
              </FormField>
              <FormField label="Value" name="value">
                <input id="value" name="value" type="text" inputMode="decimal" placeholder="e.g. 2500000" className={inputClass} />
              </FormField>
              <FormField label="Currency" name="currency">
                <select id="currency" name="currency" defaultValue="XAF" className={selectClass}>
                  {currencies.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </FormField>
            </FieldGrid>

            <FormField label="Image URL" name="imageUrl" helpText="URL to a photo of the equipment.">
              <input id="imageUrl" name="imageUrl" type="url" placeholder="https://..." className={inputClass} />
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
                defaultChecked
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
            Register Equipment
          </button>
        </div>
      </form>
    </div>
  );
}
