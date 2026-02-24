import type { ButtonHTMLAttributes, FC, JSX } from "react";

const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props): JSX.Element => {
  return (
    <button
      {...props}
      className="cursor-pointer rounded-md px-4 py-2 border border-blue-500 text-blue-500 duration-300 hover:bg-blue-500 hover:text-white w-full"
    />
  );
};

export default Button;
