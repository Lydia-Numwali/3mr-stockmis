import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface BulkAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

interface BulkActionsDropdownProps {
  actions: BulkAction[];
  disabled?: boolean;
}

const BulkActionsDropdown: React.FC<BulkActionsDropdownProps> = ({
  actions,
  disabled,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="outline"
        size="sm"
        disabled={disabled}
        className="h-[47px] rounded-xl"
      >
        Bulk Actions
      <ChevronDown />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      {actions.map((action, idx) => (
        <DropdownMenuItem
          key={idx}
          onClick={action.onClick}
          disabled={action.disabled}
          className="flex items-center gap-2"
        >
          {action.icon}
          {action.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

export default BulkActionsDropdown;
