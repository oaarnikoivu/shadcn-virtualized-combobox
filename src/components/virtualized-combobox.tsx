import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

function generateRandomStrings() {
  const items = new Set<string>();
  while (items.size < 100000) {
    const randomString = Math.random().toString(36).substr(2, 10);
    items.add(randomString);
  }
  return Array.from(items);
}

const randomStrings: string[] = generateRandomStrings();

type Item = {
  value: string;
  label: string;
};

const initialItems: Item[] = randomStrings.map((item) => ({
  value: item,
  label: item,
}));

interface VirtualizedCommandProps {
  value: string;
  onSelectItem?: (value: string) => void;
}

const VirtualizedCommand = ({
  value,
  onSelectItem,
}: VirtualizedCommandProps) => {
  const [items, setItems] = React.useState<Item[]>(initialItems);
  const parentRef = React.useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  const handleSearch = (value: string) => {
    const items = initialItems.filter((item) =>
      item.value.toLowerCase().includes(value.toLowerCase() ?? [])
    );
    setItems(items);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
    }
  };

  return (
    <Command shouldFilter={false} onKeyDown={handleKeyDown}>
      <CommandInput
        onValueChange={handleSearch}
        placeholder="Search items..."
      />
      <CommandEmpty>No item found.</CommandEmpty>
      <CommandGroup
        ref={parentRef}
        style={{
          height: "200px",
          width: "100%",
          overflow: "auto",
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualItems.map((row) => (
            <CommandItem
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${row.size}px`,
                transform: `translateY(${row.start}px)`,
              }}
              key={items[row.index].value}
              value={items[row.index].value}
              onSelect={onSelectItem}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  value === items[row.index].value ? "opacity-100" : "opacity-0"
                )}
              />
              {items[row.index].label}
            </CommandItem>
          ))}
        </div>
      </CommandGroup>
    </Command>
  );
};

export function VirtualizedCombobox() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? initialItems.find((item) => item.value === value)?.label
            : "Select item..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <VirtualizedCommand
          value={value}
          onSelectItem={(currentValue) => {
            setValue(currentValue === value ? "" : currentValue);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
