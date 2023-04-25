import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import GameMatcher from './GameMatcher';

const Games = () => {
  return (
    <BrowserRouter>
      <div>
        <Link to="/game/number-baseball">숫자야구</Link>
        &nbsp;
        <Link to="/game/rock-paper-scissors">가위바위보</Link>
        &nbsp;
        <Link to="/game/lotto-generator">로또추첨기</Link>
        &nbsp;
        <Link to="/game/index">게임 매쳐</Link>
      </div>
      <div>
        <Routes>
          <Route path="/" element={<GameMatcher />} />
          <Route path="/game/*" element={<GameMatcher />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default Games;
