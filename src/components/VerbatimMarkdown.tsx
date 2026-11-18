import React from 'react';

interface VerbatimMarkdownProps {
  content: string;
  skipLeadingH1?: boolean;
}

/**
 * Renders inline markdown (**bold**, *italic*, [text](url), `code`)
 * strictly preserving every character of the source text.
 */
function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      nodes.push(
        <strong key={key++} className="font-semibold text-white">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      nodes.push(
        <em key={key++} className="italic text-neutral-200">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      nodes.push(
        <code key={key++} className="bg-neutral-800 px-1.5 py-0.5 text-xs text-[#d4af37]">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('[')) {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (linkMatch) {
        nodes.push(
          <a
            key={key++}
            href={linkMatch[2]}
            className="text-[#d4af37] underline underline-offset-4 hover:text-[#e5c158] transition-colors"
          >
            {linkMatch[1]}
          </a>
        );
      } else {
        nodes.push(token);
      }
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export function extractLeadingH1(content: string): { h1: string | null; body: string } {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  let firstNonEmpty = 0;
  while (firstNonEmpty < lines.length && lines[firstNonEmpty].trim() === '') {
    firstNonEmpty++;
  }
  if (firstNonEmpty < lines.length && lines[firstNonEmpty].startsWith('# ')) {
    const h1 = lines[firstNonEmpty].slice(2).trim();
    const body = lines.slice(firstNonEmpty + 1).join('\n').replace(/^\n+/, '');
    return { h1, body };
  }
  return { h1: null, body: content };
}

export const VerbatimMarkdown: React.FC<VerbatimMarkdownProps> = ({
  content,
  skipLeadingH1 = false,
}) => {
  const normalized = skipLeadingH1 ? extractLeadingH1(content).body : content;
  const lines = normalized.replace(/\r\n/g, '\n').split('\n');

  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Blank line
    if (trimmed === '') {
      i++;
      continue;
    }

    // Horizontal rule
    if (/^[-*_]{3,}$/.test(trimmed)) {
      elements.push(<hr key={key++} className="border-neutral-800 my-6" />);
      i++;
      continue;
    }

    // Headings
    if (trimmed.startsWith('#### ')) {
      elements.push(
        <h4 key={key++} className="text-base sm:text-lg font-semibold text-[#d4af37] mt-6 mb-2">
          {renderInline(trimmed.slice(5))}
        </h4>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="text-lg sm:text-xl font-bold text-neutral-100 mt-7 mb-3">
          {renderInline(trimmed.slice(4))}
        </h3>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2
          key={key++}
          className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-3 mt-10 mb-4 pt-6 border-t border-neutral-800/80 first:mt-0 first:pt-0 first:border-t-0"
        >
          <span className="w-1.5 h-6 bg-[#d4af37] inline-block shrink-0" />
          <span>{renderInline(trimmed.slice(3))}</span>
        </h2>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={key++} className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
          {renderInline(trimmed.slice(2))}
        </h1>
      );
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quoteLines.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <blockquote
          key={key++}
          className="border-l-2 border-[#d4af37] pl-4 py-1 my-4 text-neutral-300 italic"
        >
          {quoteLines.map((ql, idx) => (
            <p key={idx} className="text-sm sm:text-base leading-relaxed">
              {renderInline(ql)}
            </p>
          ))}
        </blockquote>
      );
      continue;
    }

    // Table
    if (
      trimmed.startsWith('|') &&
      i + 1 < lines.length &&
      /^\|[\s:-]+\|/.test(lines[i + 1].trim())
    ) {
      const parseRow = (rowLine: string) =>
        rowLine
          .trim()
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map((cell) => cell.trim());

      const headers = parseRow(trimmed);
      i += 2; // Skip header & separator
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(parseRow(lines[i]));
        i++;
      }

      elements.push(
        <div key={key++} className="overflow-x-auto my-6 border border-neutral-800">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-neutral-900 border-b border-neutral-800 text-white font-semibold">
                {headers.map((h, hIdx) => (
                  <th key={hIdx} className="p-3.5 sm:p-4">
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 bg-neutral-950/60">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-neutral-900/40 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className={`p-3.5 sm:p-4 ${
                        cIdx === 0 ? 'font-semibold text-[#d4af37]' : 'text-neutral-300'
                      }`}
                    >
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Unordered list
    if (/^[-*•]\s+/.test(trimmed)) {
      const items: { checked: boolean | null; text: string }[] = [];
      while (i < lines.length && /^[-*•]\s+/.test(lines[i].trim())) {
        const rawItem = lines[i].trim().replace(/^[-*•]\s+/, '');
        if (rawItem.startsWith('[ ] ')) {
          items.push({ checked: false, text: rawItem.slice(4) });
        } else if (rawItem.startsWith('[x] ') || rawItem.startsWith('[X] ')) {
          items.push({ checked: true, text: rawItem.slice(4) });
        } else {
          items.push({ checked: null, text: rawItem });
        }
        i++;
      }
      elements.push(
        <ul key={key++} className="space-y-2.5 my-4 pl-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-neutral-200">
              {item.checked === null ? (
                <span className="text-[#d4af37] font-bold mt-0.5">•</span>
              ) : (
                <span
                  aria-hidden="true"
                  className={`inline-flex items-center justify-center w-4 h-4 mt-1 shrink-0 border ${
                    item.checked
                      ? 'border-[#d4af37] bg-[#d4af37] text-neutral-950'
                      : 'border-neutral-600 bg-neutral-900'
                  } text-[10px] font-bold`}
                >
                  {item.checked ? '✓' : ''}
                </span>
              )}
              <span>{renderInline(item.text)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: { num: string; text: string }[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        const m = /^(\d+\.)\s+(.*)$/.exec(lines[i].trim());
        if (m) {
          items.push({ num: m[1], text: m[2] });
        }
        i++;
      }
      elements.push(
        <ol key={key++} className="space-y-2.5 my-4 pl-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-neutral-200">
              <span className="text-[#d4af37] font-bold shrink-0">{item.num}</span>
              <span>{renderInline(item.text)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Paragraph (collect consecutive non-special lines)
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^#{1,4}\s+/.test(lines[i].trim()) &&
      !/^[-*_]{3,}$/.test(lines[i].trim()) &&
      !/^[-*•]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith('> ') &&
      !lines[i].trim().startsWith('|')
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    elements.push(
      <p key={key++} className="text-sm sm:text-base leading-relaxed text-neutral-300 my-4">
        {paraLines.map((pl, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <br />}
            {renderInline(pl)}
          </React.Fragment>
        ))}
      </p>
    );
  }

  return <div className="verbatim-markdown-article">{elements}</div>;
};
