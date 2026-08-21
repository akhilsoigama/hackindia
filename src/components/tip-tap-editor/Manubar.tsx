import React from 'react';
import { useCurrentEditor } from '@tiptap/react';
import type { Level } from '@tiptap/extension-heading';
import { useTheme } from '@/theme/AppThemeProvider';

import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaCode,
  FaParagraph,
  FaHeading,
  FaListUl,
  FaListOl,
  FaUndo,
  FaRedo,
  FaQuoteLeft,
  FaCodeBranch,
  FaEraser,
} from 'react-icons/fa';

const getButtonClass = (
  isActive: boolean,
  isDisabled: boolean = false,
  isDark: boolean = false,
): string =>
  [
    'p-2.5',
    'rounded-lg',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-slate-500/40',
    isActive
      ? isDark
        ? 'bg-slate-500/20 text-slate-200 border border-slate-400/40'
        : 'bg-slate-500/15 text-slate-800 border border-slate-400/50'
      : isDark
        ? 'text-slate-200 hover:bg-slate-800 border border-transparent'
        : 'text-slate-700 hover:bg-slate-100 border border-transparent',
    isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:shadow-sm',
  ].join(' ');

 const RHFTipTapMenuBar: React.FC = () => {
  const { editor } = useCurrentEditor();
  const headingLevels: Level[] = [1, 2, 3];
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  if (!editor) {
    console.warn('TipTap MenuBar: Editor is not available');
    return null;
  }

  const handleClick = (callback: () => void) => {
    try {
      callback();
      // Force focus back to editor after button click
      editor.chain().focus().run();
    } catch (error) {
      console.error('MenuBar button error:', error);
    }
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-1 p-3  ${
        isDark
          ? 'border-slate-700 bg-slate-950/70'
          : 'border-slate-200 bg-slate-50'
      }`}
    >
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => handleClick(() => editor.chain().focus().toggleBold().run())}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={getButtonClass(editor.isActive('bold'), false, isDark)}
          aria-label="Bold"
          title="Bold (Ctrl+B)"
        >
          <FaBold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => handleClick(() => editor.chain().focus().toggleItalic().run())}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={getButtonClass(editor.isActive('italic'), false, isDark)}
          aria-label="Italic"
          title="Italic (Ctrl+I)"
        >
          <FaItalic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => handleClick(() => editor.chain().focus().toggleStrike().run())}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={getButtonClass(editor.isActive('strike'), false, isDark)}
          aria-label="Strikethrough"
          title="Strikethrough"
        >
          <FaStrikethrough className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => handleClick(() => editor.chain().focus().toggleCode().run())}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={getButtonClass(editor.isActive('code'), false, isDark)}
          aria-label="Inline Code"
          title="Inline Code"
        >
          <FaCode className="w-4 h-4" />
        </button>
      </div>

      <div className={`w-px h-6 mx-1 ${isDark ? 'bg-slate-950/70' : 'bg-slate-200'}`} />

      <div className="flex gap-1">
        {headingLevels.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => handleClick(() => editor.chain().focus().toggleHeading({ level }).run())}
            className={`${getButtonClass(
              editor.isActive('heading', { level }),
              false,
              isDark,
            )} flex items-center gap-1`}
            aria-label={`Heading ${level}`}
            title={`Heading ${level}`}
          >
            <FaHeading className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{level}</span>
          </button>
        ))}
      </div>

      <div className={`w-px h-6 mx-1 ${isDark ? 'bg-slate-950/70' : 'bg-slate-200'}`} />

      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => handleClick(() => editor.chain().focus().setParagraph().run())}
          className={getButtonClass(editor.isActive('paragraph'), false, isDark)}
          aria-label="Paragraph"
          title="Paragraph"
        >
          <FaParagraph className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => handleClick(() => editor.chain().focus().toggleBulletList().run())}
          className={getButtonClass(editor.isActive('bulletList'), false, isDark)}
          aria-label="Bullet List"
          title="Bullet List"
        >
          <FaListUl className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => handleClick(() => editor.chain().focus().toggleOrderedList().run())}
          className={getButtonClass(editor.isActive('orderedList'), false, isDark)}
          aria-label="Ordered List"
          title="Ordered List"
        >
          <FaListOl className="w-4 h-4" />
        </button>
      </div>

      <div className={`w-px h-6 mx-1 ${isDark ? 'bg-slate-950/70' : 'bg-slate-200'}`} />

      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => handleClick(() => editor.chain().focus().toggleBlockquote().run())}
          className={getButtonClass(editor.isActive('blockquote'), false, isDark)}
          aria-label="Blockquote"
          title="Blockquote"
        >
          <FaQuoteLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => handleClick(() => editor.chain().focus().toggleCodeBlock().run())}
          className={getButtonClass(editor.isActive('codeBlock'), false, isDark)}
          aria-label="Code Block"
          title="Code Block"
        >
          <FaCodeBranch className="w-4 h-4" />
        </button>
      </div>

      <div className={`w-px h-6 mx-1 ${isDark ? 'bg-slate-950/70' : 'bg-slate-200'}`} />

      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => handleClick(() => editor.chain().focus().clearNodes().unsetAllMarks().run())}
          className={getButtonClass(false, false, isDark)}
          aria-label="Clear Formatting"
          title="Clear Formatting"
        >
          <FaEraser className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => handleClick(() => editor.chain().focus().undo().run())}
          disabled={!editor.can().chain().focus().undo().run()}
          className={getButtonClass(false, !editor.can().undo(), isDark)}
          aria-label="Undo"
          title="Undo (Ctrl+Z)"
        >
          <FaUndo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => handleClick(() => editor.chain().focus().redo().run())}
          disabled={!editor.can().chain().focus().redo().run()}
          className={getButtonClass(false, !editor.can().redo(), isDark)}
          aria-label="Redo"
          title="Redo (Ctrl+Y)"
        >
          <FaRedo className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
export default RHFTipTapMenuBar;