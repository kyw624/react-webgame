const React = require('react');
const { useState, useRef } = React;

// class WordRelay extends ({ Component }) {}
const WordRelay = () => {
  // state = {
  //   word: '김영우',
  //   value: '',
  //   result: '',
  // };
  const [word, setWord] = useState('김영우');
  // const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const inputRef = useRef(null);

  const onSubmitForm = (e) => {
    e.preventDefault();

    // value가 onSubmit 함수 내에서만 사용되므로
    // Uncontrolled input 코드로 변환
    if (word[word.length - 1] === e.target[0].value[0]) {
      // e.target[0] === e.target.children.인풋ID
      setResult('딩동댕');
      setWord(e.target[0].value); // setWord(value);
      e.target[0].value = ''; // setValue('');
      inputRef.current.focus();
      console.log(word);
    } else {
      setResult('땡');
      // setValue('');
      e.target[0].value = ''; // setValue('');
      inputRef.current.focus();
    }
  };

  // const onChangeInput = (e) => {
  //   setValue(e.target.value);
  // };

  return (
    <>
      <div>{word}</div>
      <form onSubmit={onSubmitForm}>
        <input id="word" ref={inputRef} />{' '}
        {/* value={value} onChange={onChangeInput} */}
        <button>입력</button>
      </form>
      <div>{result}</div>
    </>
  );
};

module.exports = WordRelay;
