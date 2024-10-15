import { Try, useEffect, useState } from 'endr';

import Ballot from '#app/components/ballot.js';
import Logo from '#app/components/logo.svg';
import Results from '#app/components/results.js';
import config from '#app/config.js';
import ws from '#app/constants/ws.js';

const { location } = globalThis;

const { userId } = config;

const Root = () => {
  const [state, setState] = useState({ usersById: {} });

  useEffect(() => {
    const unsubscribe = ws.subscribe(setState);
    ws.send({ type: 'load' });
    return unsubscribe;
  }, []);

  const user = state.usersById[userId];

  return (
    <>
      <div className='shrink-0 pt-6 px-6 pb-4 select-none text-center'>
        <Logo class='inline-block max-h-32' />
      </div>
      {!user ? (
        <div className='grow min-h-0 flex items-center justify-center font-bold uppercase'>
          Loading...
        </div>
      ) : location.pathname === '/results' ? (
        <Results state={state} />
      ) : (
        <Ballot user={user} />
      )}
    </>
  );
};

export default () => {
  const [error, setError] = useState(/** @type {Error | null} */ (null));

  if (error) {
    return (
      <div className='grow min-h-0 flex items-center justify-center p-8'>
        <div className='p-8 bg-white rounded shadow text-red-500'>
          <div className='font-bold'>{error.name}</div>
          <div>{error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <Try catch={setError}>
      <Root />
    </Try>
  );
};
