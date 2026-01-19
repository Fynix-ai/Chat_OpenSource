/**
 * MarkdownRenderer Component
 * 
 * A comprehensive markdown renderer with:
 * - Syntax highlighting for code blocks
 * - Custom styling for all markdown elements
 * - Copy and download functionality for code blocks
 * - Responsive design
 * 
 * Uses react-markdown and react-syntax-highlighter
 */

import React, { useMemo, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Download } from 'lucide-react';
import { copyToClipboard, downloadFile } from '../../utils/helpers';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  theme?: 'light' | 'dark';
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
  theme = 'light',
}) => {
  // ============================================================================
  // Custom Components
  // ============================================================================

  const components = useMemo(
    () => ({
      // Code blocks with syntax highlighting
      code: ({ className, children }: { className?: string; children?: React.ReactNode }) => {
        const match = /language-(\w+)/.exec(className || '');
        const language = match ? match[1] : '';
        const codeString = String(children).replace(/\n$/, '');

        const handleCopy = useCallback(() => {
          copyToClipboard(codeString);
        }, [codeString]);

        const handleDownload = useCallback(() => {
          const extension = language || 'txt';
          downloadFile(codeString, `code.${extension}`, 'text/plain');
        }, [codeString, language]);

        // Inline code
        if (!match) {
          return (
            <code className="bg-bgStreamingThoughtsColor px-1.5 py-0.5 rounded text-sm font-mono">
              {children}
            </code>
          );
        }

        // Code block with syntax highlighting
        return (
          <div className="code-block my-4">
            <div className="flex items-center justify-between px-4 py-2 bg-bgStreamingThoughtsColor border-b border-borderDefault rounded-t-lg">
              <span className="text-xs font-medium text-textDefault">
                {language || 'Code'}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="p-1 hover:bg-hoverBackgroundColor rounded transition-colors"
                  title="Copy code"
                >
                  <Copy size={14} />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-1 hover:bg-hoverBackgroundColor rounded transition-colors"
                  title="Download code"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>
            <SyntaxHighlighter
              language={language}
              style={theme === 'dark' ? vscDarkPlus : prism}
              customStyle={{
                margin: 0,
                borderRadius: '0 0 0.5rem 0.5rem',
              }}
              className="rounded-b-lg"
            >
              {codeString}
            </SyntaxHighlighter>
          </div>
        );
      },

      // Headings
      h1: ({ children }: any) => (
        <h1 className="text-3xl font-bold my-4">{children}</h1>
      ),
      h2: ({ children }: any) => (
        <h2 className="text-2xl font-bold my-3">{children}</h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-xl font-semibold my-2">{children}</h3>
      ),

      // Paragraphs
      p: ({ children }: any) => (
        <p className="mb-2 text-sm leading-6">{children}</p>
      ),

      // Lists
      ul: ({ children }: any) => (
        <ul className="list-disc list-outside ml-4 mb-2">{children}</ul>
      ),
      ol: ({ children }: any) => (
        <ol className="list-decimal list-outside ml-6 mb-2">{children}</ol>
      ),
      li: ({ children }: any) => (
        <li className="mb-1 text-sm">{children}</li>
      ),

      // Links
      a: ({ href, children }: any) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline break-words"
        >
          {children}
        </a>
      ),

      // Tables
      table: ({ children }: any) => (
        <div className="overflow-x-auto my-4">
          <table className="border-collapse border border-borderDefault w-full text-sm">
            {children}
          </table>
        </div>
      ),
      th: ({ children }: any) => (
        <th className="border border-borderDefault px-4 py-2 bg-bgStreamingThoughtsColor text-left font-semibold">
          {children}
        </th>
      ),
      td: ({ children }: any) => (
        <td className="border border-borderDefault px-4 py-2">{children}</td>
      ),

      // Blockquotes
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-textPurple pl-4 my-2 italic text-textDimmedColor">
          {children}
        </blockquote>
      ),

      // Images
      img: ({ src, alt }: { src?: string; alt?: string }) => (
        <img
          src={src}
          alt={alt || 'Image'}
          className="max-w-full h-auto rounded-lg my-2"
        />
      ),
    }),
    [theme]
  );

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className={`markdown-renderer prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components as any}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

MarkdownRenderer.displayName = 'MarkdownRenderer';

export default MarkdownRenderer;
