import NavigationBar from "@/components/ui/navbar/user/NavigationBar";
import Footer from "@/components/layouts/Footer";

export default function UserLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar />
      <main className="grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
