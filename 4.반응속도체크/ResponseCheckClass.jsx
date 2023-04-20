import React, { Component } from 'react';

class ResponseCheckClass extends Component {
  state = {
    status: 'waiting',
    message: '클릭해서 시작하세요.',
    result: [],
  };

  timeout;
  startTime;
  endTime;

  onClickScreen = () => {
    const { status, message, result } = this.state;

    if (status === 'waiting') {
      this.setState({
        status: 'ready',
        message: '초록색이 되면 클릭하세요.',
      });

      this.timeout = setTimeout(
        () => {
          this.setState({
            status: 'now',
            message: '지금 클릭!',
          });

          this.startTime = new Date(); // state에 작성하면 바뀌면 렌더링되므로
        },
        Math.floor(Math.random() * 1000) + 2000 // 2초~3초 랜덤
      );
    } else if (status === 'ready') {
      // 성급하게 클릭
      clearTimeout(this.timeout); // setTimeout 제거

      this.setState({
        status: 'waiting',
        message: '너무 성급하시군요! 초록색이 된 후에 클릭하세요.',
      });
    } else if (status === 'now') {
      // 반응속도 체크
      this.endTime = new Date();

      this.setState((prevState) => {
        return {
          status: 'waiting',
          message: '클릭해서 시작하세요..',
          result: [...prevState.result, this.endTime - this.startTime],
        };
      });
    }
  };

  onReset = () => {
    this.setState({
      result: [],
    });
  };

  renderAverage = () => {
    const { result } = this.state;

    return result.length === 0 ? null : (
      <>
        <div>
          평균 시간: {result.reduce((acc, cur) => acc + cur) / result.length}
          ms
        </div>
        <button onClick={this.onReset}>초기화</button>
      </>
    );
  };

  render() {
    const { status, message, result } = this.state;

    return (
      <>
        <div id="screen" className={status} onClick={this.onClickScreen}>
          {message}
          <h1>{result[result.length - 1]}</h1>
        </div>
        {this.renderAverage()}
      </>
    );
  }
}

export default ResponseCheckClass;
