interface CheckCircleIconProps {
  className?: string
  size?: 12 | 16
}

export function CheckCircleIcon({ className, size = 16 }: CheckCircleIconProps) {
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
          d="M10.2188 3.26172C10.4141 3.45703 10.4141 3.75 10.2188 3.92578L5.0625 9.08203C4.88672 9.27734 4.59375 9.27734 4.41797 9.08203L1.76172 6.42578C1.56641 6.25 1.56641 5.95703 1.76172 5.76172C1.9375 5.58594 2.23047 5.58594 2.40625 5.76172L4.75 8.10547L9.57422 3.26172C9.75 3.08594 10.043 3.08594 10.2188 3.26172Z"
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
        d="M13.9062 3.56641C14.1797 3.83984 14.1797 4.25 13.9062 4.49609L6.6875 11.7148C6.44141 11.9883 6.03125 11.9883 5.78516 11.7148L2.06641 7.99609C1.79297 7.75 1.79297 7.33984 2.06641 7.06641C2.3125 6.82031 2.72266 6.82031 2.96875 7.06641L6.25 10.3477L13.0039 3.56641C13.25 3.32031 13.6602 3.32031 13.9062 3.56641Z"
        fill="currentColor"
      />
    </svg>
  )
}
