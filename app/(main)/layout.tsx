import "../globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

// Renders the main layout view component.
// Returns the JSX element hierarchy for the page view.
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex flex-col flex-1 w-full">
        {children}
      </main>
      <Footer />
    </>
  );
}
