interface DashIconProps {
  className?: string
  size?: 12 | 16
}

export function DashIcon({ className, size = 16 }: DashIconProps) {
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
          d="M11 6.25C11 6.52344 10.7852 6.71875 10.5312 6.71875H1.46875C1.19531 6.71875 1 6.52344 1 6.25C1 5.99609 1.19531 5.78125 1.46875 5.78125H10.5312C10.7852 5.78125 11 5.99609 11 6.25Z"
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
        d="M15 7.75C15 8.13281 14.6992 8.40625 14.3438 8.40625H1.65625C1.27344 8.40625 1 8.13281 1 7.75C1 7.39453 1.27344 7.09375 1.65625 7.09375H14.3438C14.6992 7.09375 15 7.39453 15 7.75Z"
        fill="currentColor"
      />
    </svg>
  )
}
