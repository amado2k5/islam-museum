export function parsePerspectiveLine(line: string): { label: string; body: string } | null {
  const match = line.match(/^- \*\*(.+?)\*\*[^\S\r\n]*:\s*(.*)$/);
  return match ? { label: match[1], body: match[2] } : null;
}
