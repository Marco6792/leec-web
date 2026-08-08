"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { cn } from "@/lib/utils";
import { RichTextEditorToolbar } from "./rich-text-editor-toolbar";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  className,
  placeholder = "Start writing...",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "min-h-[180px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "prose-content"
        ),
      },
    },
    immediatelyRender: false,
  });

  return (
    <div className={cn("rounded-md border", className)}>
      <RichTextEditorToolbar editor={editor} />
      <EditorContent editor={editor} />
      {!value && !editor?.getText() && (
        <p className="pointer-events-none absolute text-sm text-muted-foreground mt-2 ml-3">
          {placeholder}
        </p>
      )}
    </div>
  );
}
