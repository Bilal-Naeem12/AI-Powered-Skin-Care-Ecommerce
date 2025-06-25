// src/components/ConsentForm.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Box
} from "@mui/material";

interface ConsentFormProps {
  open: boolean;
  onAgree: () => void;
  onCancel: () => void;
}

export default function ConsentForm({ open, onAgree, onCancel }: ConsentFormProps) {
  const [faceConsent, setFaceConsent] = React.useState(false);
  const [termsConsent, setTermsConsent] = React.useState(false);

  const handleAgree = () => {
    if (faceConsent && termsConsent) onAgree();
  };

  const isSubmitDisabled = !(faceConsent && termsConsent);

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
          p: 2
        }}
      >
        <DialogTitle
          sx={{ textAlign: "center", fontWeight: "bold", fontSize: 25 }}
        >
          Consent for Face Scan & AI Analysis
        </DialogTitle>

        <DialogContent sx={{ mt: 1 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            At <strong>SkinCare Pro</strong>, we use advanced AI technology to analyze your skin and track your skincare progress over time.
            Your uploaded or captured image will be securely processed and stored for analysis and progress tracking purposes.
            Please review and accept the following terms before continuing.
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={faceConsent}
                onChange={(e) => setFaceConsent(e.target.checked)}
                sx={{ color: "black", "&.Mui-checked": { color: "#FF69B4" } }}
              />
            }
            label={
              <Typography variant="body2">
                I give my consent to allow <strong>SkinCare Pro</strong> to capture and analyze my facial image using AI for skincare insights and store it for progress tracking.
              </Typography>
            }
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={termsConsent}
                onChange={(e) => setTermsConsent(e.target.checked)}
                sx={{ color: "black", "&.Mui-checked": { color: "#FF69B4" } }}
              />
            }
            label={
              <Typography variant="body2">
                I have reviewed and agree to the{" "}
                <a href="/terms" target="_blank" style={{ color: "#FF69B4", textDecoration: "underline" }}>
                  Terms of Use
                </a>{" "}
                and{" "}
                <a href="/privacy-policy" target="_blank" style={{ color: "#FF69B4", textDecoration: "underline" }}>
                  Privacy Policy
                </a>.
              </Typography>
            }
          />
          <div className="mt-5">
            
            <p className=" font-bold">Note:</p>
            <Typography variant="caption" sx={{ mt: 2, color: "gray", fontStyle: "italic" }}>
  You can remove your consent at any time from your account settings.
</Typography></div>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Button onClick={onCancel} sx={{ color: "black" }}>
            Cancel
          </Button>
          <Button
            onClick={handleAgree}
            variant="contained"
            disabled={isSubmitDisabled}
            sx={{
              backgroundColor: "#FF69B4",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#ff85c1"
              }
            }}
          >
            Agree & Continue
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
