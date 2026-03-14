import { Outlet } from 'react-router-dom';
import CustomNavbar from '../components/CustomNavbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <CustomNavbar />
      
      {/* El contenido de la página actual se renderiza aquí */}
      <main className="flex-grow-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;