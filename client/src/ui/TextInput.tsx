import type { FC, InputHTMLAttributes } from "react";

const TextInput: FC<InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <input
      {...props}
      className="border border-gray-300 rounded-md outline-0 px-3 py-2 focus:border-gray-700 w-full"
    />
  );
};

export default TextInput;
