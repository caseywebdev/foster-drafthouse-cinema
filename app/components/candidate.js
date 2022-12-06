import _ from 'underscore';

import clsx from 'app/functions/clsx.js';

const formatMinutes = minutes => {
  const m = Math.max(0, minutes % 60);
  const h = (minutes - m) / 60;
  return [].concat(h ? `${h}h` : [], m ? `${m}m` : []).join(' ') || '0m';
};

export default ({
  movie: { title, releaseDate, runtime, tagline, posterUrl },
  vote,
  votes
}) => (
  <div
    className='group cursor-pointer flex rounded overflow-hidden bg-stone-900 hover:bg-black select-none'
    onClick={vote}
  >
    <div className='shrink-0 w-1/4 max-w-xs'>
      <img src={posterUrl} />
    </div>
    <div className='grow min-w-0 p-2 space-y-1'>
      <div className='leading-tight text-lg font-bold'>{title}</div>
      <div className='leading-tight text-sm text-stone-400'>{tagline}</div>
      <div className='text-xs'>
        {releaseDate.slice(0, 4)} &bull; {formatMinutes(runtime)}
      </div>
      <div>
        {_.times(5, i => (
          <span className={clsx(i >= votes && 'opacity-0')}>👍</span>
        ))}
      </div>
    </div>
  </div>
);
