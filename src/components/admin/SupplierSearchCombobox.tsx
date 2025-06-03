
import React, { useState } from 'react';
import { Check, ChevronsUpDown, Search } from "lucide-react";
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
import { Supplier } from '@/types/models';

interface SupplierSearchComboboxProps {
  value: string;
  onSelect: (supplierId: string, supplierName: string) => void;
  onOpenModal: () => void;
  suppliers: Supplier[];
  placeholder?: string;
}

const SupplierSearchCombobox: React.FC<SupplierSearchComboboxProps> = ({
  value,
  onSelect,
  onOpenModal,
  suppliers,
  placeholder = "Selecionar fornecedor..."
}) => {
  const [open, setOpen] = useState(false);

  const selectedSupplier = suppliers.find(supplier => supplier.id === value);

  return (
    <div className="flex space-x-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="flex-1 justify-between"
          >
            {selectedSupplier ? selectedSupplier.name : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Buscar fornecedor..." />
            <CommandList>
              <CommandEmpty>Nenhum fornecedor encontrado.</CommandEmpty>
              <CommandGroup>
                {suppliers.map((supplier) => (
                  <CommandItem
                    key={supplier.id}
                    value={supplier.name}
                    onSelect={() => {
                      onSelect(supplier.id, supplier.name);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === supplier.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {supplier.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onOpenModal}
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SupplierSearchCombobox;
