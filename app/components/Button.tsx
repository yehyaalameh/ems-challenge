import type { ReactNode } from "react";

export const Button = ({
  linkTo,
  children,
  className,
}: {
  linkTo?: string;
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <div>
      <a
        className={`bg-white text-[#005e9c] hover:bg-[#005e9c] hover:text-white transition-all cursor-pointer rounded border border-[#005e9c] active:bg-[#005e9c] active:text-white py-2 px-5  ${className}`}
        href={linkTo}
      >
        {children}
      </a>
    </div>
  );
};
