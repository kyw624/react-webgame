import React, { Component } from 'react';

/*
- 클래스의 경우
  constructor -> render -> ref -> componentDidMount
  -> (setState/props 바뀔 때 >> shouldComponentUpdate >> render >> componentDidUpdate)
  -> (부모 컴포넌트가 나를 없앴을 때) componentWillUnmount -> 소멸
*/

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

class RockPaperScissorsClass extends Component {
  state = {
    result: '',
    score: 0,
    imgCoord: rpsCoords.바위,
  };

  interval;

  componentDidMount() {
    // 컴포넌트가 첫 렌더링 된 후. 여기에 비동기 요청을 많이함.
    this.interval = setInterval(this.changeHand, 100);
  }

  componentDidUpdate() {
    // 리렌더링 된 후
  }

  componentWillUnmount() {
    // 컴포넌트가 제거되기 직전. 여기에 비동기 요청 정리를 많이함.
    clearInterval(this.interval);
  }

  changeHand = () => {
    const { imgCoord } = this.state;

    if (imgCoord === rpsCoords.바위) {
      this.setState({
        imgCoord: rpsCoords.보,
      });
    } else if (imgCoord === rpsCoords.보) {
      this.setState({
        imgCoord: rpsCoords.가위,
      });
    } else if (imgCoord === rpsCoords.가위) {
      this.setState({
        imgCoord: rpsCoords.바위,
      });
    }
  };

  onClickBtn = (choice) => () => {
    clearInterval(this.interval);

    const { imgCoord } = this.state;
    const myScore = scores[choice];
    const cpuScore = scores[computerChoice(imgCoord)];
    const diff = myScore - cpuScore;

    if (diff === 0) {
      this.setState({
        result: '비겼습니다.',
      });
    } else if ([-1, 2].includes(diff)) {
      this.setState((prevState) => {
        return {
          result: '이겼습니다!',
          score: prevState.score + 1,
        };
      });
    } else {
      this.setState((prevState) => {
        return {
          result: '졌습니다...',
          score: prevState.score - 1,
        };
      });
    }
    setTimeout(() => {
      this.interval = setInterval(this.changeHand, 100);
    }, 1000);
  };

  render() {
    const { result, score, imgCoord } = this.state;

    return (
      <>
        <div
          id="computer"
          style={{
            background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0`,
          }}
        />
        <div>
          <button id="rock" className="btn" onClick={this.onClickBtn('바위')}>
            바위
          </button>
          <button id="paper" className="btn" onClick={this.onClickBtn('보')}>
            보
          </button>
          <button
            id="scissors"
            className="btn"
            onClick={this.onClickBtn('가위')}
          >
            가위
          </button>
        </div>
        <div>{result}</div>
        <div>현재 {score}점</div>
      </>
    );
  }
}

export default RockPaperScissorsClass;
