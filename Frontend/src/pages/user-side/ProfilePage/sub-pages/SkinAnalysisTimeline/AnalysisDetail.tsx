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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (loading || !entry) return null; // spinner is optional

  const {
    scanned_image_after,
    scanned_image_before,
    classifications: { skin_type, acne_severity },
    detections,
  } = entry;

  /* ---------- layout ---------- */
  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, sm: 4 } }}>
      {/* back button */}
      <IconButton onClick={() => navigate(-1)} sx={{ mb: { xs: 1, sm: 2 } }}>
        <ArrowBackIcon />
      </IconButton>

      {/* responsive hero */}
{scanned_image_before && scanned_image_after ? (
  <Box
    sx={{
      width: "100%",
      maxHeight: { xs: "40vh", sm: "60vh" },
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 2,
      overflow: "hidden",
      mb: 3,
    }}
  >
    <ReactCompareSlider
      itemOne={
        <ReactCompareSliderImage
          src={scanned_image_after}
          alt="After"
        />
      }
      itemTwo=
      {
        <ReactCompareSliderImage
          src={scanned_image_before}
          alt="Before"
        />
      }
      style={{ width: '100%', height: '100%' }}
    />
  </Box>
) : (
  <Box
    sx={{
      width: "100%",
      maxHeight: { xs: "40vh", sm: "60vh" },
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 2,
      overflow: "hidden",
      mb: 3,
    }}
  >
    <ReactCompareSlider
      itemOne={
        <ReactCompareSliderImage
          src="https://react-compare-image.yuuniworks.com/assets/image1-AfeGEJJ8.png"
          alt="Sample Before"
        />
      }
      itemTwo={
        <ReactCompareSliderImage
          src="https://react-compare-image.yuuniworks.com/assets/image2-jyH0KfF8.png"
          alt="Sample After"
        />
      }
    />
  </Box>
)}

      {/* heading */}
      <Typography variant={isMobile ? "h5" : "h4"} sx={{ mt: 3 }}>
        Analysis Report
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {new Date(entry.analyzedAt).toLocaleString()}
      </Typography>

      <Divider sx={{ my: { xs: 2.5, sm: 3 } }} />

      {/* key stat cards */}
      <Grid container spacing={2} sx={{ mb: { xs: 3, sm: 4 } }}>
        {[
          { title: "Skin Type", data: skin_type, color: "primary.main" },
          { title: "Acne Severity", data: acne_severity, color: "error.main" },
        ].map(({ title, data, color }) => (
          <Grid item xs={12} sm={6} key={title}>
            <Card elevation={2} sx={{ height: "100%" }}>
              <CardContent
                sx={{ textAlign: "center", p: { xs: 1.5, sm: 2 } }}
              >
                <Typography variant="caption" color="text.secondary">
                  {title}
                </Typography>
                <Typography variant="h6">{data.label}</Typography>
                <Typography variant="body2" sx={{ color }}>
                  {Math.round(data.score * 100)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
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
        <Grid item xs={12}>
          <DetectionsBar detections={detections} />
        </Grid>

      </Grid>
      </Box>
    </Container>
  );
}
