"use client";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface InstitutionsHoverProps {
  institutions: { name: string }[];
}

export default function InstitutionsHover({ institutions }: InstitutionsHoverProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="cursor-pointer font-medium">
          {institutions.length}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 p-3 bg-white shadow-lg rounded-xl">
        <h2 className="font-semibold text-sm mb-2">Institutions</h2>
        <ul className="space-y-1 text-sm text-gray-700 max-h-40 overflow-y-auto">
          {institutions.map((inst, i) => (
            <li key={i} className="border-b last:border-0 py-1">
              {inst.name}
            </li>
          ))}
        </ul>
      </HoverCardContent>
    </HoverCard>
  );
}
