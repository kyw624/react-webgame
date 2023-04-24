import React, { useState, useRef, useEffect } from 'react';
import useInterval from './useInterval';

const rpsCoords = {
  바위: '0',
  보: '-284px',
  가위: '-142px',
};
const scores = {
  바위: 0,
  보: -1,
  가위: 1,
};

const computerChoice = (imgCoord) => {
  return Object.entries(rpsCoords).find(function (v) {
    return v[1] === imgCoord;
  })[0];
};

const RockPaperScissors = () => {
  const [result, setResult] = useState('');
  const [score, setScore] = useState(0);
  const [imgCoord, setImgCoord] = useState(rpsCoords.바위);
  const [isRunning, setIsRunning] = useState(true);

  const changeHand = () => {
    if (imgCoord === rpsCoords.바위) {
      setImgCoord(rpsCoords.보);
    } else if (imgCoord === rpsCoords.보) {
      setImgCoord(rpsCoords.가위);
    } else if (imgCoord === rpsCoords.가위) {
      setImgCoord(rpsCoords.바위);
    }
  };

  useInterval(changeHand, isRunning ? 50 : null); //  null이면 멈춤

  const onClickBtn = (choice) => () => {
    if (isRunning) {
      // 멈췄을 때 또 클릭하는 것 막기
      setIsRunning(false);

      const myScore = scores[choice];
      const cpuScore = scores[computerChoice(imgCoord)];
      const diff = myScore - cpuScore;

      if (diff === 0) {
        setResult('비겼습니다.');
      } else if ([-1, 2].includes(diff)) {
        setResult('이겼습니다!');
        setScore((prevScore) => {
          return prevScore + 1;
        });
      } else {
        setResult('졌습니다...');
        setScore((prevScore) => {
          return prevScore - 1;
        });
      }
      setTimeout(() => {
        setIsRunning(true);
      }, 1000);
    }
  };

  return (
    <>
      <div
        id="computer"
        style={{
          background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0`,
        }}
      />
      <div>
        <button id="rock" className="btn" onClick={onClickBtn('바위')}>
          바위
        </button>
        <button id="paper" className="btn" onClick={onClickBtn('보')}>
          보
        </button>
        <button id="scissors" className="btn" onClick={onClickBtn('가위')}>
          가위
        </button>
      </div>
      <div>{result}</div>
      <div>현재 {score}점</div>
    </>
  );
};

export default RockPaperScissors;
