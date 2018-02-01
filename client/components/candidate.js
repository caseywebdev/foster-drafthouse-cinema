import _ from 'underscore';
import React, {Component} from 'react';
import getPosterUrl from '../utils/get-poster-url';

export default class extends Component {
  render() {
    const {movie, onVote, vote} = this.props;
    return (
      <div className='candidate' onClick={onVote}>
        <img className='image' src={getPosterUrl(movie)} />
        <div className='info'>
          <div className='title'>{
            `${movie.title} (${movie.release_date.slice(0, 4)})`}
          </div>
          <div>{movie.tagline}</div>
          <div className='duration'>{`${movie.runtime} minutes`}</div>
          <div className='vote'>
            {_.times(vote, () => <span className='vote'>👍</span>)}
          </div>
        </div>
      </div>
    );
  }
}
