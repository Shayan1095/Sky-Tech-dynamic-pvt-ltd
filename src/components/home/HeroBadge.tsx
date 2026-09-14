export default function HeroBadge() {
  return (
    <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] bg-bg shadow-[0_20px_60px_-15px_rgba(0,107,184,0.35)] ring-1 ring-accent sm:h-32 sm:w-32 lg:h-36 lg:w-36">
      <svg viewBox="0 0 100 100" className="h-[66%] w-[66%]" aria-hidden="true">
        <defs>
          <linearGradient id="heroBadgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#006bb8" />
            <stop offset="100%" stopColor="#00c2ff" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#heroBadgeGradient)" />
        <path
          d="M50,0 A50,50 0 0,0 50,100 A25,25 0 0,1 50,50 A25,25 0 0,0 50,0 Z"
          fill="#006bb8"
        />
      </svg>
    </div>
  );
}
