import React, { useReducer, createContext, useMemo, useEffect } from 'react';
import Form from './Form';
import Table from './Table';

export const CODE = {
  // 상태 코드들 부여
  MINE: -7, // 지뢰가 있는 칸
  NORMAL: -1, // 지뢰가 없는 칸
  QUESTION: -2, // 물음표
  FLAG: -3, // 깃발
  QUESTION_MINE: -4, // 지뢰칸을 물음표로 설정
  FLAG_MINE: -5, // 지뢰칸을 깃발로 설정
  CLICKED_MINE: -6, // 지뢰칸을 클릭했을 때
  OPENED: 0, // 정상적으로 클릭했을 때, 0 이상이면 다 opened
  // OPENED: 1이면 주변에 지뢰가 1개 있는 칸
  // OPENED: 2면 주변에 지뢰가 2개 있는 칸
  // ....
};

export const TableContext = createContext({
  tableData: [],
  halted: true,
  dispatch: () => {},
});

const initialState = {
  tableData: [],
  data: {
    row: 0,
    cell: 0,
    mine: 0,
  },
  timer: 0,
  result: '',
  halted: true, // 정지된
  openedCount: 0,
};

// 지뢰를 심는 함수
const plantMine = (row, cell, mine) => {
  console.log(row, cell, mine);

  const candidate = Array(row * cell)
    .fill()
    .map((v, i) => i);
  const shuffle = [];

  // 지뢰 개수만큼 뽑아서 섞어줌.
  while (candidate.length > row * cell - mine) {
    const chosen = candidate.splice(
      Math.floor(Math.random() * candidate.length),
      1
    )[0];
    shuffle.push(chosen);
  }

  const data = [];

  // 전체 칸을 일반 칸으로 설정
  for (let i = 0; i < row; i++) {
    const rowData = [];
    data.push(rowData);
    for (let j = 0; j < cell; j++) {
      rowData.push(CODE.NORMAL);
    }
  }

  // 지뢰를 직접 심기
  for (let k = 0; k < shuffle.length; k++) {
    const ver = Math.floor(shuffle[k] / cell);
    const hor = shuffle[k] % cell;
    data[ver][hor] = CODE.MINE;
  }

  return data;
};

export const START_GAME = 'START_GAME';
export const OPEN_CELL = 'OPEN_CELL';
export const CLICK_MINE = 'CLICK_MINE';
export const FLAG_CELL = 'FLAG_CELL';
export const QUESTION_CELL = 'QUESTION_CELL';
export const NORMALIZE_CELL = 'NORMALIZE_CELL';
export const INCREMENT_TIMER = 'INCREMENT_TIMER';

