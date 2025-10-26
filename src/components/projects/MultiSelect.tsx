import { useEffect, useState } from "react";

interface Option {
  value: string;
  text: string;
  selected?: boolean;
}

interface MultiSelectProps {
  label: string;
  options: Option[];
  defaultSelected?: string[];
  onChange: (values: string[]) => void;
  disabled?: boolean;
  className?: string;
}

export const MultiSelect = ({
  label,
  options,
  defaultSelected = [],
  onChange,
  disabled = false,
  className = "",
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] =
    useState<string[]>(defaultSelected);
  const [searchTerm, setSearchTerm] = useState("");

   useEffect(() => {
    setSelectedValues(defaultSelected);
  }, [defaultSelected]);

  const toggleOption = (value: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (disabled) return;

    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    setSelectedValues(newValues);
    onChange(newValues);
  };

  const filteredOptions = options.filter((option) =>
    option.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent, option: Option) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleOption(option.value);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger */}
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-disabled={disabled}
        className={`w-full border ${
          disabled
            ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed border-gray-200 dark:border-gray-700"
            : "bg-white dark:bg-gray-700 cursor-pointer border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
        } rounded-lg px-3 py-2 flex items-center justify-between transition-colors`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1 flex-1 min-h-[28px] items-center">
          {selectedValues.length > 0 ? (
            selectedValues.map((value) => {
              const option = options.find((opt) => opt.value === value);
              return (
                <span
                  key={value}
                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded flex items-center"
                >
                  {option?.text}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOption(value);
                      }}
                      className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
                      aria-label={`Remove ${option?.text}`}
                    >
                      ×
                    </button>
                  )}
                </span>
              );
            })
          ) : (
            <span className="text-gray-400 dark:text-gray-400">
              Select {label}
            </span>
          )}
        </div>
        {!disabled && (
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div
          className="absolute z-10 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg"
          role="listbox"
          style={{ width: 256, height: 200 }} // fixed width and height in px
        >
          {/* Search Input */}
          <div className="p-2">
            <input
              type="text"
              placeholder="Search here..."
              className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              aria-label={`Search ${label}`}
            />
          </div>

          {/* Options list with scroll */}
          <div className="overflow-y-auto" style={{ maxHeight: 140 }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={selectedValues.includes(option.value)}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-sm text-gray-700 dark:text-gray-300"
                  onClick={() => toggleOption(option.value)}
                  onKeyDown={(e) => handleKeyDown(e, option)}
                  tabIndex={0}
                >
                  {option.text}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
