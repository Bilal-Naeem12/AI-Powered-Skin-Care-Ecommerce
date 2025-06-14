import React from 'react'
import FaceScanResult from './FaceScanResult'
import SkinHealthGauge from '@/component/UI/SkinHealthGauge'
import MainLayout from '@/component/Layout/MainLayout';
import Breadcrumb from '@/component/UI/Breadcrumb';
import RecommendationsPage from './RecommendationsPage';
import useUserStore from '@/store/useUserStore';
import { useNavigate } from 'react-router-dom';
import { Alert, Button } from '@mui/material';
import { WarningAmber } from '@mui/icons-material';

function FaceScanResultPage() {
  const { user } = useUserStore();
  const navigate = useNavigate();

  return (
    <MainLayout>
        <div className="p-4 sm:p-6 space-y-6">
        {(!user?.allergenPreferences || user?.allergenPreferences.length === 0) && (
          <Alert
            severity="warning"
            icon={<WarningAmber />}
            action={
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/profile-page/account-settings')}
              >
                Add Allergens
              </Button>
            }
            className="bg-yellow-50 border border-yellow-500 text-yellow-800"
          >
            For better recommendations, please add any skincare allergens you want to avoid.
          </Alert>
        )}

          <Breadcrumb
          paths={[
            { name: "Home", link: "/" },
            { name: "AI Tools", link: "/ai-tools-page" },
            { name: "Skin Anaylsis", link: "/skin-analysis" },
          ]}
        />
    <div className="grid grid-cols-1 md:grid-cols-7 gap-6 mt-4 ">
    {/* Left Column */}
    <div className="md:col-span-3">
      <FaceScanResult />
      {/* <PersonalizedRoutine /> */}
      {/* <SkinHealthGauge/> */}
    </div>

    {/* Right Column */}
    <div className="md:col-span-4">
      <RecommendationsPage  />
     
    </div>
   
  </div>
  </div>
  </MainLayout>
  )
}

export default FaceScanResultPage
