import React, { useState, useRef } from 'react';

const ResponseCheck = () => {
  const [status, setStatus] = useState('waiting');
  const [message, setMessage] = useState('클릭해서 시작하세요.');
  const [result, setResult] = useState([]);
  const timeout = useRef(null);
  const startTime = useRef();
  const endTime = useRef();

  const onClickScreen = () => {
    if (status === 'waiting') {
      setStatus('ready');
      setMessage('초록색이 되면 클릭하세요.');

      timeout.current = setTimeout(
        () => {
          setStatus('now');
          setMessage('지금 클릭!');
          startTime.current = new Date(); // state에 작성하면 바뀌면 렌더링되므로
        },
        Math.floor(Math.random() * 1000) + 2000 // 2초~3초 랜덤
      );
    } else if (status === 'ready') {
      // 성급하게 클릭
      clearTimeout(timeout.current); // setTimeout 제거

      setStatus('waiting');
      setMessage('너무 성급하시군요! 초록색이 된 후에 클릭하세요.');
    } else if (status === 'now') {
      // 반응속도 체크
      endTime.current = new Date();

      setStatus('waiting');
      setMessage('클릭해서 시작하세요..');
      setResult((prevResult) => {
        return [...prevResult, endTime.current - startTime.current];
      });
    }
  };

  const onReset = () => {
    setResult([]);
  };

  const renderAverage = () => {
    return result.length === 0 ? null : (
      <>
        <div>
          평균 시간: {result.reduce((acc, cur) => acc + cur) / result.length}
          ms
        </div>
        <button onClick={onReset}>초기화</button>
      </>
    );
  };

  return (
    <>
      <div id="screen" className={status} onClick={onClickScreen}>
        {message}
        <h1>{result[result.length - 1]}</h1>
      </div>
      {renderAverage()}
    </>
  );
};

export default ResponseCheck;
