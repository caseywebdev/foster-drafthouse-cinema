import {render} from 'react-dom';
import Ballot from './components/ballot';
import FastClick from 'fastclick';
import React from 'react';
import Results from './components/results';

FastClick(document.body);

export const initBallot = () =>
  render(<Ballot />, document.getElementById('main'));

export const initResults = () =>
  render(<Results />, document.getElementById('main'));
