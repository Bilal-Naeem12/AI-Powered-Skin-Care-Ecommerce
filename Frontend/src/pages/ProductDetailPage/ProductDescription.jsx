import React, { useState } from "react";
import { Collapse, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ProductDescription = () => {
  const [expandDescription, setExpandDescription] = useState(true);
  const [expandDetails, setExpandDetails] = useState(false);

  return (
    <div className="mt-8">
      <div>
        <div className="flex items-center justify-between cursor-pointer">
          <h2 className="text-xl font-bold">Description</h2>
          <IconButton onClick={() => setExpandDescription(!expandDescription)}>
            <ExpandMoreIcon />
          </IconButton>
        </div>
        <Collapse in={expandDescription}>
          <p className="text-gray-600 mt-2">
            Use our lovely beauty products to make a striking appearance that leaves people
            wondering about your gorgeous look...
          </p>
        </Collapse>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between cursor-pointer">
          <h2 className="text-xl font-bold">Additional Details</h2>
          <IconButton onClick={() => setExpandDetails(!expandDetails)}>
            <ExpandMoreIcon />
          </IconButton>
        </div>
        <Collapse in={expandDetails}>
          <p className="text-gray-600 mt-2">
            Natural ingredients like organic rose, coconut oil, aloe vera, peppermint...
          </p>
        </Collapse>
      </div>
    </div>
  );
};

export default ProductDescription;
