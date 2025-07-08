import React from "react";
import {
  Box,
  Typography,
  Stack,
  Rating,
} from "@mui/material";
import { RatingBuckets } from "@/types/Product";

interface ProductRatingBreakdownProps {
  ratingBuckets: RatingBuckets | undefined;
  maxCount:number |undefined
}

const ProductRatingBreakdown: React.FC<ProductRatingBreakdownProps> = ({
  ratingBuckets,maxCount
}) => {
  const buckets = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratingBuckets?.[star as keyof RatingBuckets] ?? 0,
  }));

  const total = buckets.reduce((sum, b) => sum + b.count, 0);

  const average =
    total === 0
      ? 0
      : buckets.reduce((sum, b) => sum + b.star * b.count, 0) / total;


  const formatTotal = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
      {/* LEFT SIDE: MUI */}
      <Stack direction="column" alignItems="center">
        <Typography variant="h3">{average.toFixed(1)}</Typography>
        <Rating
          value={average}
          precision={0.5}
          readOnly
          sx={{ color: "#fbc02d" }}
        />
        <Typography variant="caption" color="text.secondary">
          {formatTotal(total)} reviews
        </Typography>
      </Stack>

      {/* RIGHT SIDE: Plain HTML */}
<div style={{ flex: 1 }}>
  {buckets.map((b) => {
    const percent = maxCount === 0 ? 0 : (b.count / maxCount) * 100;
    return (
      <div
        key={b.star}
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "6px",
        }}
      >
        <span style={{ width: "20px" }}>{b.star}</span>
        <div
          style={{
            flex: 1,
            height: "8px",
            marginLeft: "8px",
            backgroundColor: "#eee",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${percent}%`,
              height: "100%",
              backgroundColor: "#fbc02d",
            }}
          />
        </div>
      </div>
    );
  })}
</div>

    </div>
  );
};

export default ProductRatingBreakdown;
