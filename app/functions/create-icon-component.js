import cx from '#app/functions/cx.js';

/** @param {() => unknown} */
export default Icon =>
  ({ className, ...props }) => (
    <Icon
      {...props}
      className={cx(
        'inline-block overflow-visible h-[1em] w-[1em] align-[-0.125em]',
        className
      )}
    />
  );
