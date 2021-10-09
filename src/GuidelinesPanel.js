import "./App.css";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";

function GuidelinesPanel({ value, index }) {
  return value === index && <div>Hey</div>;
}

export default GuidelinesPanel;
