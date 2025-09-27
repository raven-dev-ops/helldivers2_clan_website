import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

/**
 * Simple reusable button component with Tailwind styling
 */
export default function Button({ variant = 'primary', ...props }: ButtonProps) {
  let baseClasses = 'rounded px-4 py-2 font-medium transition';
  let variantClasses =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300';

  return <button className={`${baseClasses} ${variantClasses}`} {...props} />;
}
