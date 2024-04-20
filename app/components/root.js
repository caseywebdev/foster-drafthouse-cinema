import Ballot from '#app/components/ballot.js';
import Logo from '#app/components/logo.svg';
import Results from '#app/components/results.js';
import config from '#app/config.js';
import TestContext from '#app/constants/test-context.js';
import ws from '#app/constants/ws.js';
import tbd from '#app/tbd/index.js';

const { location } = globalThis;

const { userId } = config;

const Breaks = () => {
  tbd.useEffect(() => {
    throw new Error('Breaks is broken!!');
  });
};

export default () => {
  const [state, setState] = tbd.useState();

  tbd.useEffect(() => {
    const unsubscribe = ws.subscribe(setState);
    ws.send({ type: 'load' });
    return unsubscribe;
  }, []);

  const user = state?.usersById[userId];

  return (
    <>
      {tbd.useContext(TestContext)}
      <TestContext.Provider value='new value'>
        <tbd.ErrorBoundary
          fallback={({ error }) => `${error.message} happened`}
        >
          <div className='shrink-0 pt-6 px-6 pb-4 select-none text-center'>
            <Logo className='inline-block max-h-32' />
          </div>
          <Breaks />
        </tbd.ErrorBoundary>
        {!user ? (
          <div className='grow min-h-0 flex items-center justify-center font-bold uppercase'>
            Loading...
          </div>
        ) : location.pathname === '/results' ? (
          <Results state={state} />
        ) : (
          <Ballot user={user} />
        )}
      </TestContext.Provider>
    </>
  );
};
