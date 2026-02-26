import { type FC } from "react";

type WrapperProps = {
  children: React.ReactNode;
  title?: string;
};

const Wrapper: FC<WrapperProps> = ({ children, title }) => {
  return (
    <div className="border border-gray-300 rounded-xl p-6">
      {title && <h1 className="text-2xl font-bold mb-4">{title}</h1>}
      {children}
    </div>
  );
};

export default Wrapper;
