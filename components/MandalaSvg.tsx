export default function MandalaSvg({ className = "" }: { className?: string }) {
  const petals = 12;
  const layers = [
    { r: 140, count: 12, petalW: 18, petalH: 55 },
    { r: 95, count: 8, petalW: 14, petalH: 40 },
    { r: 55, count: 6, petalW: 10, petalH: 28 },
  ];

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      fill="none"
      stroke="white"
      strokeWidth={0.8}
    >
      {/* Outer circles */}
      <circle cx="200" cy="200" r="185" opacity={0.2} />
      <circle cx="200" cy="200" r="170" opacity={0.15} />

      {/* Petal layers */}
      {layers.map((layer, li) =>
        Array.from({ length: layer.count }).map((_, i) => {
          const angle = (360 / layer.count) * i;
          return (
            <ellipse
              key={`${li}-${i}`}
              cx="200"
              cy={200 - layer.r + layer.petalH / 2}
              rx={layer.petalW / 2}
              ry={layer.petalH / 2}
              transform={`rotate(${angle} 200 200)`}
              opacity={0.35 - li * 0.05}
            />
          );
        })
      )}

      {/* Concentric guide circles */}
      <circle cx="200" cy="200" r="140" opacity={0.12} />
      <circle cx="200" cy="200" r="95" opacity={0.12} />
      <circle cx="200" cy="200" r="55" opacity={0.12} />
      <circle cx="200" cy="200" r="25" opacity={0.2} />

      {/* Center ornament */}
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (360 / petals) * i;
        return (
          <line
            key={`ray-${i}`}
            x1="200"
            y1="200"
            x2="200"
            y2={200 - 20}
            transform={`rotate(${angle} 200 200)`}
            opacity={0.2}
          />
        );
      })}

      {/* Tiny center dot */}
      <circle cx="200" cy="200" r="3" fill="white" stroke="none" opacity={0.3} />
    </svg>
  );
}
