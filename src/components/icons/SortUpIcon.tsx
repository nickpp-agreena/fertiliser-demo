interface SortUpIconProps {
  className?: string
  size?: 12 | 16
}

export function SortUpIcon({ className, size = 16 }: SortUpIconProps) {
  if (size === 12) {
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ width: '12px', height: '12px' }}
      >
        <path
          d="M4.36328 6.875C3.70703 6.875 3.35156 6.08203 3.84375 5.58984L7.45312 1.87109C7.58984 1.70703 7.80859 1.625 8 1.625C8.19141 1.625 8.38281 1.70703 8.51953 1.87109L12.1289 5.58984C12.6211 6.08203 12.2656 6.875 11.6094 6.875H4.36328Z"
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
        d="M4.36328 6.875C3.70703 6.875 3.35156 6.08203 3.84375 5.58984L7.45312 1.87109C7.58984 1.70703 7.80859 1.625 8 1.625C8.19141 1.625 8.38281 1.70703 8.51953 1.87109L12.1289 5.58984C12.6211 6.08203 12.2656 6.875 11.6094 6.875H4.36328Z"
        fill="currentColor"
      />
    </svg>
  )
}
