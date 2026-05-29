import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  height: number;
};

export default function LandingLayout({ children, height }: Props) {
  return (
    <div className="w-full overflow-x-auto bg-white">
      <div className="relative mx-auto" style={{ width: 1440, height }}>
        {children}
      </div>
    </div>
  );
}
