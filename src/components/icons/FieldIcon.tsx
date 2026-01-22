interface FieldIconProps {
  className?: string
  size?: 12 | 16
}

export function FieldIcon({ className, size = 16 }: FieldIconProps) {
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
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.81395 1.54941C5.92923 1.48353 6.07077 1.48353 6.18605 1.54941L11.4361 4.54941C11.5529 4.61617 11.625 4.74043 11.625 4.875C11.625 5.00957 11.5529 5.13382 11.4361 5.20059L6.18605 8.20059C6.07077 8.26647 5.92923 8.26647 5.81395 8.20059L0.563948 5.20059C0.447107 5.13382 0.375 5.00957 0.375 4.875C0.375 4.74043 0.447107 4.61617 0.563948 4.54941L5.81395 1.54941ZM1.50584 4.875L6 7.44309L10.4942 4.875L6 2.30691L1.50584 4.875Z"
          fill="currentColor"
          stroke="#0D0D0D"
          strokeWidth="0.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.424473 6.56395C0.527227 6.38413 0.756297 6.32166 0.936116 6.42441L6.00006 9.3181L11.064 6.42441C11.2438 6.32166 11.4729 6.38413 11.5757 6.56395C11.6784 6.74377 11.6159 6.97284 11.4361 7.07559L6.18612 10.0756C6.07083 10.1415 5.9293 10.1415 5.81401 10.0756L0.564012 7.07559C0.384193 6.97284 0.321719 6.74377 0.424473 6.56395Z"
          fill="currentColor"
          stroke="#0D0D0D"
          strokeWidth="0.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.69988 3.75011C9.80338 3.9295 9.74185 4.15883 9.56246 4.26232L4.68746 7.07482C4.50807 7.17832 4.27874 7.11679 4.17524 6.9374C4.07175 6.758 4.13327 6.52868 4.31267 6.42518L9.18767 3.61268C9.36706 3.50919 9.59639 3.57071 9.69988 3.75011Z"
          fill="currentColor"
          stroke="#0D0D0D"
          strokeWidth="0.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.82488 2.62511C7.92838 2.8045 7.86685 3.03383 7.68746 3.13732L2.81246 5.94982C2.63307 6.05332 2.40374 5.99179 2.30024 5.8124C2.19675 5.63301 2.25827 5.40368 2.43767 5.30018L7.31267 2.48768C7.49206 2.38419 7.72139 2.44571 7.82488 2.62511Z"
          fill="currentColor"
          stroke="#0D0D0D"
          strokeWidth="0.25"
          strokeLinecap="round"
          strokeLinejoin="round"
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.75193 2.06588C7.90565 1.97804 8.09435 1.97804 8.24807 2.06588L15.2481 6.06588C15.4039 6.1549 15.5 6.32057 15.5 6.5C15.5 6.67943 15.4039 6.8451 15.2481 6.93412L8.24807 10.9341C8.09435 11.022 7.90565 11.022 7.75193 10.9341L0.751931 6.93412C0.596143 6.8451 0.5 6.67943 0.5 6.5C0.5 6.32057 0.596143 6.1549 0.751931 6.06588L7.75193 2.06588ZM2.00778 6.5L8 9.92412L13.9922 6.5L8 3.07588L2.00778 6.5Z"
        fill="currentColor"
        stroke="#0D0D0D"
        strokeWidth="0.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.565964 8.75196C0.702969 8.5122 1.0084 8.4289 1.24816 8.5659L8.00009 12.4241L14.752 8.5659C14.9918 8.4289 15.2972 8.5122 15.4342 8.75196C15.5712 8.99171 15.4879 9.29714 15.2482 9.43415L8.24815 13.4341C8.09444 13.522 7.90573 13.522 7.75202 13.4341L0.752016 9.43415C0.512257 9.29714 0.428959 8.99171 0.565964 8.75196Z"
        fill="currentColor"
        stroke="#0D0D0D"
        strokeWidth="0.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.9332 5.00016C13.0712 5.23935 12.9891 5.54512 12.7499 5.68312L6.24994 9.43312C6.01075 9.57111 5.70499 9.48907 5.56699 9.24988C5.429 9.01069 5.51103 8.70492 5.75022 8.56693L12.2502 4.81693C12.4894 4.67894 12.7952 4.76097 12.9332 5.00016Z"
        fill="currentColor"
        stroke="#0D0D0D"
        strokeWidth="0.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.4332 3.50016C10.5712 3.73935 10.4891 4.04512 10.2499 4.18312L3.74994 7.93312C3.51075 8.07111 3.20499 7.98908 3.06699 7.74988C2.929 7.51069 3.01103 7.20493 3.25022 7.06693L9.75022 3.31693C9.98941 3.17894 10.2952 3.26097 10.4332 3.50016Z"
        fill="currentColor"
        stroke="#0D0D0D"
        strokeWidth="0.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
