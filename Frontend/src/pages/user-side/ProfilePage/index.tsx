
import MainLayout from '@/component/Layout/MainLayout';
import SidebarComponent from '@/component/Layout/Sidebar';
import {profileSidebarOptions, SidebarOption} from '@/data/profileSidebarOptions';
import { Navigate, Route, Routes } from 'react-router-dom';

const ProfilePage = () => {
 
// Recursive function to flatten all routes, including sub-options
const flattenRoutes = (options: SidebarOption[]): SidebarOption[] => {
  const flatRoutes: SidebarOption[] = [];

  options.forEach((option) => {
    flatRoutes.push(option); // Add the main option

    // If sub-options exist, recursively flatten them
    if (option.subOptions) {
      flatRoutes.push(...flattenRoutes(option.subOptions));
    }
  });

  return flatRoutes;
};


const allRoutes = flattenRoutes(profileSidebarOptions.flatMap((section) => section.options));

  return (
    <MainLayout>
      <div className="flex flex-grow ">
    <SidebarComponent sidebarOptions={profileSidebarOptions}/>
    <div className="flex-grow p-4 bg-gray-100 overflow-auto min-h-screen">
  <Routes>

    {/* Render all routes */}
    {allRoutes.map((route) => (
      <Route key={route.path} path={route.path.replace("/profile-page", "")} element={<route.component />} />
    ))}
  {/* Default Route */}
  <Route path="/" element={<Navigate to="/profile-page/my-profile" />} />

  </Routes>
</div>
    </div>
    </MainLayout>

  );
};

export default ProfilePage;
