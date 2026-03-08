"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type InstitutionWithBranches = any;
type BranchWithPermissions = any;

type InstitutionContextType = {
  selectedInstitution: InstitutionWithBranches | null;
  setSelectedInstitution: (institution: InstitutionWithBranches | null) => void;
  selectedBranch: BranchWithPermissions | null;
  setSelectedBranch: (branch: BranchWithPermissions | null) => void;
};

const InstitutionContext = createContext<InstitutionContextType | undefined>(
  undefined
);

export const InstitutionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedInstitution, setSelectedInstitution] =
    useState<InstitutionWithBranches | null>(null);
  const [selectedBranch, setSelectedBranch] =
    useState<BranchWithPermissions | null>(null);

  return (
    <InstitutionContext.Provider
      value={{
        selectedInstitution,
        setSelectedInstitution,
        selectedBranch,
        setSelectedBranch,
      }}
    >
      {children}
    </InstitutionContext.Provider>
  );
};

export const useInstitution = () => {
  const context = useContext(InstitutionContext);
  if (!context) {
    throw new Error("useInstitution must be used within an InstitutionProvider");
  }
  return context;
};
