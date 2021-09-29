/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { styled, useTheme } from "@mui/material/styles";
import "./App.css";
//I use the emotion css prop UNLESS I need to use one of the custom attributes
//that can be accessed with sx.

import React, { useState } from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import useMediaQuery from "@mui/material/useMediaQuery";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import Badge from "@mui/material/Badge";

import BrowsePanel from "./BrowsePanel";
import GuidelinesPanel from "./GuidelinesPanel";
import BookBasketPanel from "./BookBasketPanel";

function App() {
  const [value, setValue] = useState(0);
  const [bookBasket, setBookBasket] = useState([]);
  const theme = useTheme();

  const aboveXS = useMediaQuery(theme.breakpoints.up("xs"));
  const aboveSM = useMediaQuery(theme.breakpoints.up("sm"));
  const aboveMD = useMediaQuery(theme.breakpoints.up("md"));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth={aboveMD ? "md" : aboveSM ? "sm" : "xs"}>
      <Typography variant="h3" m={3} align="center">
        GVH Library
      </Typography>

      <div css={{ position: "relative" }}>
        <Tabs value={value} onChange={handleChange} centered>
          <StyledTab label="Browse" />
          <StyledTab label="Guidelines" />
        </Tabs>
        <StyledBadge badgeContent={bookBasket.length} color="primary">
          <ShoppingBasketIcon
            onClick={() => {
              setValue(2);
            }}
            color={value === 2 ? "primary" : "action"}
            fontSize="large"
          />
        </StyledBadge>
      </div>
      <BrowsePanel
        value={value}
        index={0}
        bookBasket={bookBasket}
        setBookBasket={setBookBasket}
        aboveXS={aboveXS}
        aboveSM={aboveSM}
        aboveMD={aboveMD}
        setValue={setValue}
      />
      <GuidelinesPanel value={value} index={1} />
      <BookBasketPanel
        value={value}
        index={2}
        bookBasket={bookBasket}
        setBookBasket={setBookBasket}
        aboveXS={aboveXS}
        aboveSM={aboveSM}
        aboveMD={aboveMD}
      />
    </Container>
  );
}

const StyledBadge = styled(Badge)(({ theme }) => ({
  position: "absolute",
  right: 0,
  top: 0,
  "& .MuiBadge-badge": {
    top: 13,
  },
}));

const StyledTab = styled(Tab)({
  textTransform: "none",
});

export default App;
