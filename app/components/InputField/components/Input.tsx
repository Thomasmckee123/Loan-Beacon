"use client";

import { ReactNode, InputHTMLAttributes } from "react";
import Select, {
  components,
  DropdownIndicatorProps,
  SingleValue,
  StylesConfig,
} from "react-select";
import { ChevronDown } from "lucide-react";

type OptionType = { label: string; value: string };

type InputRootProps = {
  children: ReactNode;
  className?: string;
};

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

type SelectInputProps = {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
  label?: string;
  placeholder?: string;
};
function InputRoot({ children, className = "p-2" }: InputRootProps) {
  return <div className={className}>{children}</div>;
}

function TextInput({
  className,
  label,
  id,
  type = "text",
  ...props
}: TextInputProps) {
  return (
    <>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 p-2"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        className={`border border-gray-300 rounded-full p-2 w-full ${className ?? ""}`}
        {...props}
      />
    </>
  );
}

function DropdownIndicator(props: DropdownIndicatorProps<OptionType>) {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown
        size={18}
        className={`text-gray-500 transition-transform duration-200 ${
          props.selectProps.menuIsOpen ? "rotate-180" : ""
        }`}
      />
    </components.DropdownIndicator>
  );
}

const selectStyles: StylesConfig<OptionType> = {
  control: (base) => ({
    ...base,
    borderRadius: "9999px",
    padding: "4px 8px",
    borderColor: "#d1d5db",
    boxShadow: "none",
    "&:hover": { borderColor: "#9ca3af" },
  }),
  indicatorSeparator: () => ({ display: "none" }),
};

function SelectInput({
  options,
  value,
  onChange,
  id,
  label,
  placeholder,
}: SelectInputProps) {
  const selectOptions: OptionType[] = options.map((opt) => ({
    label: opt,
    value: opt,
  }));

  const selected = selectOptions.find((opt) => opt.value === value) ?? null;

  return (
    <>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 p-2"
        >
          {label}
        </label>
      )}
      <Select
        inputId={id}
        options={selectOptions}
        value={selected}
        onChange={(opt) =>
          onChange?.((opt as SingleValue<OptionType>)?.value ?? "")
        }
        components={{ DropdownIndicator }}
        styles={selectStyles}
        placeholder={placeholder ?? "Select..."}
        isSearchable={false}
      />
    </>
  );
}

export const Input = Object.assign(InputRoot, {
  Text: TextInput,
  Select: SelectInput,
});
