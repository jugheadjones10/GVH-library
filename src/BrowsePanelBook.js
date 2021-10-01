/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import "./App.css";
import "antd/dist/antd.css";

import React from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckIcon from "@mui/icons-material/Check";

import bookPlaceholder from "./book-placeholder.png";
import ImageLoad from "./ImageLoad";

function BrowsePanelBook({
  book,
  masonWidth,
  isChoosing,
  isChosen,
  onBookClicked,
}) {
  return (
    <div
      key={book.number}
      onClick={() => {
        if (isChoosing) {
          onBookClicked(book);
        }
      }}
      css={{ position: "relative" }}
    >
      {isChoosing &&
        (isChosen(book.number) ? (
          <Box
            sx={{
              bgcolor: "text.secondary",
              position: "absolute",
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CheckIcon fontSize="large" css={{ color: "white" }} />
          </Box>
        ) : (
          <CheckBoxOutlineBlankIcon
            fontSize="large"
            css={{
              position: "absolute",
              color: "white",
              top: 10,
              left: 10,
            }}
          />
        ))}
      <Stack>
        <ImageLoad
          src={
            book.imageurl
              ? processUrl(book.imageurl, masonWidth)
              : bookPlaceholder
          }
        />
        <Box
          sx={{
            color: "white",
            p: 1,
            bgcolor: "text.secondary",
          }}
        >
          {book.title}
        </Box>
      </Stack>
    </div>
  );
}

function processUrl(url, width) {
  return `https://gvh-library.b-cdn.net/signature/width:${width}/resizing_type:fill/format:webp/plain/${encodeURIComponent(
    url
  )}`;
}

export default React.memo(BrowsePanelBook);
