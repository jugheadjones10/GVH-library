import React, { useState, useEffect } from "react";

import Skeleton from "@mui/material/Skeleton";

function ImageLoad({ src }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // start loading original image
    const imageToLoad = new Image();
    imageToLoad.src = src;
    imageToLoad.onload = () => {
      // When image is loaded replace the src and set loading to false
      setLoading(false);
    };
  }, [src]);

  return loading ? (
    <Skeleton variant="rectangular" height={250} />
  ) : (
    <img width="100%" alt="hey" loading="lazy" src={src} />
  );
}
export default React.memo(ImageLoad);
