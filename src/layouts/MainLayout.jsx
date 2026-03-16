// layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import CustomNavbar from "../components/Navbar/CustomNavbar";
import Footer from "../components/Footer/Footer";
import ThemeToggle from "../components/ThemeToggle/ThemeToggle"; // 👈 Lo traemos para acá

const MainLayout = () => {
  return (
    <>
      <ThemeToggle /> {/* ☀️ Solo vive dentro de este Layout 🌙 */}
      <CustomNavbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
