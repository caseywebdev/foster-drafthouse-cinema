import { useEffect, useState } from 'vidore';

import Ballot from '#app/components/ballot.js';
import Logo from '#app/components/logo.svg';
import Results from '#app/components/results.js';
import config from '#app/config.js';
import ws from '#app/constants/ws.js';

const { location } = globalThis;

const { userId } = config;

export default () => {
  const [state, setState] = useState();

  useEffect(() => {
    const unsubscribe = ws.subscribe(setState);
    ws.send({ type: 'load' });
    return unsubscribe;
  }, []);

  const user = state?.usersById[userId];

  return (
    <>
      <div className='shrink-0 pt-6 px-6 pb-4 select-none text-center'>
        <Logo className='inline-block max-h-32' />
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
