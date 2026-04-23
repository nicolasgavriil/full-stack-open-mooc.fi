import { useState } from "react";

export const useField = (name, type, variant = "outlined") => {
  const [value, setValue] = useState("");
  const label = name;

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const reset = () => {
    setValue("");
  };

  return {
    value,
    props: {
      name,
      label,
      type,
      variant,
      value,
      onChange,
    },
    reset,
  };
};
