/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import "./App.css";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";

import useIntersectionObserver from "@react-hook/intersection-observer";
import FlexSearch from "flexsearch";
import Masonry from "react-masonry-css";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckIcon from "@mui/icons-material/Check";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
// import Masonry from "@mui/lab/Masonry";
import MasonryItem from "@mui/lab/MasonryItem";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from "@mui/material/styles";

import bookPlaceholder from "./book-placeholder.png";
import endpoints from "./api";

const heights = [
  150, 100, 160, 190, 110, 250, 130, 200, 130, 90, 100, 150, 190, 170, 80, 150,
  100, 150, 230, 110, 150, 130, 100, 120, 90, 100, 150, 90, 190, 110,
];

function BrowserPanel({
  value,
  index,
  bookBasket,
  setBookBasket,
  aboveXS,
  aboveSM,
  aboveMD,
  setValue,
}) {
  const theme = useTheme();
  const [books, setBooks] = useState([]);

  const [pageSize, setPageSize] = useState(0);
  const [isChoosing, setChoosing] = useState(false);

  const [ref, setRef] = useState();
  const { isIntersecting } = useIntersectionObserver(ref);

  const widthRef = useRef(null);
  const masonWidth = useElementWidth(widthRef, books);

  useEffect(() => {
    setPageSize((size) => size + 20);
  }, [isIntersecting]);

  //Search
  const [search, setSearch] = useState("");
  const processedBooks = useSearch(books, search);

  //Filter
  const [series, setSeries] = useState("");
  const [language, setLanguage] = useState("");
  const [category, setCategory] = useState("");

  //Potential error - if the monitor is too big, the "isIntersecting dummy div" might be visible in viewport
  //even though 20 elements are displayed. That means there will be no more changes to "isIntersecting"
  //when search or filters are changed, and page size will be stuck at 20
  useEffect(() => {
    setPageSize(20);
  }, [value, search, series, language, category]);

  const categories = useMemo(
    () => [...new Set(books.map((x) => x.category).filter((x) => x))],
    [books]
  );
  const serieses = useMemo(
    () => [...new Set(books.map((x) => x.series).filter((x) => x))],
    [books]
  );
  const languages = useMemo(
    () => [...new Set(books.map((x) => x.language).filter((x) => x))],
    [books]
  );

  function filterFunction(book) {
    return (
      (book.series === series || series.length === 0) &&
      (book.language === language || language.length === 0) &&
      (book.category === category || category.length === 0)
    );
  }

  function onBookClicked(book) {
    if (isChosen(book.number)) {
      setBookBasket((x) => x.filter((y) => y.number !== book.number));
    } else {
      setBookBasket((x) => {
        if (x.length === 30) {
          alert("You cannot choose more than 30 books");
          return x;
        } else {
          return [...x, book];
        }
      });
    }
  }

  function isChosen(bookNumber) {
    return bookBasket.map((x) => x.number).includes(bookNumber);
  }

  useEffect(() => {
    async function fetchData(url, processResponse) {
      try {
        const response = await fetch(url, { mode: "cors" });
        const json = await response.json();
        processResponse(json);
      } catch (error) {
        console.log(error);
        alert(error);
      }
    }
    fetchData(endpoints.production + "/initial-books", (json) => {
      setBooks(json);
    });
    fetchData(endpoints.production + "/books", (json) => {
      setBooks((prev) => prev.concat(json));
    });
  }, []);

  //add shuffle button
  return (
    <div css={{ display: value === index ? null : "none" }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          m: 1,
          justifyContent: "left",
          alignItems: "flex-start",
        }}
      >
        <TextField
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
          variant="outlined"
          size="small"
          label="Search"
          helperText=" "
          sx={{ m: 1, width: { xs: "100%", sm: 200 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearch("")}>
                  <ClearIcon fontSize="inherit" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <FilterFormControl
          value={category}
          setValue={setCategory}
          options={categories}
          label="Category"
        />
        <FilterFormControl
          value={series}
          setValue={setSeries}
          options={serieses}
          label="Series"
        />
        <FilterFormControl
          value={language}
          setValue={setLanguage}
          options={languages}
          label="Language"
        />
      </Box>
      <Masonry
        breakpointCols={{
          [theme.breakpoints.values.xl]: 4,
          [theme.breakpoints.values.md]: 3,
          [theme.breakpoints.values.sm]: 2,
        }}
        className="masonry"
        columnClassName="masonry-column"
        css={{ overflow: "visible" }}
        // columns={aboveMD ? 4 : aboveSM ? 3 : 2}
        // gap={8}
      >
        <div key="sizeListener" ref={widthRef}>
          <Skeleton variant="rectangular" height="5px" width="100%" />
        </div>
        {processedBooks.length === 0 && books.length === 0
          ? heights.map((height, index) => (
              <div key={index}>
                <Skeleton variant="rectangular" height={height} />
              </div>
            ))
          : processedBooks
              .filter(filterFunction)
              .slice(0, pageSize)
              .map((book) => (
                <div
                  key={book.number}
                  onClick={(e) => {
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
                    {/* <img */}
                    {/*   loading="lazy" */}
                    {/*   width="100%" */}
                    {/*   src={ */}
                    {/*     book.imageurl */}
                    {/*       ? processUrl(book.imageurl, masonWidth) */}
                    {/*       : bookPlaceholder */}
                    {/*   } */}
                    {/*   alt={book.title} */}
                    {/* /> */}

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
              ))}
        <div width="100%" key="listener" ref={setRef} />
      </Masonry>
      <a href="#top">
        <KeyboardArrowUpIcon
          css={{
            bottom: 20,
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
          }}
          color="action"
          fontSize="large"
        />
      </a>
      <div
        css={{
          bottom: 20,
          right: 20,
          position: "fixed",
          display: "flex",
          alignItems: "center",
        }}
      >
        {isChoosing && (
          <Fab
            variant="extended"
            onClick={() => setValue(2)}
            color="primary"
            sx={{
              mr: 1,
              textTransform: "none",
            }}
          >
            Checkout Books
          </Fab>
        )}
        <Fab
          onClick={() => setChoosing((choosing) => !choosing)}
          color={isChoosing ? "text.secondary" : "primary"}
        >
          {isChoosing ? (
            <ClearIcon />
          ) : (
            <AddIcon
              css={{
                color: "white",
              }}
            />
          )}
          {
            //          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            //Choose Books
            // </Typography>
          }
        </Fab>
      </div>
    </div>
  );
}

function FilterFormControl({ value, setValue, options, label }) {
  return (
    <FormControl size="small" sx={{ m: 1, width: 150 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={(event) => {
          setValue(event.target.value);
        }}
      >
        <MenuItem value="" sx={{ color: "text.disabled" }}>
          None
        </MenuItem>
        {options.map((option) => {
          return <MenuItem value={option}>{option}</MenuItem>;
        })}
      </Select>
    </FormControl>
  );
}

function useElementWidth(ref, books) {
  const [width, setWidth] = useState(0);

  const onResize = useCallback(() => {
    const node = ref.current;
    if (node) {
      setWidth(node.offsetWidth);
    }
  }, [ref]);

  useEffect(() => {
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);

  useEffect(() => onResize(), [books]);

  return width;
}

function useSearch(items, searchTerm) {
  const [flexIndex, setFlexIndex] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const index = new FlexSearch.Index({
      preset: "match",
      tokenize: "forward",
    });
    items.forEach(({ title }, i) => {
      index.add(i, title);
    });
    setFlexIndex(index);
  }, [items]);

  useEffect(() => {
    if (flexIndex !== null) {
      setResults(flexIndex.search(searchTerm).map((index) => items[index]));
    }
  }, [searchTerm, items, flexIndex]);

  return searchTerm.length === 0 ? items : results;
}

function processUrl(url, width) {
  return `https://gvh-library.b-cdn.net/signature/width:${width}/resizing_type:fill/format:webp/plain/${encodeURIComponent(
    url
  )}`;
}

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
    <img
      alt="hey"
      loading="lazy"
      src={src}
      style={{
        opacity: loading ? 0.5 : 1,
        transition: "opacity .15s linear",
      }}
    />
  );
}

export default BrowserPanel;