const reducer = (state, action) => {
  switch (action.type) {
    case START_GAME:
      return {
        ...state,
        data: {
          row: action.row,
          cell: action.cell,
          mine: action.mine,
        },
        openedCount: 0,
        tableData: plantMine(action.row, action.cell, action.mine),
        halted: false,
        timer: 0,
      };
    case OPEN_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      tableData.forEach((row, i) => {
        tableData[i] = [...row];
      });

      const checked = [];
      let openedCount = 0; // 현재 연 누적 칸 수

      // 주변 8칸 체크하는 함수
      const checkAround = (row, cell) => {
        // 열렸거나 지뢰가 있는 칸은 안열리게
        if (
          [
            CODE.OPENED,
            CODE.FLAG_MINE,
            CODE.FLAG,
            CODE.QUESTION_MINE,
            CODE.QUESTION,
          ].includes(tableData[row][cell])
        ) {
          return;
        }

        // 상하좌우 칸이 없는 경우 필터링
        if (
          row < 0 ||
          row >= tableData.length ||
          cell < 0 ||
          cell >= tableData[0].length
        ) {
          return;
        }

        // 재귀에서 이미 검사한 칸 체크
        if (checked.includes(row + ',' + cell)) {
          // 이미 검사한 칸이면
          return;
        } else {
          checked.push(row + ',' + cell);
        }

        let around = [];

        // 맨 위 칸 검사
        if (tableData[row - 1]) {
          around = around.concat(
            tableData[row - 1][cell - 1],
            tableData[row - 1][cell],
            tableData[row - 1][cell + 1]
          );
        }
        around = around.concat(
          tableData[row][cell - 1],
          tableData[row][cell + 1]
        );
        // 맨 아래 칸 검사
        if (tableData[row + 1]) {
          around = around.concat(
            tableData[row + 1][cell - 1],
            tableData[row + 1][cell],
            tableData[row + 1][cell + 1]
          );
        }
        const count = around.filter((v) =>
          [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v)
        ).length;

        // 주변 칸 오픈
        if (count === 0) {
          if (row > -1) {
            const near = [];
            // 맨 위 칸 검사
            if (row - 1 > -1) {
              near.push([row - 1, cell - 1]);
              near.push([row - 1, cell]);
              near.push([row - 1, cell + 1]);
            }
            near.push([row, cell - 1]);
            near.push([row, cell + 1]);
            // 맨 아래 칸 검사
            if (row + 1 < tableData.length) {
              near.push([row + 1, cell - 1]);
              near.push([row + 1, cell]);
              near.push([row + 1, cell + 1]);
            }

            near.forEach((n) => {
              if (tableData[n[0]][n[1]] !== CODE.OPENED) {
                checkAround(n[0], n[1]);
              }
            });
          }
        }

        // 열려 있는 칸 중복해서 세는 것 방지
        if (tableData[row][cell] === CODE.NORMAL) {
          openedCount += 1;
        }
        tableData[row][cell] = count;
      };

      checkAround(action.row, action.cell);

      let halted = false;
      let result = '';

      // 승리 조건
      if (
        state.data.row * state.data.cell - state.data.mine ===
        state.openedCount + openedCount
      ) {
        halted = true;
        result = `${state.timer}초만에 승리하셨습니다!`;
      }

      return {
        ...state,
        tableData,
        openedCount: state.openedCount + openedCount,
        halted,
        result,
      };
    }
    case CLICK_MINE: {
      const tableData = [...state.tableData];
      tableData.forEach((row, i) => {
        row.forEach((cell, j) => {
          row[j] = CODE.CLICKED_MINE;
        });
      });

      return {
        ...state,
        tableData,
        halted: true,
        result,
      };
    }
    case FLAG_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if (tableData[action.row][action.cell] === CODE.MINE) {
        tableData[action.row][action.cell] = CODE.FLAG_MINE;
      } else {
        tableData[action.row][action.cell] = CODE.FLAG;
      }

      return {
        ...state,
        tableData,
      };
    }
    case QUESTION_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if (tableData[action.row][action.cell] === CODE.FLAG_MINE) {
        tableData[action.row][action.cell] = CODE.QUESTION_MINE;
      } else {
        tableData[action.row][action.cell] = CODE.QUESTION;
      }

      return {
        ...state,
        tableData,
      };
    }
    case NORMALIZE_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if (tableData[action.row][action.cell] === CODE.QUESTION_MINE) {
        tableData[action.row][action.cell] = CODE.MINE;
      } else {
        tableData[action.row][action.cell] = CODE.NORMAL;
      }

      return {
        ...state,
        tableData,
      };
    }
    case INCREMENT_TIMER: {
      return {
        ...state,
        timer: state.timer + 1,
      };
    }
    default:
      return state;
  }
};

const MineSearch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { tableData, halted, timer, result } = state;
  const value = useMemo(
    () => ({
      tableData: tableData,
      halted: halted,
      dispatch,
    }),
    [tableData, halted]
  );

  useEffect(() => {
    let timer;

    if (halted === false) {
      timer = setInterval(() => {
        dispatch({ type: INCREMENT_TIMER });
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [halted]);

  return (
    <TableContext.Provider value={value}>
      <Form />
      <div>{timer}</div>
      <Table />
      <div>{result}</div>
    </TableContext.Provider>
  );
};

export default MineSearch;
