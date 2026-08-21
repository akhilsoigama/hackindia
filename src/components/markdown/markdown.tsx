// Updated and fixed MarkdownPreview component
'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useTheme } from '@/theme/AppThemeProvider';

interface CodeBlockProps {
  value: string;
  isDark: boolean;
}

interface MarkdownPreviewProps {
  content?: string;
  onTextExtracted?: (plainText: string) => void;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ value, isDark }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(value);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative my-4">
      <pre
        className={`rounded-lg p-4 overflow-x-auto ${
          isDark ? 'bg-slate-900 text-slate-100 border border-slate-700' : 'bg-slate-100 text-slate-900 border border-slate-200'
        }`}
      >
        <code>{value}</code>
      </pre>
      <button
        onClick={copyToClipboard}
        className={`absolute top-2 right-2 px-3 py-1 rounded text-sm transition-colors ${
          isDark ? 'bg-indigo-500 text-white hover:bg-indigo-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {isCopied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({
  content = '',
  onTextExtracted
}) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  useEffect(() => {
    if (content && onTextExtracted) {
      const extractCompleteText = (htmlText: string): string => {
        if (typeof document === 'undefined') return htmlText;
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const body = doc.body;
        
        let fullText = '';
        
        const extractNodeText = (node: ChildNode): void => {
          if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent && node.textContent.trim()) {
              fullText += node.textContent + ' ';
            }
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            
            if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
              return;
            }
            
            if (element.tagName === 'BR' || element.tagName === 'HR') {
              fullText += '\n';
            } else if (element.tagName === 'LI') {
              fullText += '• ';
            }
            
            node.childNodes.forEach(extractNodeText);
            
            if (element.tagName === 'P' || 
                element.tagName === 'DIV' || 
                element.tagName === 'H1' || 
                element.tagName === 'H2' || 
                element.tagName === 'H3' || 
                element.tagName === 'H4' || 
                element.tagName === 'H5' || 
                element.tagName === 'H6') {
              fullText += '\n';
            }
          }
        };
        
        body.childNodes.forEach(extractNodeText);
        
        fullText = fullText
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/\n+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        return fullText;
      };

      const cleanText = extractCompleteText(content);
      onTextExtracted(cleanText);
    }
  }, [content, onTextExtracted]);

  return (
    <div className={`prose prose-lg max-w-none ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeContent = String(children).replace(/\n$/, '');

            if (match) {
              return <CodeBlock value={codeContent} isDark={isDark} />;
            }

            return (
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${
                  isDark ? 'bg-slate-800 text-sky-300' : 'bg-slate-200 text-indigo-700'
                }`}
                {...props}
              >
                {children}
              </code>
            );
          },
          p({ children }) {
            return <p className={`mb-4 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{children}</p>;
          },
          h1({ children }) {
            return <h1 className={`text-3xl font-bold mb-4 mt-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>{children}</h1>;
          },
          h2({ children }) {
            return <h2 className={`text-2xl font-bold mb-3 mt-5 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{children}</h2>;
          },
          h3({ children }) {
            return <h3 className={`text-xl font-bold mb-2 mt-4 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{children}</h3>;
          },
          h4({ children }) {
            return <h4 className={`text-lg font-bold mb-2 mt-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{children}</h4>;
          },
          strong({ children }) {
            return <strong className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{children}</strong>;
          },
          em({ children }) {
            return <em className={`italic ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{children}</em>;
          },
          ul({ children }) {
            return <ul className={`list-disc pl-5 mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{children}</ul>;
          },
          ol({ children }) {
            return <ol className={`list-decimal pl-5 mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{children}</ol>;
          },
          li({ children }) {
            return <li className={`mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{children}</li>;
          },
          hr() {
            return <hr className={`my-6 ${isDark ? 'border-slate-700' : 'border-slate-300'}`} />;
          },
          blockquote({ children }) {
            return (
              <blockquote
                className={`border-l-4 pl-4 italic my-4 ${
                  isDark ? 'border-indigo-400 text-slate-300 bg-slate-900/40' : 'border-indigo-500 text-slate-700 bg-indigo-50/70'
                }`}
              >
                {children}
              </blockquote>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;