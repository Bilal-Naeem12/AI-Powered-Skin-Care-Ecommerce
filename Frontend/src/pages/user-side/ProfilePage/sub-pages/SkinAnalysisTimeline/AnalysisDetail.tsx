// src/pages/AnalysisDetailPage.tsx
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import useFetchAuthData from "@/hooks/useFetchAuthData";
import { SkinHistoryEntry } from "@/types/SkinHistoryEntry";
import { ClassificationPie } from "@/component/UI/charts/ClassificationPie";
import { DetectionsBar } from "@/component/UI/charts/DetectionsBar";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from 'react-compare-slider';
export default function AnalysisDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: entry, loading } = useFetchAuthData<SkinHistoryEntry>(
    `${import.meta.env.VITE_API_BACKEND_URL}/skin-history/${id}`
  );
const severityLabelMap: Record<string, string> = {
  "level -1": "Clear",
  "level 0": "Mild",
  "level 1": "Moderate",
  "level 2": "Severe",
  "level 3": "Very Severe",
};

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (loading || !entry) return null; // spinner is optional

  const {
    scanned_image_after,
    scanned_image_before,
    classifications: { skin_type, acne_severity },
    detections,
  } = entry;
const acneSeverityLabel = severityLabelMap[acne_severity.label] || acne_severity.label;
  /* ---------- layout ---------- */
  return (
    <Card className="p-5"  >
      
<div className="w-full mb-10 flex items-center">
  {/* Left section: back arrow */}
  <div className="flex-1 pl-2">
    <IconButton onClick={() => navigate(-1)}>
      <ArrowBackIcon />
    </IconButton>
  </div>

  {/* Center section: heading */}
  <div className="flex-1 text-center">
    <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
      Analysis Report
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {new Date(entry.analyzedAt).toLocaleString()}
    </Typography>
  </div>

  {/* Right section: empty for spacing symmetry */}
  <div className="flex-1" />
</div>

      
  <div className=" flex gap-10 flex-col lg:flex-row">    {/* back button */}
 <div className=" w-full  lg:w-1/2 h-[100%]" >   

      {/* responsive hero */}
{scanned_image_before && scanned_image_after && (
  <Box
    sx={{
      width: "100%",
      maxWidth: 800,
      height: { xs: "300px", sm: "400px", md: "500px" },
      mx: "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 2,
      overflow: "hidden",
      mb: 3,
      bgcolor: "background.paper", // or remove this if not needed
    }}
  >
    <ReactCompareSlider
      itemOne={
        <ReactCompareSliderImage
          src={scanned_image_after}
          alt="After"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      }
      itemTwo={
        <ReactCompareSliderImage
          src={scanned_image_before}
          alt="Before"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      }
      style={{
        backgroundColor:"#8d88887a",
        width: "100%",
        height: "100%",
        borderRadius: 8,
      }}
    />
  </Box>
)}
</div> 
  <div className="lg:w-1/2 ">   {/* heading */}
     

      {/* key stat cards */}
      <Grid container spacing={2} sx={{ mb: { xs: 3, sm: 4 } }}>
        {[
          { title: "Skin Type", data: skin_type, color: "primary.main" },
          { title: "Acne Severity", data: acne_severity, color: "error.main" },
        ].map(({ title, data, color }) => {
             const displayLabel =
      title === "Acne Severity"
        ? severityLabelMap[data.label] || data.label
        : data.label;

         return <Grid item xs={12} sm={6} key={title}>
            <Card elevation={2} sx={{ height: "100%" }}>
              <CardContent
                sx={{ textAlign: "center", p: { xs: 1.5, sm: 2 } }}
              >
                <Typography variant="caption" color="text.secondary">
                  {title}
                </Typography>
                <Typography variant="h6" className=" capitalize">{displayLabel}</Typography>
                <Typography variant="body2" sx={{ color }}>
                  {Math.round(data.score * 100)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
})}
      </Grid>
<Box

  sx={{
    
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // center bar chart
    textAlign: "center",
    mb: 4,
  }}
>
      {/* charts */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <ClassificationPie
            title="Skin-Type Distribution"
            data={skin_type}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ClassificationPie
            title="Acne-Severity Distribution"
            data={acne_severity}
          />
        </Grid>
      

      </Grid>
      </Box>
      </div></div>
        <Grid item xs={12}>
          <DetectionsBar detections={detections} />
        </Grid>
    </Card>
  );
}
