import { Outlet } from "react-router-dom";
import CustomNavbar from "../components/common/CustomNavbar";
import Footer from "../components/common/Footer";
import ThemeToggle from "../components/ThemeToggle/ThemeToggle";
/* 🪄 Importamos los estilos que creamos */
import styles from "./MainLayout.module.css"; 

const MainLayout = () => {
  return (
    /* 1. El Wrapper envuelve TODO y asegura el min-height: 100vh */
    <div className={styles.layoutWrapper}>
      
      {/* ☀️ Botón de Tema 🌙 */}
      <ThemeToggle /> 

      {/* Barra de Navegación Superior */}
      <CustomNavbar />

      {/* 2. El MAIN con flex: 1 es el secreto. 
          Se estira como un chicle para empujar al footer abajo 
          incluso si el contenido es solo un spinner.
      */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>

      {/* El Footer ahora siempre estará al final del rastro */}
      <Footer />
      
    </div>
  );
};

export default MainLayout;