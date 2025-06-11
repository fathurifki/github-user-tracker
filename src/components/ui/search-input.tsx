import { XCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type SearchInputProps = {
  onSubmit?: (value: string) => void;
  placeholder?: string;
  valueSearch?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
};

const SearchInput: React.FC<SearchInputProps> = ({
  onSubmit,
  placeholder = "Search...",
  valueSearch,
  onChange,
  disabled,
}) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (valueSearch) {
      setValue(valueSearch);
    }
  }, [valueSearch]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) onSubmit(value);
  };

  const handleClear = () => {
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 py-3">
      <label className="flex flex-col min-w-40 h-12 w-full">
        <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
          <div className="text-[#6a7581] flex border-none bg-[#f1f2f4] items-center justify-center pl-4 rounded-l-xl border-r-0"></div>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (onChange) onChange(e.target.value);
            }}
            disabled={disabled}
            className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-full placeholder:text-[#6a7581] px-4 rounded-r-none border-r-0 pr-2 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal ${
              disabled ? "cursor-not-allowed" : ""
            }`}
            placeholder={placeholder}
          />
          <div className="flex items-center justify-center rounded-r-xl border-l-0 border-none bg-[#f1f2f4] pr-4">
            {value && (
              <div
                onClick={disabled ? undefined : handleClear}
                className={`flex max-w-[480px] items-center justify-center overflow-hidden rounded-full bg-transparent text-[#121416] gap-2 text-base font-bold leading-normal tracking-[0.015em] h-auto min-w-0 px-0 ${
                  disabled ? "cursor-not-allowed opacity-50 pointer-events-none" : "cursor-pointer"
                }`}
                aria-label="Clear search"
                tabIndex={disabled ? -1 : 0}
                aria-disabled={disabled}
              >
                <div className="text-[#6a7581]">
                  <XCircle size={24} />
                </div>
              </div>
            )}
          </div>
        </div>
      </label>
    </form>
  );
};

export default SearchInput;
