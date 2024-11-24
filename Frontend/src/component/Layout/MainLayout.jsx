import Navbar from '../UI/Navbar';
import Footer from '../UI/Footer';

const MainLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
