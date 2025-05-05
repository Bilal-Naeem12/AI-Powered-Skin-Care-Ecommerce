import PageBreadcrumb from "@/component/common/PageBreadCrumb";
import UserMetaCard from "@/component/admin/UserProfile/UserMetaCard";
import UserInfoCard from "@/component/admin/UserProfile/UserInfoCard";
import UserAddressCard from "@/component/admin/UserProfile/UserAddressCard";
import PageMeta from "@/component/common/PageMeta";

export default function AdminProfile() {
  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          <UserAddressCard />
        </div>
      </div>
    </>
  );
}
