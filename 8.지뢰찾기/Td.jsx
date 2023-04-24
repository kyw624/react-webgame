import React, { useContext, useCallback, memo, useMemo } from 'react';
import {
  TableContext,
  CODE,
  OPEN_CELL,
  CLICK_MINE,
  FLAG_CELL,
  QUESTION_CELL,
  NORMALIZE_CELL,
} from './MineSearch';

// MINE: 💣 or 🧨
// QUESTION: ❓
// FLAG: 🚩
const getTdStyle = (code) => {
  switch (code) {
    case CODE.NORMAL:
    case CODE.MINE:
      return {
        background: '#999',
      };
    case CODE.OPENED:
      return {
        background: 'white',
      };
    case CODE.CLICKED_MINE:
      return {
        background: 'white',
      };
    case CODE.FLAG:
    case CODE.FLAG_MINE:
      return {
        background: 'skyblue',
      };
    case CODE.QUESTION:
    case CODE.QUESTION_MINE:
      return {
        background: 'orange',
      };
    default:
      return {
        background: 'white',
      };
  }
};

const getTdText = (code) => {
  console.log('getTdText');
  switch (code) {
    case CODE.NORMAL:
      return '';
    case CODE.MINE:
      return '💣';
    case CODE.CLICKED_MINE:
      return '💥';
    case CODE.FLAG:
    case CODE.FLAG_MINE:
      return '🚩';
    case CODE.QUESTION:
    case CODE.QUESTION_MINE:
      return '❓';
    default:
      return code || '';
  }
};

const Td = memo(({ rowIndex, cellIndex }) => {
  const { tableData, halted, dispatch } = useContext(TableContext);

  const onClickTd = useCallback(() => {
    if (halted) {
      return;
    }

    switch (tableData[rowIndex][cellIndex]) {
      case CODE.OPENED:
      case CODE.FLAG:
      case CODE.FLAG_MINE:
      case CODE.QUESTION:
      case CODE.QUESTION_MINE:
        return;
      case CODE.NORMAL:
        dispatch({ type: OPEN_CELL, row: rowIndex, cell: cellIndex });
        return;
      case CODE.MINE:
        dispatch({ type: CLICK_MINE, row: rowIndex, cell: cellIndex });
      default:
        return;
    }
  }, [tableData[rowIndex][cellIndex], halted]);

  const onRightClickTd = useCallback(
    (e) => {
      e.preventDefault(); // 우클릭 메뉴 방지
      if (halted) {
        return;
      }

      switch (tableData[rowIndex][cellIndex]) {
        case CODE.NORMAL:
        case CODE.MINE:
          dispatch({ type: FLAG_CELL, row: rowIndex, cell: cellIndex });
          return;
        case CODE.FLAG:
        case CODE.FLAG_MINE:
          dispatch({ type: QUESTION_CELL, row: rowIndex, cell: cellIndex });
          return;
        case CODE.QUESTION:
        case CODE.QUESTION_MINE:
          dispatch({ type: NORMALIZE_CELL, row: rowIndex, cell: cellIndex });
          return;
        default:
          return;
      }
    },
    [tableData[rowIndex][cellIndex], halted]
  );
  console.log('TD RENDERED');
  return useMemo(
    () => (
      <td
        style={getTdStyle(tableData[rowIndex][cellIndex])}
        onClick={onClickTd}
        onContextMenu={onRightClickTd}
      >
        {getTdText(tableData[rowIndex][cellIndex])}
      </td>
    ),
    [tableData[rowIndex][cellIndex]]
  );
});

export default Td;
