import type { FC, InputHTMLAttributes } from "react";
import TextInput from "./TextInput";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

const Field: FC<FieldProps> = (props) => {
  const { error } = props;
  return (
    <div className="mb-4">
      <TextInput {...props} style={{ borderColor: error ? "red" : "" }} />
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
};

export default Field;
