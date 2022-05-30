import { useEffect, useRef } from 'react';

// helper hook to call a function regularly in time intervals

// Destructors are only allowed to return void.

type PollerCallback = () => void;

export const usePoller = (fn: PollerCallback, delay: number, extraWatch?: number) => {
  const savedCallback = useRef<PollerCallback>(() => {});
  // Remember the latest fn.
  useEffect(() => {
    savedCallback.current = fn;
  }, [fn]);
  // Set up the interval.
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
  // run at start too
  if (extraWatch) {
    useEffect(() => {
      fn();
    }, [extraWatch]);
  }
};
