import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import PublicNavbar from './PublicNavbar';

const PublicLayout = () => {
    return (
        <>
            <PublicNavbar />
            <Outlet />
            <Footer />
        </>
    );
};

export default PublicLayout;
