"use client";

import { useRef } from "react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface RichTextEditorFieldProps {
  id: string;
  name: string;
  defaultValue: string;
  placeholder?: string;
}

export function RichTextEditorField({
  id,
  name,
  defaultValue,
  placeholder = "Start writing...",
}: RichTextEditorFieldProps) {
  const hiddenRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <RichTextEditor
        value={defaultValue}
        onChange={(html) => {
          if (hiddenRef.current) {
            hiddenRef.current.value = html;
          }
        }}
        placeholder={placeholder}
      />
      <input type="hidden" name={name} ref={hiddenRef} defaultValue={defaultValue} />
    </div>
  );
}
