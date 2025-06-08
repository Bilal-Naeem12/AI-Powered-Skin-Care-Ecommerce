import React, { useEffect } from "react";
import usePostAuthData from "@/hooks/usePostAuthData";
import useSkinAnalysisStore from "@/store/useSkinAnalysis";
import { RecommendationResponse, RoutineStep } from "@/types/Recommendation";
import RoutineSection from "@/component/UI/RecommendedProduct";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import FaceIcon from "@mui/icons-material/Face";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { CrossIcon } from "lucide-react";
import useUserStore from "@/store/useUserStore";

const RecommendationsPage: React.FC = () => {
  const result = useSkinAnalysisStore((state) => state.result);
  const {user} = useUserStore();
  const userId = user?._id;


  const { data, loading, error, postData } = usePostAuthData<
    RecommendationResponse,
    any
  >();


  const { data:historyData, loading:historyLoading, error:historyError, postData:historyPost } = usePostAuthData<
    any,
    any
  >();
  useEffect(() => {



    if (result) {
      const minimized = {
        classifications: result.classifications,
        detections: {
          acne: result.detections.acne.objects?.at(0),
          puffy_eyes: result.detections.puffy_eyes.objects?.at(0),
        },
      };
      postData(`${import.meta.env.VITE_API_BACKEND_URL}/products/recommend`, minimized);



    }
  }, [result]);


    useEffect(() => {
    if (!data?.success || !userId || !result) return;

    // flatten out all recommended product IDs
    const recIds = Object.values(data.routine)
      .flatMap((step: RoutineStep) =>
        step?.products.map((p) => p._id) ?? []
      );
 const minimized = {
        classifications: result.classifications,
        detections: {
          acne: result.detections.acne.objects?.at(0),
          puffy_eyes: result.detections.puffy_eyes.objects?.at(0),
        },
      };
    // payload matches your SkinAnalysisHistorySchema
    const historyPayload = {
      scanned_image:   result.scanned_image,
      detections:      minimized.detections,
      classifications: minimized.classifications,
      // hydrationLevel:  null,
      // uvExposureIndex: null,
      recommendations: recIds,
      analyzedAt:      new Date(),
    };

     historyPost(`${import.meta.env.VITE_API_BACKEND_URL}/skin-history/user/${userId}`, historyPayload);

 
  }, [data, userId, result]);


  if (!result) return <p className="text-center py-10 text-gray-600">🔍 Run skin analysis first.</p>;
  if (loading) return <div className="w-max m-auto"><CircularProgress/></div>;
  if (error) return <p className="text-center text-red-500 py-10"><CrossIcon/> {error}</p>;
  if (!data || !data.success) return <p className="text-center py-10 text-gray-600">No data returned.</p>;

  const beautifyProblem = (problem: string) =>
    problem === "Dark Circles" ? "Puffy Eyes" : problem;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
        Your Personalized Products
      </h2>

      <div className="bg-gray-50 rounded-md shadow-sm px-4 py-4 mb-8 border border-gray-200">
        <div className="flex items-center gap-2 mb-2 text-gray-800">
          <InfoIcon fontSize="small" />
          <span className="text-md font-medium">
            Skin Type: <strong>{data.skinType}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-800">
          <LocalOfferIcon fontSize="small" />
          <span className="text-md font-medium">
            Concerns:{" "}
            <strong>{data.problemsDetected.map(beautifyProblem).join(", ")}</strong>
          </span>
        </div>
      </div>

      {/* Collapsible routine steps with scrollable panels */}
      <div className="space-y-4">
        {Object.entries(data.routine).map(([stepKey, step], index) =>
          step ? (
            <Accordion key={stepKey} defaultExpanded={index === 0}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" fontWeight="bold" className="text-lg text-gray-900">
                  {`STEP ${index + 1}: ${step.title}`}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ maxHeight: 400, overflowY: "auto", pr: 1 }}>
                  <RoutineSection stepKey={stepKey} step={step} />
                </Box>
              </AccordionDetails>
            </Accordion>
          ) : null
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;
