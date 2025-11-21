// components/ui/combo-select-input.tsx - VERSIÓN FINAL
'use client' // ← AGREGAR ESTO

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

export interface Option {
  value: string;
  label: string;
}

export interface ComboSelectInputProps
  extends Omit<React.ComponentProps<"input">, "onChange"> {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ComboSelectInput: React.FC<ComboSelectInputProps> = ({
  options,
  value,
  onChange,
  placeholder,
  className,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [anchorWidth, setAnchorWidth] = React.useState<number>(0);

  // ✅ CORREGIDO: Solo 'open' como dependencia
  React.useEffect(() => {
    if (anchorRef.current) {
      setAnchorWidth(anchorRef.current.offsetWidth);
    }
  }, [open]); // ← SOLO 'open'

  const filteredOptions = React.useMemo(() => {
    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(value.trim().toLowerCase())
    );
    return filtered.sort((a, b) =>
      a.label.localeCompare(b.label, undefined, { numeric: true, sensitivity: 'base' })
    );
  }, [options, value]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Anchor asChild>
        <div
          ref={anchorRef}
          onClick={() => {
            if (!open) {
              setOpen(true);
              setTimeout(() => inputRef.current?.focus(), 0);
            }
          }}
          className={cn(
            "border-input flex h-9 w-full items-center justify-between rounded border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            className
          )}
        >
          <Input
            {...props}
            ref={inputRef}
            value={value}
            onChange={(e) => {
              if (!open) setOpen(true);
              onChange(e.target.value);
            }}
            placeholder={placeholder}
            className="h-full flex-1 border-none bg-transparent p-0 shadow-none outline-none ring-0 focus-visible:ring-0"
          />
          <Popover.Trigger asChild>
            <button
              type="button"
              className="flex h-full cursor-pointer items-center justify-center pl-2 outline-none"
              aria-label="Abrir o cerrar opciones"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {open ? (
                <ChevronUpIcon className="size-4 shrink-0 opacity-50" />
              ) : (
                <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
              )}
            </button>
          </Popover.Trigger>
        </div>
      </Popover.Anchor>

      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={4}
          style={{ width: anchorWidth }}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className={cn(
            "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 relative z-50 rounded-md border shadow-md p-1",
            "max-h-[10rem] overflow-y-auto"
          )}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className="cursor-pointer rounded-sm py-1.5 px-3 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(option.value);
                  setOpen(false);
                  inputRef.current?.focus();
                }}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="py-1.5 px-3 text-sm text-muted-foreground bg-white">
              No se encontraron resultados.
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export { ComboSelectInput };