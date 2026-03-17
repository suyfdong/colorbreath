export default function BreathingCircle() {
  return (
    <div className="relative flex h-40 w-40 items-center justify-center md:h-48 md:w-48" aria-hidden="true">
      {/* Echo — larger, softer, slightly delayed */}
      <div
        className="breathe-echo absolute h-full w-full rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(201,168,124,0.12) 0%, rgba(201,168,124,0.04) 50%, transparent 70%)",
        }}
      />

      {/* Main breath circle — soft warm filled shape */}
      <div
        className="breathe-main absolute h-3/4 w-3/4 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(237,232,226,0.15) 0%, rgba(201,168,124,0.08) 60%, transparent 80%)",
          boxShadow: "0 0 60px rgba(201,168,124,0.08)",
        }}
      />
    </div>
  );
}
