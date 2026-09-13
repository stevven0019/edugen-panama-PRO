// Keep the complete reflection row, including all its cells and nested content.
// Restrict the cutoff to the six-stage planner table, not incidental mentions.
export function finishAoaPlanner(html) {
  const document = new DOMParser().parseFromString(html, 'text/html');
  const stageNumber = row => {
    const label = row.cells[0]?.textContent.replace(/\s+/g, ' ').trim() || '';
    return Number(label.match(/^(?:stage|etapa)\s*([1-6])\b/i)?.[1]);
  };
  const finalRow = [...document.querySelectorAll('tr')].find(row => {
    if (stageNumber(row) !== 6) return false;
    const table = row.closest('table');
    const stages = [...table.rows].map(stageNumber);
    return [1, 2, 3, 4, 5, 6].every(stage => stages.includes(stage));
  });
  if (!finalRow) return html;
  // Remove later rows, later sections of the table, and later document blocks,
  // while preserving the original containers and the entire Stage 6 row.
  let boundary = finalRow;
  while (boundary && boundary !== document.body) {
    while (boundary.nextSibling) boundary.nextSibling.remove();
    boundary = boundary.parentNode;
  }
  return document.body.innerHTML;
}
