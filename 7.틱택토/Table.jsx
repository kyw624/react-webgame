import React, { memo } from 'react';
import Tr from './Tr';

const Table = memo(({ onClick, tableData, dispatch }) => {
  return (
    <table>
      {tableData.map((tr, i) => {
        return (
          <Tr key={i} rowData={tableData[i]} rowIndex={i} dispatch={dispatch} />
        );
      })}
    </table>
  );
});

export default Table;
