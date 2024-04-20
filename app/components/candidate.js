import TestContext from '#app/constants/test-context.js';
import ws from '#app/constants/ws.js';
import tbd from '#app/tbd/index.js';

const formatMinutes = minutes => {
  const m = Math.max(0, minutes % 60);
  const h = (minutes - m) / 60;
  return [].concat(h ? `${h}h` : [], m ? `${m}m` : []).join(' ') || '0m';
};

export default tbd.memo(
  ({
    movie: { id, title, releaseDate, runtime, tagline, posterUrl },
    votes
  }) => (
    <div
      className='group cursor-pointer flex rounded overflow-hidden bg-stone-900 hover:bg-black select-none'
      onClick={tbd.useCallback(() => {
        ws.send({ type: 'vote', args: { id } });
      })}
    >
      {tbd.useContext(TestContext)}
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
          {Array.from({ length: votes }, (_, i) => (
            <span key={i}>👍</span>
          ))}
        </div>
      </div>
    </div>
  )
);
