import React, { useEffect, useState } from "react";
import axios from "axios";
import useSkinAnalysisStore from "@/store/SkinAnalysis";
import useRecommendationStore from "@/store/RecommendationStore";
import { RecommendationResponse, RoutineStep } from "@/types/Recommendation";
import RoutineSection from "@/component/UI/RecommendedProduct";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Collapse,
  Button as MuiButton,
  Skeleton,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Info, Tag, AlertCircle, XCircle, ShoppingCartIcon } from "lucide-react";
import useCartStore from "@/store/CartStore";
import { toast } from "react-toastify";

const RecommendationsPage: React.FC = () => {
  const result = useSkinAnalysisStore((state) => state.result);
  const {
    data: storedData,
    setData: storeData,
    clearData,
  } = useRecommendationStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMore, setShowMore] = useState<Record<string, boolean>>({});

 const handleAddAllToCart = () => {
  const cartStore = useCartStore.getState();

  if (!storedData || !storedData.routine) return;

  const allProducts = Object.values(storedData.routine)
    .flatMap((step) => step.products);

  const addedIds = new Set();

  allProducts.forEach((product) => {
    // prevent duplicate addition during single session
    if (!addedIds.has(product._id) && !cartStore.isProductInCart(product._id)) {
      cartStore.addProductToCart(product, 1);
      addedIds.add(product._id);
    }
  });

  if (addedIds.size > 0) {
  } else {
    toast.info("All recommended products are already in your cart.", {
      position: "bottom-center",
    });
  }
};

  const beautifyProblem = (problem: string) =>
    problem === "Dark Circles" ? "Puffy Eyes" : problem;

  if (!result)
    return (
      <p className="text-center py-10 text-gray-600 flex items-center justify-center gap-2">
        <AlertCircle className="w-5 h-5 text-gray-500" /> Run skin analysis first.
      </p>
    );

  if (loading)
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton variant="rectangular" height={50} />
            <Skeleton variant="rectangular" height={160} />
          </div>
        ))}
      </div>
    );

  if (error)
    return (
      <p className="text-center text-red-500 py-10 flex items-center justify-center gap-2">
        <XCircle className="w-4 h-4" /> {error}
      </p>
    );

  if (!storedData || !storedData.success)
    return (
      <p className="text-center py-10 text-gray-600 flex items-center justify-center gap-2">
        <AlertCircle className="w-5 h-5 text-gray-500" /> No recommendation data returned.
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Personalized Routine</h2>

      <div className="bg-white rounded-md shadow px-5 py-4 mb-6 border border-gray-200">
        <div className="flex items-center gap-2 text-gray-800 mb-2">
          <Info className="w-4 h-4" />
          <span className="text-md">
            Skin Type: <strong className="text-pink-600">{storedData.skinType}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-800">
          <Tag className="w-4 h-4" />
          <span className="text-md">
            Concerns:{" "}
            <strong className="text-pink-600">
              {storedData.problemsDetected.map(beautifyProblem).join(", ")}
            </strong>
          </span>
        </div>
      </div>


      <div className="space-y-5">
        {Object.entries(storedData.routine).map(([stepKey, step], index) => {
          const typedStep: RoutineStep = step;

          return typedStep && typedStep.products.length > 0 ? (
            <Accordion key={stepKey} defaultExpanded={index === 0}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" className="text-gray-800 font-semibold">
                  STEP {index + 1}: {typedStep.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ maxHeight: "auto", pr: 1 }}>
                  <RoutineSection
                    stepKey={stepKey}
                    step={{ ...typedStep, products: [typedStep.products[0]] }}
                  />

                  {typedStep.products.length > 1 && (
                    <>
                      <Collapse in={showMore[stepKey]}>
                        <div className="grid sm:grid-cols-2 gap-4 mt-4">
                          {typedStep.products.slice(1).map((product) => (
                            <RoutineSection
                              key={product._id}
                              stepKey={stepKey}
                              step={{ ...typedStep, products: [product] }}
                            />
                          ))}
                        </div>
                      </Collapse>
                      <MuiButton
                        onClick={() =>
                          setShowMore((prev) => ({
                            ...prev,
                            [stepKey]: !prev[stepKey],
                          }))
                        }
                        variant="outlined"
                        size="small"
                        sx={{
                          mt: 2,
                          borderColor: "#FF69B4",
                          color: "#FF69B4",
                          textTransform: "none",
                        }}
                      >
                        {showMore[stepKey] ? "Hide Alternatives" : "Show More Options"}
                      </MuiButton>
                    </>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          ) : (
            <Accordion key={stepKey} disabled>
              <AccordionSummary>
                <Typography variant="h6" className="text-gray-400">
                  STEP {index + 1}: {typedStep?.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography className="text-sm text-gray-500 italic flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> No suitable product found for this step.
                </Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
      <div className="flex justify-end mt-8">
  <MuiButton
    variant="contained"
    size="large"
    sx={{
      backgroundColor: "#FF69B4",
      color: "#fff",
      textTransform: "none",
      px: 4,
      py: 1.5,
      "&:hover": {
        backgroundColor: "#e0559f",
      },
    }}
    onClick={() => handleAddAllToCart()}
  >
    <ShoppingCartIcon className="mr-2" />
    Add All to Cart
  </MuiButton>
</div>
    </div>
  );
};

export default RecommendationsPage;
