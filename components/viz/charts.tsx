import { cn } from "@/lib/utils";

export type ChartPoint = {
  label: string;
  value: number;
};

function niceMax(value: number) {
  if (value <= 0) return 1;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const normalized = value / magnitude;
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return nice * magnitude;
}

function linePath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) return "";
  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(" ");
}

export function AreaChart(props: {
  data: ChartPoint[];
  color?: string;
  fill?: string;
  height?: number;
  valueFormatter?: (value: number) => string;
  className?: string;
}) {
  const width = 640;
  const height = props.height ?? 168;
  const pad = { top: 16, right: 12, bottom: 28, left: 40 };
  const color = props.color ?? "#1C1917";
  const fill = props.fill ?? "rgba(28, 25, 23, 0.08)";
  const values = props.data.map((point) => point.value);
  const max = niceMax(Math.max(...values, 0));
  const innerWidth = width - pad.left - pad.right;
  const innerHeight = height - pad.top - pad.bottom;
  const coords = props.data.map((point, index) => {
    const x =
      pad.left +
      (props.data.length <= 1 ? innerWidth / 2 : (index / (props.data.length - 1)) * innerWidth);
    const y = pad.top + innerHeight - (point.value / max) * innerHeight;
    return { x, y, ...point };
  });
  const line = linePath(coords);
  const area =
    coords.length === 0
      ? ""
      : `${line} L ${coords[coords.length - 1].x.toFixed(2)} ${pad.top + innerHeight} L ${coords[0].x.toFixed(2)} ${pad.top + innerHeight} Z`;
  const ticks = [0, 0.5, 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("h-full w-full overflow-visible", props.className)}
      role="img"
      aria-label="Trend chart"
    >
      {ticks.map((tick) => {
        const y = pad.top + innerHeight - tick * innerHeight;
        return (
          <g key={tick}>
            <line
              x1={pad.left}
              x2={width - pad.right}
              y1={y}
              y2={y}
              stroke="#E8E0D4"
              strokeWidth="1"
            />
            <text
              x={pad.left - 8}
              y={y + 3}
              textAnchor="end"
              className="fill-ink-subtle"
              fontSize="10"
            >
              {props.valueFormatter ? props.valueFormatter(max * tick) : Math.round(max * tick)}
            </text>
          </g>
        );
      })}
      {area && <path d={area} fill={fill} />}
      {line && (
        <path d={line} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      )}
      {coords.map((point) => (
        <circle key={`${point.label}-${point.x}`} cx={point.x} cy={point.y} r="2.75" fill={color} />
      ))}
      {coords.map((point, index) => (
        <text
          key={`label-${point.label}`}
          x={point.x}
          y={height - 8}
          textAnchor={index === 0 ? "start" : index === coords.length - 1 ? "end" : "middle"}
          className="fill-ink-subtle"
          fontSize="10"
        >
          {point.label}
        </text>
      ))}
    </svg>
  );
}

export function BarChart(props: {
  data: ChartPoint[];
  color?: string;
  height?: number;
  className?: string;
}) {
  const width = 640;
  const height = props.height ?? 168;
  const pad = { top: 12, right: 8, bottom: 28, left: 8 };
  const color = props.color ?? "#5B7C99";
  const max = niceMax(Math.max(...props.data.map((point) => point.value), 0));
  const innerWidth = width - pad.left - pad.right;
  const innerHeight = height - pad.top - pad.bottom;
  const gap = 10;
  const barWidth = props.data.length
    ? Math.max(8, (innerWidth - gap * (props.data.length - 1)) / props.data.length)
    : 0;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("h-full w-full", props.className)}
      role="img"
      aria-label="Comparison chart"
    >
      <line
        x1={pad.left}
        x2={width - pad.right}
        y1={pad.top + innerHeight}
        y2={pad.top + innerHeight}
        stroke="#E8E0D4"
        strokeWidth="1"
      />
      {props.data.map((point, index) => {
        const barHeight = (point.value / max) * innerHeight;
        const x = pad.left + index * (barWidth + gap);
        const y = pad.top + innerHeight - barHeight;
        return (
          <g key={point.label}>
            <rect x={x} y={y} width={barWidth} height={Math.max(barHeight, 2)} rx="4" fill={color} opacity={0.88} />
            <text
              x={x + barWidth / 2}
              y={height - 8}
              textAnchor="middle"
              className="fill-ink-subtle"
              fontSize="10"
            >
              {point.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export type DonutSlice = ChartPoint & { color: string };

function polar(cx: number, cy: number, radius: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad)
  };
}

function donutArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number) {
  const start = polar(cx, cy, radius, endAngle);
  const end = polar(cx, cy, radius, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export function DonutChart(props: {
  data: DonutSlice[];
  className?: string;
  strokeWidth?: number;
}) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const strokeWidth = props.strokeWidth ?? 28;
  const radius = (size - strokeWidth) / 2 - 4;
  const total = props.data.reduce((sum, slice) => sum + slice.value, 0);

  let angle = 0;
  const arcs =
    total <= 0
      ? []
      : props.data.map((slice) => {
          const sweep = (slice.value / total) * 360;
          const start = angle;
          const end = angle + Math.max(sweep, 0.8);
          angle += sweep;
          return {
            ...slice,
            d: donutArc(cx, cy, radius, start, Math.min(end, start + 359.9))
          };
        });

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={cn("h-full w-full", props.className)}
      role="img"
      aria-label="Spend mix chart"
    >
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="#EFE8DC"
        strokeWidth={strokeWidth}
      />
      {arcs.map((slice) => (
        <path
          key={slice.label}
          d={slice.d}
          fill="none"
          stroke={slice.color}
          strokeWidth={strokeWidth}
          strokeLinecap="butt"
        />
      ))}
    </svg>
  );
}

export function MixTrack(props: {
  data: DonutSlice[];
  className?: string;
}) {
  const total = props.data.reduce((sum, slice) => sum + slice.value, 0);
  if (total <= 0) return null;

  return (
    <div
      className={cn("flex h-3 overflow-hidden rounded-full bg-ivory-deep", props.className)}
      role="img"
      aria-label="Spend mix track"
    >
      {props.data.map((slice) => (
        <div
          key={slice.label}
          className="h-full min-w-[3px] transition-[width]"
          style={{
            width: `${(slice.value / total) * 100}%`,
            backgroundColor: slice.color
          }}
          title={`${slice.label}: ${Math.round((slice.value / total) * 100)}%`}
        />
      ))}
    </div>
  );
}
