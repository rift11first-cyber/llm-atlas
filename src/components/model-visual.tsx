import { cn } from "@/lib/utils";

const layers = [
  { label: "Embed", detail: "tokens" },
  { label: "Norm", detail: "residual" },
  { label: "Attention", detail: "context" },
  { label: "MLP", detail: "feed-forward" },
  { label: "Output", detail: "logits" },
];

const WIDTH = 240;
const DEPTH = 150;
const THICKNESS = 10;
const GAP = 44;

function project(u: number, v: number, z: number): [number, number] {
  return [
    280 + (u - WIDTH / 2) * 0.866 - (v - DEPTH / 2) * 0.866,
    300 + (u - WIDTH / 2) * 0.5 + (v - DEPTH / 2) * 0.5 - z,
  ];
}

function points(coords: [number, number][]) {
  return coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

function topFace(z: number) {
  return [
    project(0, 0, z),
    project(WIDTH, 0, z),
    project(WIDTH, DEPTH, z),
    project(0, DEPTH, z),
  ];
}

export function ModelVisual({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Isometric diagram of a decoder stack showing embedding, normalization, attention, MLP, and output layers."
      className={cn(
        "group relative flex min-h-[440px] w-full flex-col overflow-hidden rounded-2xl border border-border bg-[#030303] lg:min-h-[560px]",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
          Fig. 01 / Decoder stack
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/25">
          Isometric view
        </span>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-2 py-4 sm:px-6">
        <svg
          viewBox="0 0 560 470"
          className="h-auto max-h-[480px] w-full max-w-[560px] transition-transform duration-700 ease-out group-hover:-translate-y-1"
          aria-hidden
        >
          <g shapeRendering="geometricPrecision">
            {layers.map((layer, index) => {
              const z = index * GAP;
              const top = topFace(z);
              const p1 = project(WIDTH, 0, z);
              const p2 = project(WIDTH, DEPTH, z);
              const p3 = project(0, DEPTH, z);
              const p2d = project(WIDTH, DEPTH, z - THICKNESS);
              const p3d = project(0, DEPTH, z - THICKNESS);
              const p1d = project(WIDTH, 0, z - THICKNESS);
              const label = project(WIDTH, DEPTH, z);
              const highlighted = index === 2;

              return (
                <g key={layer.label}>
                  <polygon
                    points={points([p1, p2, p2d, p1d])}
                    fill="#050505"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth={0.8}
                    vectorEffect="non-scaling-stroke"
                  />
                  <polygon
                    points={points([p3, p2, p2d, p3d])}
                    fill="#090909"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth={0.8}
                    vectorEffect="non-scaling-stroke"
                  />
                  <polygon
                    points={points(top)}
                    fill={highlighted ? "#0e0e0e" : "#070707"}
                    stroke={
                      highlighted
                        ? "rgba(245,245,245,0.5)"
                        : "rgba(255,255,255,0.16)"
                    }
                    strokeWidth={highlighted ? 1.1 : 0.8}
                    vectorEffect="non-scaling-stroke"
                  />

                  <g clipPath={`url(#layer-${index})`}>
                    {Array.from({ length: 7 }).map((_, line) => {
                      const u = (WIDTH / 8) * (line + 1);
                      const a = project(u, 0, z);
                      const b = project(u, DEPTH, z);
                      return (
                        <line
                          key={`u-${line}`}
                          x1={a[0]}
                          y1={a[1]}
                          x2={b[0]}
                          y2={b[1]}
                          stroke="rgba(255,255,255,0.055)"
                          strokeWidth={0.7}
                          vectorEffect="non-scaling-stroke"
                        />
                      );
                    })}
                    {Array.from({ length: 7 }).map((_, line) => {
                      const v = (DEPTH / 8) * (line + 1);
                      const a = project(0, v, z);
                      const b = project(WIDTH, v, z);
                      return (
                        <line
                          key={`v-${line}`}
                          x1={a[0]}
                          y1={a[1]}
                          x2={b[0]}
                          y2={b[1]}
                          stroke="rgba(255,255,255,0.055)"
                          strokeWidth={0.7}
                          vectorEffect="non-scaling-stroke"
                        />
                      );
                    })}
                  </g>

                  <circle
                    cx={project(WIDTH / 2, DEPTH / 2, z)[0]}
                    cy={project(WIDTH / 2, DEPTH / 2, z)[1]}
                    r={highlighted ? 2.2 : 1.4}
                    fill={highlighted ? "#f5f5f5" : "#030303"}
                    stroke="rgba(255,255,255,0.45)"
                    strokeWidth={0.8}
                    vectorEffect="non-scaling-stroke"
                  />

                  <line
                    x1={label[0]}
                    y1={label[1]}
                    x2={label[0] + 8}
                    y2={label[1]}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth={0.8}
                    vectorEffect="non-scaling-stroke"
                  />
                  <text
                    x={label[0] + 14}
                    y={label[1] + 2.5}
                    fill={
                      highlighted
                        ? "rgba(245,245,245,0.9)"
                        : "rgba(255,255,255,0.42)"
                    }
                    fontSize="7"
                    letterSpacing="1.2"
                    fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                  >
                    {layer.label.toUpperCase()}
                  </text>

                  <clipPath id={`layer-${index}`}>
                    <polygon points={points(top)} />
                  </clipPath>
                </g>
              );
            })}

            <line
              x1={project(WIDTH / 2, DEPTH / 2, 0)[0]}
              y1={project(WIDTH / 2, DEPTH / 2, 0)[1]}
              x2={project(WIDTH / 2, DEPTH / 2, (layers.length - 1) * GAP)[0]}
              y2={project(WIDTH / 2, DEPTH / 2, (layers.length - 1) * GAP)[1]}
              stroke="rgba(255,255,255,0.14)"
              strokeWidth={0.8}
              strokeDasharray="2 5"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </svg>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-white/[0.08] px-4 py-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
          Embed → Normalize → Attend → Predict
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/25">
          N × layers
        </span>
      </div>
    </div>
  );
}
