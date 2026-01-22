interface ChevronLeftIconProps {
  className?: string
  size?: 12 | 16
}

export function ChevronLeftIcon({ className, size = 16 }: ChevronLeftIconProps) {
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
          d="M7.16797 1.91797L3.59375 5.64844C3.49609 5.76562 3.4375 5.88281 3.4375 6C3.4375 6.11719 3.47656 6.21484 3.55469 6.3125L7.12891 10.043C7.32422 10.2383 7.61719 10.2383 7.79297 10.0625C7.98828 9.88672 7.98828 9.59375 7.8125 9.39844L4.57031 6L7.85156 2.5625C8.02734 2.38672 8.02734 2.07422 7.83203 1.89844C7.63672 1.72266 7.34375 1.72266 7.16797 1.91797Z"
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
        d="M9.03516 2.28516L4.03125 7.50781C3.89453 7.67188 3.8125 7.83594 3.8125 8C3.8125 8.16406 3.86719 8.30078 3.97656 8.4375L8.98047 13.6602C9.25391 13.9336 9.66406 13.9336 9.91016 13.6875C10.1836 13.4414 10.1836 13.0312 9.9375 12.7578L5.39844 8L9.99219 3.1875C10.2383 2.94141 10.2383 2.50391 9.96484 2.25781C9.69141 2.01172 9.28125 2.01172 9.03516 2.28516Z"
        fill="currentColor"
      />
    </svg>
  )
}
