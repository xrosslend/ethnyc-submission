import React from "react";

import { Routes, Route } from "react-router-dom";
import { IndexPage } from "./pages/index.js";
import { BorrowPage } from "./pages/borrow.js";
import { MyPage } from "./pages/my.js";
import { LendPage } from "./pages/lend.js";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/my" element={<MyPage />} />
      <Route path="/borrow" element={<BorrowPage />} />
      <Route path="/lend" element={<LendPage />} />
    </Routes>
  );
};

export default App;
