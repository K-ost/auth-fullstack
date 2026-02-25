import type { ButtonHTMLAttributes, FC, JSX } from "react";

const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props): JSX.Element => {
  return (
    <button
      {...props}
      className="not-disabled:cursor-pointer rounded-md px-4 py-2 border border-blue-500 text-blue-500 duration-300 hover:not-disabled:bg-blue-500 hover:not-disabled:text-white w-full disabled:opacity-50"
    />
  );
};

export default Button;
