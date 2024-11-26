import Footer from "../UI/Footer";
import Navbar from "../UI/Navbar";


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
