/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import "./App.css";
import "antd/dist/antd.css";

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
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import FilterFormControl from "./FilterFormControl";
import BrowsePanelBook from "./BrowsePanelBook";

const heights = [
  150, 100, 160, 190, 110, 250, 130, 200, 130, 90, 100, 150, 190, 170, 80, 150,
  100, 150, 230, 110, 150, 130, 100, 120, 90, 100, 150, 90, 190, 110,
];
function useImageWidth(theme) {
  const widthObject = {
    md: 206,
    sm: 177,
    xs: 201,
  };

  const aboveMD = useMediaQuery(theme.breakpoints.up("md")) ? "md" : false;
  const aboveSM = useMediaQuery(theme.breakpoints.up("sm")) ? "sm" : false;
  const aboveXS = useMediaQuery(theme.breakpoints.up("xs")) ? "xs" : false;

  const which = aboveMD || aboveSM || aboveXS;
  console.log("WHICH" + widthObject[which]);
  return widthObject[which];
}
function BrowserPanel({ value, index, bookBasket, setBookBasket, setValue }) {
  const [books, setBooks] = useState([]);
  const [pageSize, setPageSize] = useState(0);
  const [isChoosing, setChoosing] = useState(false);

  const [ref, setRef] = useState();
  const { isIntersecting } = useIntersectionObserver(ref);

  const widthRef = useRef(null);
  const masonWidth = useElementWidth(widthRef, books);

  const theme = useTheme();
  const imageWidth = useImageWidth(theme);
  const aboveMD = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    console.log(masonWidth);
  }, [masonWidth]);

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

  const isChosen = useCallback(
    (bookNumber) => {
      return bookBasket.filter((x) => x.number === bookNumber).length > 0;
    },
    [bookBasket]
  );

  const onBookClicked = useCallback(
    (book) => {
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
    },
    [setBookBasket, isChosen]
  );

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
    const api =
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_DEV_API
        : process.env.REACT_APP_PRODUCTION_API;
    console.log(api);
    fetchData(api + "/initial-books", (json) => {
      setBooks(json);
    });
    fetchData(api + "/books", (json) => {
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
        <div
          css={{
            flexBasis: "100%",
            height: "0px",
            display: aboveMD ? "none" : null,
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
      >
        <div key="sizeListener" ref={widthRef} css={{ marginTop: "-10px" }}>
          <Skeleton variant="rectangular" height="0px" width="100%" />
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
                <BrowsePanelBook
                  key={book.number}
                  book={book}
                  imageWidth={imageWidth}
                  isChoosing={isChoosing}
                  isChosen={isChosen}
                  onBookClicked={onBookClicked}
                />
              ))}
        <div key="listener" ref={setRef}>
          <Skeleton variant="rectangular" height="50px" width="100%" />
        </div>
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
              color: "white",
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
        </Fab>
      </div>
    </div>
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

export default BrowserPanel;
