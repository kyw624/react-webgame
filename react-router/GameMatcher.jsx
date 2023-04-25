import React, { Component } from 'react';
import NumberBaseball from '../3.숫자야구/NumberBaseballClass';
import RockPaperScissors from '../5.가위바위보/RockPaperScissorsClass';
import Lotto from '../6.로또추첨기/LottoClass';
import { useLocation, useNavigate, Routes, Route } from 'react-router';

const GameMatcher = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let urlSearchParams = new URLSearchParams(location.search.slice(1));

  return (
    <Routes>
      <Route path="number-baseball" element={<NumberBaseball />} />
      <Route path="rock-paper-scissors" element={<RockPaperScissors />} />
      <Route path="lotto-generator" element={<Lotto />} />
      <Route path="*" element={<div>일치하는 게임이 없습니다.</div>} />
    </Routes>
  );
};

export default GameMatcher;
