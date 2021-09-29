/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { styled } from "@mui/material/styles";
import "./App.css";

import React from "react";

import { useFormik } from "formik";
import * as Yup from "yup";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CancelIcon from "@mui/icons-material/Cancel";
import Masonry from "@mui/lab/Masonry";
import MasonryItem from "@mui/lab/MasonryItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import bookPlaceholder from "./book-placeholder.png";
import endpoints from "./api";

function BookBasketPanel({
  value,
  index,
  bookBasket,
  setBookBasket,
  aboveXS,
  aboveSM,
  aboveMD,
  isSmall,
  isMedium,
  isBig,
}) {
  function onBookRemoved(book) {
    setBookBasket((x) => [...x.filter((y) => y.number !== book.number)]);
  }

  const formik = useFormik({
    initialValues: { home: "" },
    validationSchema: Yup.object({
      home: Yup.string().required("Please input a value"),
    }),
    onSubmit: (values) => {
      values["books"] = bookBasket;
      fetch(endpoints.production + "/submit-books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/html",
        },
        body: JSON.stringify(values, null, 2),
      });
    },
  });

  return (
    value === index && (
      <>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            m: 1,
            justifyContent: "center",
          }}
        >
          <form id="submitBooksForm" onSubmit={formik.handleSubmit}>
            <TextField
              sx={{ m: 1 }}
              id="home"
              {...formik.getFieldProps("home")}
              label="Name of Home"
              variant="outlined"
              size="small"
              margin="none"
              error={formik.touched.home && formik.errors.home ? true : false}
              helperText={
                formik.touched.home && formik.errors.home
                  ? formik.errors.home
                  : " "
              }
            />
          </form>

          <Button
            variant="contained"
            type="submit"
            disabled={formik.isSubmitting}
            form="submitBooksForm"
            sx={{ textTransform: "none", mt: 1.2, ml: 1 }}
          >
            Submit Form
          </Button>
        </Box>
        <Masonry columns={aboveMD ? 4 : aboveSM ? 3 : 2} gap={8}>
          {bookBasket.map((book) => (
            <MasonryItem key={book.number}>
              <div css={{ position: "relative" }}>
                <HoverableCancelIcon onClick={() => onBookRemoved(book)} />
                <Stack>
                  <img
                    width="100%"
                    src={book.imageurl || bookPlaceholder}
                    alt={book.title}
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
            </MasonryItem>
          ))}
        </Masonry>
      </>
    )
  );
}

const HoverableCancelIcon = styled(CancelIcon)({
  position: "absolute",
  top: 1,
  left: 1,
  color: "white",
  "&:hover": { color: "black" },
});

export default BookBasketPanel;
