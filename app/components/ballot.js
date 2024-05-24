import Candidate from '#app/components/candidate.js';
import config from '#app/config.js';
import ws from '#app/constants/ws.js';

const { movies } = config;

const inputClassName =
  'rounded p-2 w-full text-stone-800 appearance-none transition hover:[&:not(:focus-within)]:bg-gray-50 focus-within:bg-white focus-within:shadow focus-within:border-blue-500 focus-within:ring';

export default ({ user }) => (
  <div className='mx-auto w-full max-w-md p-2 space-y-2'>
    <div>
      <div className='uppercase font-bold'>Your Name</div>
      <input
        className={inputClassName}
        value={user.name}
        oninput={({ target: { value } }) =>
          ws.send({ type: 'setUserName', args: { name: value } })
        }
      />
    </div>
    <div className='space-y-2'>
      {movies.map(movie => (
        <Candidate
          movie={movie}
          key={movie.id}
          votes={user.votes.filter(id => id === movie.id).length}
        />
      ))}
    </div>
  </div>
);
