import ItemsCodex from "@/components/wiki/ItemsCodex";

/* The index and the entry are one open tome, so both routes render the same
   component — this one just opens it with nothing selected, and the codex falls
   back to the first entry on the page. */
export default function WikiItemsPage() {
  return <ItemsCodex />;
}
