// src/components/UI/PageOverlay.tsx
import React, { useEffect, useState } from "react";
import { Backdrop, CircularProgress } from "@mui/material";

interface PageOverlayProps {
  show: boolean;
  onClose?: () => void;
}

const PageOverlay: React.FC<PageOverlayProps> = ({ show, onClose }) => {
  const [internalShow, setInternalShow] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (show) {
      setInternalShow(true); // instantly show
    } else {
      timer = setTimeout(() => {
        setInternalShow(false); // after 2 sec hide
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (onClose) onClose();
      }, 2000);
    }

    return () => clearTimeout(timer);
  }, [show, onClose]);

  return (
    <Backdrop
      open={internalShow}
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.modal + 2,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(6px)",
        transition: "opacity 0.3s ease",
      }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default PageOverlay;
