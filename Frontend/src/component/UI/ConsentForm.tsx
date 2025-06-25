// src/components/ConsentForm.tsx
import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Checkbox, FormControlLabel, Button
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
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Terms & Conditions</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Vichy will process personal information about you to provide analysis and recommendations.
          Selfie will be deleted after analysis.{" "}
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              checked={faceConsent}
              onChange={(e) => setFaceConsent(e.target.checked)}
            />
          }
          label={
            <Typography variant="body2">
              I consent to the scanning of my face and processing of my image as described in the{" "}
              <a href="/ai-info" target="_blank">SkinConsult AI Information Notice</a>.
            </Typography>
          }
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={termsConsent}
              onChange={(e) => setTermsConsent(e.target.checked)}
            />
          }
          label={
            <Typography variant="body2">
              I agree that I have reviewed the{" "}
              <a href="/terms" target="_blank">Terms of Use</a> and I am 18+ and a US resident.
            </Typography>
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          onClick={handleAgree}
          variant="contained"
          disabled={isSubmitDisabled}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
