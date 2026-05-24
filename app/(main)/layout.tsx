import "../globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>
    <Header />
    {children}
    <Footer />
  </>;
}
