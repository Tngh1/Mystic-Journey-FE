"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DayPicker } from "react-day-picker";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, X } from "lucide-react";


// Helper function executing parse local.
// Processes input parameters and returns the calculated result.
function parseLocal(value: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

// Helper function executing to local string.
// Processes input parameters and returns the calculated result.
function toLocalString(date: Date): string {
  // Convert the number to a two-character string so generated local date and time fields remain zero-padded.
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

// Helper function executing format display.
// Processes input parameters and returns the calculated result.
function formatDisplay(date: Date): string {
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// Renders the hours reusable UI component.
// Returns the styled JSX element.
const HOURS = Array.from({ length: 24 }, (_, i) => i);
// Renders the minutes reusable UI component.
// Returns the styled JSX element.
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);


interface DropdownPos {
  top: number;
  left: number;
  width: number;
  openUp: boolean;
}

interface DateTimePickerProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
}


// Renders date time picker modal/form component.
// Workflow: manages form field values and validation feedback state.
// Returns the interactive form JSX element.
export default function DateTimePicker({
  id,
  value,
  onChange,
  placeholder = "Pick date & time",
  disabled = false,
  minDate,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);  // Initialize boolean flag as inactive
  const [pos, setPos] = useState<DropdownPos | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = parseLocal(value);
  const hour = selected?.getHours() ?? 0;
  const minute = Math.round((selected?.getMinutes() ?? 0) / 5) * 5;

  // Helper function executing open dropdown.
  // Processes input parameters and returns the calculated result.
  const openDropdown = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const DROPDOWN_H = 430;
    const spaceBelow = window.innerHeight - rect.bottom - 8;
    const openUp = spaceBelow < DROPDOWN_H && rect.top > DROPDOWN_H;

    setPos({
      top: openUp ? rect.top - 8 : rect.bottom + 8,
      left: rect.left,
      width: Math.max(rect.width, 300),
      openUp,
    });
    setOpen(true);
  };

  // Load bounding client rect when the dependencies change, update pos, and ignore stale callbacks after unmount.
  useEffect(() => {
    if (!open) return;

    // Helper function executing reposition.
    // Processes input parameters and returns the calculated result.
    const reposition = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const DROPDOWN_H = 430;
      const spaceBelow = window.innerHeight - rect.bottom - 8;
      const openUp = spaceBelow < DROPDOWN_H && rect.top > DROPDOWN_H;
      setPos({
        top: openUp ? rect.top - 8 : rect.bottom + 8,
        left: rect.left,
        width: Math.max(rect.width, 300),
        openUp,
      });
    };

    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open]);

  // Subscribe the required browser or runtime event handlers when dependencies change and remove the same handlers during cleanup.
  useEffect(() => {
    if (!open) return;
    // Event handler for handler.
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Subscribe the required browser or runtime event handlers when dependencies change and remove the same handlers during cleanup.
  useEffect(() => {
    if (!open) return;
    // Event handler for handler.
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  // Event handler for handle day select.
  const handleDaySelect = (day: Date | undefined) => {
    if (!day) { onChange(""); return; }
    const next = new Date(day);
    next.setHours(hour, minute, 0, 0);
    onChange(toLocalString(next));
  };

  // Event handler for handle hour change.
  const handleHourChange = (h: number) => {
    if (selected) {
      const next = new Date(selected);
      next.setHours(h, minute, 0, 0);
      onChange(toLocalString(next));
    }
  };

  // Event handler for handle minute change.
  const handleMinuteChange = (m: number) => {
    if (selected) {
      const next = new Date(selected);
      next.setHours(hour, m, 0, 0);
      onChange(toLocalString(next));
    }
  };

  // Event handler for handle now.
  const handleNow = () => {
    const now = new Date();
    const roundedMin = Math.round(now.getMinutes() / 5) * 5;
    now.setMinutes(roundedMin, 0, 0);
    onChange(toLocalString(now));
    setOpen(false);
  };

  // Event handler for handle clear.
  const handleClear = () => { onChange(""); setOpen(false); };


  const dropdown = open && pos ? (
    <div
      ref={dropdownRef}
      style={{
        position: "fixed",
        top: pos.openUp ? undefined : pos.top,
        bottom: pos.openUp ? window.innerHeight - pos.top : undefined,
        left: pos.left,
        width: pos.width,
        zIndex: 9999,
      }}
      className="overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-2xl shadow-black/70 animate-in fade-in-0 zoom-in-95 duration-150"
    >
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={handleDaySelect}
        defaultMonth={selected ?? minDate ?? new Date()}
        disabled={minDate ? { before: minDate } : undefined}
        showOutsideDays
        classNames={{
          root: "p-4 select-none",
          months: "flex flex-col",
          month: "space-y-3",
          month_caption: "flex items-center justify-between px-1 mb-1",
          caption_label: "text-sm font-bold text-white",
          nav: "flex items-center gap-1",
          button_previous:
            "flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/60 hover:border-[#ffc032]/40 hover:text-[#ffc032] transition-colors cursor-pointer",
          button_next:
            "flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/60 hover:border-[#ffc032]/40 hover:text-[#ffc032] transition-colors cursor-pointer",
          month_grid: "w-full border-collapse",
          weekdays: "flex",
          weekday: "w-9 text-center text-[10px] font-semibold uppercase tracking-wider text-white/30 pb-1",
          week: "flex mt-1",
          day: "relative p-0",
          day_button:
            "mx-auto flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium text-white/70 hover:bg-[#ffc032]/10 hover:text-[#ffc032] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc032]/50",
          selected: "bg-[#ffc032] text-[#111] rounded-lg font-bold hover:bg-[#ffd04c]",
          today: "text-[#ffc032] font-bold",
          outside: "text-white/15",
          disabled: "text-white/10 cursor-not-allowed",
          hidden: "invisible",
        }}
        components={{
          Chevron: ({ orientation }) =>
            orientation === "left"
              ? <ChevronLeft className="h-4 w-4" />
              : <ChevronRight className="h-4 w-4" />,
        }}
      />

      <div className="border-t border-white/10 px-4 py-3">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/35">
          <Clock className="h-3 w-3" />
          Time
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <select
              aria-label="Hour"
              value={hour}
              onChange={(e) => handleHourChange(Number(e.target.value))}
              className="h-9 w-full cursor-pointer rounded-lg border border-white/10 bg-[#0d0d0d] px-2 text-center text-sm font-mono text-white focus:border-[#ffc032] focus:outline-none"
            >
              {HOURS.map((h) => (
                <option key={h} value={h} className="bg-[#111111]">
                  {String(h).padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>
          <span className="text-lg font-bold text-white/30">:</span>
          <div className="flex-1">
            <select
              aria-label="Minute"
              value={minute}
              onChange={(e) => handleMinuteChange(Number(e.target.value))}
              className="h-9 w-full cursor-pointer rounded-lg border border-white/10 bg-[#0d0d0d] px-2 text-center text-sm font-mono text-white focus:border-[#ffc032] focus:outline-none"
            >
              {MINUTES.map((m) => (
                <option key={m} value={m} className="bg-[#111111]">
                  {String(m).padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
        <button
          type="button"
          onClick={handleClear}
          className="text-xs font-semibold text-white/40 hover:text-red-300 transition-colors cursor-pointer"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={handleNow}
          className="rounded-lg bg-[#ffc032]/10 px-3 py-1.5 text-xs font-bold text-[#ffc032] hover:bg-[#ffc032]/20 transition-colors cursor-pointer"
        >
          Now
        </button>
      </div>
    </div>
  ) : null;


  return (
    <div className="relative">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openDropdown())}
        className={`
          flex w-full items-center gap-2 rounded-lg border px-4 py-2.5 text-left text-sm
          transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc032]/50
          disabled:cursor-not-allowed disabled:opacity-50
          ${open
            ? "border-[#ffc032] bg-[#0d0d0d] text-white"
            : "border-white/10 bg-[#0d0d0d] text-white hover:border-white/20"
          }
        `}
      >
        <CalendarDays className="h-4 w-4 shrink-0 text-[#ffc032]" />
        <span className={`flex-1 truncate ${selected ? "text-white" : "text-gray-500"}`}>
          {selected ? formatDisplay(selected) : placeholder}
        </span>
        {selected && (
          <span
            role="button"
            tabIndex={0}
            aria-label="Clear date"
            onClick={(e) => { e.stopPropagation(); handleClear(); }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); handleClear(); } }}
            className="rounded p-0.5 text-white/40 hover:text-white/80 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </span>
        )}
      </button>

      {typeof document !== "undefined" && createPortal(dropdown, document.body)}
    </div>
  );
}
