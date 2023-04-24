import React, { memo, useEffect, useRef } from 'react';
import Td from './Td';

const Tr = memo(({ rowData, rowIndex, dispatch }) => {
  const ref = useRef([]);
  useEffect(() => {
    console.log(
      rowData === ref.current[0],
      rowIndex === ref.current[1],
      dispatch === ref.current[2]
    );
    ref.current = [rowData, rowIndex, , dispatch];
  }, [rowData, rowIndex, , dispatch]);

  return (
    <tr>
      {rowData.map((td, i) => {
        return (
          <Td
            key={i}
            data={rowData[i]}
            rowIndex={rowIndex}
            cellIndex={i}
            cellData={rowData[i]}
            dispatch={dispatch}
          />
        );
      })}
    </tr>
  );
});

export default Tr;
