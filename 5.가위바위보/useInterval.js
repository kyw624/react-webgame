import { useRef, useEffect } from 'react';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      // callback을
      savedCallback.current();
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id); // delay가 null이 되면 리턴 부분 실행
    }
  }, [delay]);

  return savedCallback.current;
}

export default useInterval;
