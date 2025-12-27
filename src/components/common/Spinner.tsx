"use client";

import { Flex } from '@once-ui-system/core';

interface SpinnerProps {
  size?: 's' | 'm' | 'l';
}

export function Spinner({ size = 'm' }: SpinnerProps) {
  const sizeMap = {
    s: 16,
    m: 24,
    l: 32,
  };

  const dimension = sizeMap[size];

  return (
    <Flex horizontal="center" vertical="center">
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 24 24"
        fill="none"
        style={{
          animation: 'spin 1s linear infinite',
        }}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="var(--neutral-alpha-medium)"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="var(--brand-solid-strong)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Flex>
  );
}
