export type LandingIconName =
  | "upload"
  | "sparkles"
  | "settings"
  | "check"
  | "quiz"
  | "cards"
  | "buddy"
  | "animation";

type LandingIconProps = {
  name: LandingIconName;
  className?: string;
};

export function LandingIcon({ name, className }: LandingIconProps) {
  const sharedProps = {
    "aria-hidden": true as const,
    className,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 32 32",
  };

  switch (name) {
    case "upload":
      return (
        <svg {...sharedProps}>
          <path d="M17 4H8a2 2 0 0 0-2 2v20h20V13z" />
          <path d="M17 4v9h9M16 23v-8m-4 4 4-4 4 4" />
        </svg>
      );
    case "sparkles":
      return (
        <svg {...sharedProps}>
          <path d="m16 3 2.4 8.6L27 14l-8.6 2.4L16 25l-2.4-8.6L5 14l8.6-2.4L16 3Z" />
          <path d="m25 21 .9 3.1L29 25l-3.1.9L25 29l-.9-3.1L21 25l3.1-.9L25 21Z" />
        </svg>
      );
    case "settings":
      return (
        <svg {...sharedProps}>
          <path d="m13 3-.8 2.8a10 10 0 0 0-2.4 1.4L7 6.4l-3 5.2 2.2 2a10 10 0 0 0 0 2.8l-2.2 2 3 5.2 2.8-.8a10 10 0 0 0 2.4 1.4L13 27h6l.8-2.8a10 10 0 0 0 2.4-1.4l2.8.8 3-5.2-2.2-2a10 10 0 0 0 0-2.8l2.2-2-3-5.2-2.8.8a10 10 0 0 0-2.4-1.4L19 3z" />
          <circle cx="16" cy="15" r="4" />
        </svg>
      );
    case "check":
      return (
        <svg {...sharedProps}>
          <path d="m6 16 6 6L27 7" />
        </svg>
      );
    case "quiz":
      return (
        <svg {...sharedProps}>
          <rect x="6" y="4" width="20" height="24" rx="3" />
          <path d="M11 11h2m4 0h4m-10 5h2m4 0h4m-10 5h2m4 0h4" />
          <path d="m10.5 11 1 1 2-2m-3 7 1 1 2-2m-3 7 1 1 2-2" />
        </svg>
      );
    case "cards":
      return (
        <svg {...sharedProps}>
          <path d="M9 5h13l4 4v18H9z" />
          <path d="M22 5v5h4M5 9v18h17M13 16h8m-8 4h6" />
        </svg>
      );
    case "buddy":
      return (
        <svg {...sharedProps}>
          <path d="M6 8a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3h-8l-6 5v-5a3 3 0 0 1-3-3z" />
          <path d="m16 9 1.5 3.5L21 14l-3.5 1.5L16 19l-1.5-3.5L11 14l3.5-1.5L16 9Z" />
        </svg>
      );
    case "animation":
      return (
        <svg {...sharedProps}>
          <rect x="5" y="5" width="22" height="22" rx="4" />
          <path d="m13 10 9 6-9 6z" />
        </svg>
      );
  }
}
