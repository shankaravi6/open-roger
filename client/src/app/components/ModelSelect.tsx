"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const AI_MODELS = [
  "OpenAI GPT 5.1",
  "Claude Opus 4.6",
  "Gemini 2.0 Ultra",
  "Llama 4",
  "Mistral Large",
];

type ModelSelectProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  "aria-label"?: string;
};

export function ModelSelect({
  value: controlledValue,
  onChange,
  placeholder = "Choose AI model",
  "aria-label": ariaLabel,
}: ModelSelectProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [highlight, setHighlight] = useState(0);
  const [internalValue, setInternalValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = controlledValue !== undefined && onChange !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  function select(model: string) {
    if (isControlled) {
      onChange?.(model);
    } else {
      setInternalValue(model);
    }
    setFilter("");
    setOpen(false);
    inputRef.current?.blur();
  }
  const displayValue = value || placeholder;
  const filtered =
    filter.trim() === ""
      ? AI_MODELS
      : AI_MODELS.filter((m) => m.toLowerCase().includes(filter.toLowerCase()));
  const showDropdown = open && filtered.length > 0;

  useEffect(() => {
    if (!open) return;
    const first = filtered.findIndex((m) =>
      m.toLowerCase().startsWith(filter.toLowerCase()),
    );
    setHighlight(first >= 0 ? first : 0);
  }, [open, filter, filtered]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside, true);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside, true);
  }, []);

  function onInputFocus() {
    setOpen(true);
    setFilter(value);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      setFilter(value);
      inputRef.current?.blur();
      return;
    }
    if (!showDropdown) {
      if (e.key === "Enter" || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
        setFilter("");
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      select(filtered[highlight]);
    }
  }

  const inputValue = open ? filter : displayValue;

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls="model-select-listbox"
        aria-label={ariaLabel}
        className="flex cursor-text items-center justify-between gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-left text-sm transition-colors hover:border-white/30 focus-within:border-pink focus-within:ring-1 focus-within:ring-pink"
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setFilter(e.target.value);
            setOpen(true);
          }}
          onFocus={onInputFocus}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-white placeholder:text-muted-teal focus:outline-none"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls="model-select-listbox"
          readOnly={!open}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label="Toggle list"
          className="shrink-0 rounded p-0.5 text-muted-teal hover:text-white focus:outline-none"
          onMouseDown={(e) => {
            e.preventDefault();
            setOpen((o) => !o);
            if (!open) {
              setFilter(value);
              inputRef.current?.focus();
            }
          }}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>
      {showDropdown && (
        <ul
          id="model-select-listbox"
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-52 overflow-auto rounded-xl border border-white/20 bg-medium-purple py-1 shadow-xl"
          role="listbox"
          aria-label="AI models"
        >
          {filtered.map((model, i) => (
            <li
              key={model}
              role="option"
              aria-selected={value === model}
              className={`cursor-pointer px-4 py-2.5 text-sm ${i === highlight ? "bg-pink/30 text-white" : "text-muted-teal hover:bg-white/10 hover:text-white"}`}
              onMouseDown={(e) => {
                e.preventDefault();
                select(model);
              }}
              onMouseEnter={() => setHighlight(i)}
            >
              {model}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
