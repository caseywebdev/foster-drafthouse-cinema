import { memo, useCallback } from 'endr';

import ws from '#app/constants/ws.js';
import cx from '#app/functions/cx.js';

const formatMinutes = minutes => {
  const m = Math.max(0, minutes % 60);
  const h = (minutes - m) / 60;
  return [].concat(h ? `${h}h` : [], m ? `${m}m` : []).join(' ') || '0m';
};

export default memo(
  ({
    movie: { id, title, releaseDate, runtime, tagline, posterUrl },
    votes
  }) => (
    <div
      className='relative p-2 gap-2 group transition cursor-pointer flex rounded shadow bg-stone-900 select-none hover:bg-black hover:scale-[102%] active:scale-[101%] hover:shadow-2xl hover:z-10'
      onclick={useCallback(() => ws.send({ type: 'vote', args: { id } }))}
    >
      <div className='shrink-0 w-1/4 max-w-xs'>
        <img src={posterUrl} className='rounded' />
      </div>
      <div className='grow min-w-0 p-2 space-y-1'>
        <div className='leading-tight text-lg font-bold'>{title}</div>
        <div className='leading-tight text-sm text-stone-400'>{tagline}</div>
        <div className='text-xs'>
          {releaseDate.slice(0, 4)} &bull; {formatMinutes(runtime)}
        </div>
        <div>
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={cx(i >= votes && 'invisible')}>
              👍
            </span>
          ))}
        </div>
      </div>
    </div>
  )
);
