"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle, FontSize } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, Minus, Plus } from "lucide-react";
import { useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

const FONT_SIZES = ["12px", "14px", "16px", "18px", "24px", "32px"];

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color, FontSize],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] rounded-md border px-3 py-2 text-sm focus:outline-none overflow-scroll h-full" +
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  function bumpFontSize(direction: 1 | -1) {
    const current = editor.getAttributes("textStyle").fontSize as
      | string
      | undefined;
    const index = current ? FONT_SIZES.indexOf(current) : 2; // default to 16px
    const nextIndex = Math.min(
      Math.max(index + direction, 0),
      FONT_SIZES.length - 1,
    );
    editor.chain().focus().setFontSize(FONT_SIZES[nextIndex]).run();
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 items-center">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          <List className="h-4 w-4" />
        </Toggle>

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => bumpFontSize(-1)}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => bumpFontSize(1)}
        >
          <Plus className="h-3 w-3" />
        </Button>

        <input
          type="color"
          className="h-7 w-7 rounded border cursor-pointer"
          onChange={(e) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
          value={editor.getAttributes("textStyle").color || "#000000"}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
