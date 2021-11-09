import "./App.css";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";

function GuidelinesPanel({ value, index }) {
  return value === index && (
    <>
    <h3>Guidelines for borrowing books</h3>
      <ol>
        <li>Do not damage books</li>
        <li>Return all books</li>
        <li>If there are any damages, report to Joseph/Philip</li>
        <li><b>Each home may borrow up to 20 books for 4 weeks</b></li>
      </ol>
    </>
  );
}

export default GuidelinesPanel;
