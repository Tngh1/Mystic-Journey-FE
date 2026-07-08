import "../globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

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
