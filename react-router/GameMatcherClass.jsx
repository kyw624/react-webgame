import React from 'react';
import { Component } from 'react';
import NumberBaseball from '../3.숫자야구/NumberBaseballClass';
import RockPaperScissors from '../5.가위바위보/RockPaperScissorsClass';
import Lotto from '../6.로또추첨기/LottoClass';
import { Route, Routes, useLocation } from 'react-router';

class GameMatcher extends Component {
  render() {
    let urlSearchParams = new URLSearchParams(
      this.props.location.search.slice(1)
    );
    console.log(urlSearchParams.get('page'));
    return (
      <Routes>
        <Route path="number-baseball" element={<NumberBaseball />} />
        <Route path="rock-paper-scissors" element={<RockPaperScissors />} />
        <Route path="lotto-generator" element={<Lotto />} />
        <Route path="*" element={<div>일치하는 게임이 없습니다.</div>} />
      </Routes>
    );
  }
}

const WrappedComponent = (props) => {
  const location = useLocation();

  return <GameMatcher location={location} {...props} />;
};

export default WrappedComponent;
