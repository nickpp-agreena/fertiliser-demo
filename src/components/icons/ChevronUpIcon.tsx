interface ChevronUpIconProps {
  className?: string
  size?: 12 | 16
}

export function ChevronUpIcon({ className, size = 16 }: ChevronUpIconProps) {
  if (size === 12) {
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M1.91797 7.16797L5.64844 3.59375C5.76562 3.49609 5.88281 3.4375 6 3.4375C6.11719 3.4375 6.21484 3.47656 6.3125 3.55469L10.043 7.12891C10.2383 7.32422 10.2383 7.61719 10.0625 7.79297C9.88672 7.98828 9.59375 7.98828 9.39844 7.8125L6 4.57031L2.5625 7.85156C2.38672 8.02734 2.07422 8.02734 1.89844 7.83203C1.72266 7.63672 1.72266 7.34375 1.91797 7.16797Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M2.28516 9.03516L7.50781 4.03125C7.67188 3.89453 7.83594 3.8125 8 3.8125C8.16406 3.8125 8.30078 3.86719 8.4375 3.97656L13.6602 8.98047C13.9336 9.25391 13.9336 9.66406 13.6875 9.91016C13.4414 10.1836 13.0312 10.1836 12.7578 9.9375L8 5.39844L3.1875 9.99219C2.94141 10.2383 2.50391 10.2383 2.25781 9.96484C2.01172 9.69141 2.01172 9.28125 2.28516 9.03516Z"
        fill="currentColor"
      />
    </svg>
  )
}
