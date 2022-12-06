import clsx from 'app/functions/clsx.js';
import { createElement, forwardRef } from 'react';

export default (component, className, props) =>
  forwardRef(({ as: Component = component, ...props2 }, ref) =>
    createElement(Component, {
      ...props,
      ...props2,
      className: clsx(className, props2.className),
      ref,
      style: { ...props?.style, ...props2.style }
    })
  );
