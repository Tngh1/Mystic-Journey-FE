"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface SidebarContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

// Renders the sidebar provider reusable UI component.
// Features: renders child component slots dynamically.
// Returns the styled JSX element.
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);  // Initialize boolean flag as inactive

  // Helper function executing open.
  // Processes input parameters and returns the calculated result.
  const open = useCallback(() => setIsOpen(true), []);
  // Helper function executing close.
  // Processes input parameters and returns the calculated result.
  const close = useCallback(() => setIsOpen(false), []);
  // Helper function executing toggle.
  // Processes input parameters and returns the calculated result.
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return (
    <SidebarContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

// Custom React hook providing use sidebar state and utility functions.
// Returns state values and operational callbacks to consuming components.
export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return ctx;
}
