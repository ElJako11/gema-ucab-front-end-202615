'use client'

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type ComboboxValue = string | number;

type ComboboxItemBase = {
  label: string;
  value: ComboboxValue;
};

interface ComboboxProps<T extends ComboboxItemBase> {
  data: T[];
  value: ComboboxValue | null;
  onValueChange: (value: ComboboxValue | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export function Combobox<T extends ComboboxItemBase>({
  data,
  value,
  onValueChange,
  placeholder = "Seleccionar...",
  searchPlaceholder = "Buscar...",
  triggerClassName = "",
  contentClassName = "",
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);

  // ✅ CORREGIDO: Función de filtro simplificada y segura
  const customFilter = (value: string, search: string) => {
    const searchLower = search.toLowerCase();
    const valueLower = value.toLowerCase();
    
    // Buscar en el valor y en las keywords (labels)
    const item = data.find(item => String(item.value) === value);
    if (!item) return 0;
    
    const matchesValue = valueLower.includes(searchLower);
    const matchesLabel = item.label.toLowerCase().includes(searchLower);
    
    return (matchesValue || matchesLabel) ? 1 : 0;
  };

  // ✅ CORREGIDO: Manejo seguro de selección
  const handleSelect = (selectedValue: string) => {
    // Encontrar el item original para preservar el tipo correcto
    const selectedItem = data.find(item => String(item.value) === selectedValue);
    
    if (selectedItem) {
      // Toggle selection
      const newValue = selectedItem.value === value ? null : selectedItem.value;
      onValueChange(newValue);
    }
    setOpen(false);
  };

  const selectedItem = value ? data.find((item) => item.value === value) : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", triggerClassName)}
        >
          {selectedItem ? selectedItem.label : placeholder}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[200px] p-0", contentClassName)}>
        <Command filter={customFilter}>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.value}
                  value={String(item.value)}
                  onSelect={handleSelect}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}