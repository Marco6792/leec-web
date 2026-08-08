"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface RichTextEditorToolbarProps {
  editor: Editor | null;
}

export function RichTextEditorToolbar({ editor }: RichTextEditorToolbarProps) {
  if (!editor) return null;

  const tools = [
    {
      group: [
        {
          icon: Bold,
          label: "Bold",
          action: () => editor.chain().focus().toggleBold().run(),
          isActive: () => editor.isActive("bold"),
        },
        {
          icon: Italic,
          label: "Italic",
          action: () => editor.chain().focus().toggleItalic().run(),
          isActive: () => editor.isActive("italic"),
        },
        {
          icon: Underline,
          label: "Underline",
          action: () => editor.chain().focus().toggleUnderline().run(),
          isActive: () => editor.isActive("underline"),
        },
        {
          icon: Strikethrough,
          label: "Strikethrough",
          action: () => editor.chain().focus().toggleStrike().run(),
          isActive: () => editor.isActive("strike"),
        },
        {
          icon: Code,
          label: "Code",
          action: () => editor.chain().focus().toggleCode().run(),
          isActive: () => editor.isActive("code"),
        },
      ],
    },
    {
      group: [
        {
          icon: Heading1,
          label: "Heading 1",
          action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
          isActive: () => editor.isActive("heading", { level: 1 }),
        },
        {
          icon: Heading2,
          label: "Heading 2",
          action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: () => editor.isActive("heading", { level: 2 }),
        },
        {
          icon: Heading3,
          label: "Heading 3",
          action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
          isActive: () => editor.isActive("heading", { level: 3 }),
        },
      ],
    },
    {
      group: [
        {
          icon: List,
          label: "Bullet List",
          action: () => editor.chain().focus().toggleBulletList().run(),
          isActive: () => editor.isActive("bulletList"),
        },
        {
          icon: ListOrdered,
          label: "Ordered List",
          action: () => editor.chain().focus().toggleOrderedList().run(),
          isActive: () => editor.isActive("orderedList"),
        },
        {
          icon: Quote,
          label: "Blockquote",
          action: () => editor.chain().focus().toggleBlockquote().run(),
          isActive: () => editor.isActive("blockquote"),
        },
      ],
    },
    {
      group: [
        {
          icon: Undo,
          label: "Undo",
          action: () => editor.chain().focus().undo().run(),
          isActive: () => false,
        },
        {
          icon: Redo,
          label: "Redo",
          action: () => editor.chain().focus().redo().run(),
          isActive: () => false,
        },
      ],
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-input bg-muted/30 px-2 py-1.5">
      {tools.map((toolGroup, i) => (
        <div key={i} className="flex items-center gap-1">
          {i > 0 && <Separator orientation="vertical" className="h-5 mx-1" />}
          {toolGroup.group.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.label}
                type="button"
                onClick={tool.action}
                title={tool.label}
                className={cn(
                  "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  tool.isActive() && "bg-accent text-accent-foreground"
                )}
              >
                <Icon className="size-4" />
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
