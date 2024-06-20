import { useEffect, useState } from 'endr';

import config from '#app/config.js';
import ws from '#app/constants/ws.js';
import cx from '#app/functions/cx.js';
import indexBy from '#app/functions/index-by.js';

const { document, requestAnimationFrame, window } = globalThis;

const { movies } = config;

const moviesById = indexBy(movies, ({ id }) => id);

const acceleration = 0.001;

const maxVelocity = 1;

const drag = 0.995;

const Movie = ({ isActive, movie }) => (
  <a
    className={cx(
      'block flex-1 rounded bg-cover bg-center transition',
      isActive ? 'shadow-2xl' : 'scale-90 opacity-10 shadow'
    )}
    href={`https://www.themoviedb.org/movie/${movie.id}`}
    style={{ backgroundImage: `url('${movie.posterUrl}')` }}
  />
);

const User = ({ activeVoteIndex, user: { id, name, votes } }) =>
  votes.length > 0 && (
    <div className='flex-1 flex flex-col'>
      <div
        className='font-bold uppercase truncate text-center'
        ondblclick={() => ws.send({ type: 'resetUserVotes', args: { id } })}
      >
        {name}
      </div>
      <div className='grow min-h-0 flex'>
        {votes.map((id, i) => (
          <Movie
            key={i}
            movie={moviesById[id] ?? {}}
            isActive={i === activeVoteIndex}
          />
        ))}
      </div>
    </div>
  );

export default ({ state }) => {
  const [isAccelerating, setIsAcelerating] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [position, setPosition] = useState(0);
  const allVotes = Object.values(state.usersById).flatMap(
    ({ id: userId, votes }) =>
      votes.map((movieId, index) => ({ userId, movieId, index }))
  );
  const activeVote = allVotes[Math.floor(position) % allVotes.length];

  useEffect(() => {
    document.addEventListener('touchstart', () => setIsAcelerating(true));
    document.addEventListener('touchend', () => setIsAcelerating(false));
    document.addEventListener('keydown', ({ key }) => {
      if (key === ' ') setIsAcelerating(true);
    });
    document.addEventListener('keyup', ({ key }) => {
      if (key === ' ') setIsAcelerating(false);
    });
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      let _velocity = velocity;
      if (isAccelerating) {
        _velocity = Math.min(_velocity + acceleration, maxVelocity);
      } else {
        _velocity *= drag;
        if (velocity > 0 && _velocity < 0.004) {
          _velocity = 0;
          window.open(`https://www.themoviedb.org/movie/${activeVote.movieId}`);
        }
      }

      setVelocity(_velocity);
      setPosition(allVotes.length ? (position + _velocity) % allVotes.length : 0);
    })
  });

  return (
    <div className='relative grow min-h-0 select-none'>
      <div className='absolute inset-0 p-2 flex flex-col gap-2'>
        {Object.values(state.usersById).map(user => (
          <User
            key={user.id}
            user={user}
            activeVoteIndex={activeVote?.userId === user.id && activeVote.index}
          />
        ))}
      </div>
    </div>
  );
};
