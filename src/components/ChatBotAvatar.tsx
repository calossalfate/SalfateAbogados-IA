"use client";

type ChatBotAvatarProps = {
  size?: "sm" | "md" | "lg";
  active?: boolean;
  className?: string;
};

const sizes = {
  sm: "h-8 w-8",
  md: "h-11 w-11",
  lg: "h-14 w-14",
};

export function ChatBotAvatar({
  size = "md",
  active = false,
  className = "",
}: ChatBotAvatarProps) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${sizes[size]} ${className}`}
      aria-hidden
    >
      <span
        className={`absolute inset-0 rounded-full bg-accent/25 blur-md transition-opacity duration-500 ${
          active ? "opacity-100 animate-pulse-soft" : "opacity-60"
        }`}
      />
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`relative h-full w-full drop-shadow-[0_4px_12px_rgba(201,169,98,0.35)] transition-transform duration-300 group-hover:scale-105 ${
          active ? "animate-float-bot" : ""
        }`}
      >
        <defs>
          <linearGradient id="botHead" x1="12" y1="8" x2="52" y2="56">
            <stop offset="0%" stopColor="#1a2a42" />
            <stop offset="100%" stopColor="#0d1628" />
          </linearGradient>
          <linearGradient id="botFace" x1="20" y1="20" x2="44" y2="44">
            <stop offset="0%" stopColor="#c9a962" />
            <stop offset="100%" stopColor="#9a7b3c" />
          </linearGradient>
        </defs>

        {/* Antena */}
        <line
          x1="32"
          y1="6"
          x2="32"
          y2="14"
          stroke="#c9a962"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="32" cy="5" r="3" fill="#d4b87a" className="animate-pulse-soft" />

        {/* Cabeza */}
        <rect
          x="14"
          y="14"
          width="36"
          height="34"
          rx="12"
          fill="url(#botHead)"
          stroke="#c9a962"
          strokeWidth="1.5"
        />

        {/* Visor */}
        <rect
          x="18"
          y="22"
          width="28"
          height="16"
          rx="8"
          fill="url(#botFace)"
          opacity="0.9"
        />

        {/* Ojos */}
        <ellipse
          cx="26"
          cy="30"
          rx="3"
          ry="3.5"
          fill="#0a1628"
          className="origin-center animate-bot-blink"
        />
        <ellipse
          cx="38"
          cy="30"
          rx="3"
          ry="3.5"
          fill="#0a1628"
          className="origin-center animate-bot-blink"
        />

        {/* Sonrisa */}
        <path
          d="M 24 38 Q 32 43 40 38"
          stroke="#0a1628"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Cuerpo pequeño */}
        <rect
          x="22"
          y="50"
          width="20"
          height="8"
          rx="4"
          fill="#122a45"
          stroke="#c9a962"
          strokeWidth="1"
        />
        <circle cx="32" cy="54" r="2" fill="#c9a962" className="animate-pulse-soft" />
      </svg>
    </span>
  );
}
