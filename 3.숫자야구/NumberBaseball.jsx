// const React = require('react');
// const { Component } = React;
import React, { useState, useRef } from 'react';
import Try from './Try';

// 숫자 4개를 랜덤하게 뽑는 함수
function getNumbers() {
  const candidate = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const array = [];

  for (let i = 0; i < 4; i += 1) {
    const chosen = candidate.splice(Math.floor(Math.random() * (9 - i)), 1)[0];
    array.push(chosen);
  }

  return array;
}

const NumberBaseball = () => {
  const [value, setValue] = useState('');
  const [answer, setAnswer] = useState(getNumbers);
  const [result, setResult] = useState('');
  const [tries, setTries] = useState([]);

  const onSubmitForm = (e) => {
    e.preventDefault();

    if (value === answer.join('')) {
      setResult('홈런!');
      setTries((prevTries) => {
        return [...prevTries, { try: value, result: '홈런!' }];
      });

      alert('게임을 다시 시작합니다!');
      setValue('');
      setAnswer(getNumbers());
      setTries([]);
    } else {
      // 답 틀렸으면
      const answerArray = value.split('').map((v) => parseInt(v));
      let strike = 0;
      let ball = 0;

      if (tries.length >= 9) {
        // 10번 이상 틀렸을 때
        setResult(
          `10번 넘게 틀려서 실패! 정답은 ${answer.join(', ')} 였습니다!`
        );

        alert('게임을 다시 시작합니다!');
        setValue('');
        setAnswer(getNumbers());
        setTries([]);
      } else {
        for (let i = 0; i < 4; i += 1) {
          if (answerArray[i] === answer[i]) {
            strike += 1;
          } else if (answer.includes(answerArray[i])) {
            ball += 1;
          }
        }
        setTries((prevTries) => {
          return [
            ...prevTries,
            {
              try: value,
              result: `${strike} 스트라이크 / ${ball} 볼`,
            },
          ];
        });
        setValue('');
      }
    }
  };

  const onChangeInput = (e) => {
    setValue(e.target.value);
  };

  const inputRef = useRef();

  return (
    <>
      <h1>{result}</h1>
      <form onSubmit={onSubmitForm}>
        <input
          maxLength={4}
          ref={inputRef}
          value={value}
          onChange={onChangeInput}
        />
      </form>
      <div>시도: {tries.length}</div>
      <ul>
        {tries.map((v, i) => {
          return <Try key={`${i + 1}차 시도`} tryInfo={v} />;
        })}
      </ul>
    </>
  );
};

export default NumberBaseball; // import NumberBaseball;
