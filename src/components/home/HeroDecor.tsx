import { cn } from "@/lib/utils";

const BLOCK_SIZE = 62;
const GAP = 8;

interface Cell {
  row: number;
  col: number;
  colSpan?: number;
}

// Mirrors the real reference site's shape-01.svg (top-left) cell layout
const TOP_LEFT_CELLS: Cell[] = [
  { row: 0, col: 0 },
  { row: 0, col: 2, colSpan: 2 },
  { row: 1, col: 1 },
  { row: 2, col: 0 },
];

// Mirrors the real reference site's shape-02.svg (bottom-right) cell layout
const BOTTOM_RIGHT_CELLS: Cell[] = [
  { row: 0, col: 2 },
  { row: 1, col: 1 },
  { row: 2, col: 0, colSpan: 2 },
  { row: 2, col: 2 },
];

function BlockCluster({
  cells,
  cols,
  rows,
  className,
}: {
  cells: Cell[];
  cols: number;
  rows: number;
  className?: string;
}) {
  return (
    <div
      className={cn("pointer-events-none absolute", className)}
      style={{
        gridTemplateColumns: `repeat(${cols}, ${BLOCK_SIZE}px)`,
        gridTemplateRows: `repeat(${rows}, ${BLOCK_SIZE}px)`,
        gap: GAP,
      }}
    >
      {cells.map(({ row, col, colSpan = 1 }) => (
        <span
          key={`${row}-${col}`}
          className="bg-cta"
          style={{
            gridRow: row + 1,
            gridColumn: `${col + 1} / span ${colSpan}`,
          }}
        />
      ))}
    </div>
  );
}

export function HeroCornerBlockTopLeft() {
  return (
    <BlockCluster
      cells={TOP_LEFT_CELLS}
      cols={4}
      rows={3}
      className="hero-corner-tl left-3 top-4 hidden sm:grid"
    />
  );
}

export function HeroCornerBlockBottomRight() {
  return (
    <BlockCluster
      cells={BOTTOM_RIGHT_CELLS}
      cols={3}
      rows={3}
      className="hero-corner-br bottom-4 right-3 hidden sm:grid"
    />
  );
}
