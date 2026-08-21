"use client";

import StarterKit from "@tiptap/starter-kit";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import { useEffect } from "react";
import { RHFTipTapMenuBar } from "../tip-tap-editor";
import { useTheme } from "@/theme/AppThemeProvider";

interface RHFTiptapEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: string;
  disabled?: boolean;
}

const RHFTiptapEditor: React.FC<RHFTiptapEditorProps> = ({
  onChange,
  value = "",
  height = "300px",
  disabled = false,
}) => {
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const editorSurfaceClass = [
    "rounded-xl",
    "h-[200px]",
    "scrollbar-hide",
    "overflow-auto",
    "px-6",
    "py-5",
    "focus:outline-none", // Removes outline
    "focus:border-transparent", // Removes border on focus
    "focus:ring-0", // Removes any ring/shadow effect
    "transition-colors",
    "duration-200",
    "text-sm",
    "leading-relaxed",
    isDark
      ? "bg-slate-950/70 text-slate-100 focus-visible:border-none border-slate-700 focus-visible:outline-none"
      : "bg-white text-slate-900 border border-slate-400 focus-visible:ring-slate-500/30",
    disabled ? "opacity-60 cursor-not-allowed" : "shadow-sm",
  ].join(" ");

  return (
    <div className="w-full">
      <style>{`
    .ProseMirror {
        border: 1px solid transparent;
        transition: border-color 0.2s ease;
    }

    .ProseMirror:focus,
    .ProseMirror-focused {
        outline: none !important;
        border: 1px solid #747678 !important;
        box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1) !important;
    }
`}</style>
      <EditorProvider
        extensions={[StarterKit]}
        content={value}
        editable={!disabled}
        onUpdate={({ editor }: { editor: Editor }) => {
          if (!disabled) {
            onChange?.(editor.getHTML());
          }
        }}
        editorProps={{
          attributes: {
            style: `min-height: ${height};`,
            class: editorSurfaceClass,
          },
        }}
        slotBefore={!disabled ? <RHFTipTapMenuBar /> : null}
        immediatelyRender={false}
      >
        <EditorContentUpdater content={value} />
      </EditorProvider>
    </div>
  );
};

interface EditorContentUpdaterProps {
  content: string;
}

const EditorContentUpdater: React.FC<EditorContentUpdaterProps> = ({
  content,
}) => {
  const { editor } = useCurrentEditor();

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  return null;
};

export default RHFTiptapEditor;
