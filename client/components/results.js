import _ from 'underscore';
import getPosterUrl from '../utils/get-poster-url';
import io from '../utils/io';
import movies from '../movies';
import React, {Component} from 'react';
import sum from '../utils/sum';

const BY_ID = _.indexBy(movies, 'id');

const ACCELERATION = 0.005;

const MAX_VELOCITY = 1;

const DRAG = 0.995;

export default class extends Component {
  state = {
    active: 0,
    votes: {}
  }

  componentWillMount() {
    io.on('votes', (votes) => this.setVotes(votes));
    document.addEventListener('keydown', ::this.handleKeydown);
    document.addEventListener('keyup', ::this.handleKeyup);
    this.position = 0;
    this.velocity = 0;
    this.acceleration = 0;
    requestAnimationFrame(::this.tick);
  }

  setActive(active, votes = this.state.votes) {
    active %= _.reduce(votes, (n, vote) => n + sum(vote), 0);
    if (!active) active = 0;
    if (active !== this.state.active) this.setState({active});
  }

  setVotes(votes) {
    this.setActive(this.state.active, votes);
    this.setState({votes});
  }

  clear(name, ev) {
    if (ev.shiftKey) io.emit('clear', name);
  }

  handleKeydown(ev) {
    if (ev.which === 32) this.acceleration = ACCELERATION;
  }

  handleKeyup(ev) {
    if (ev.which === 32) this.acceleration = 0;
  }

  tick() {
    this.velocity =
      Math.min((this.velocity + this.acceleration) * DRAG, MAX_VELOCITY);
    if (this.velocity <= 0.01 && !this.acceleration) this.velocity = 0;
    if (this.acceleration) this.shouldOpen = true;
    if (this.velocity && this.state.stopped) {
      this.setState({stopped: false});
    } else if (!this.velocity && !this.state.stopped) {
      this.setState({stopped: true});
    }
    this.position += this.velocity;
    if (this.position >= 1) {
      this.setActive(this.state.active + 1);
      --this.position;
    }
    requestAnimationFrame(::this.tick);
  }

  openMovie(movie) {
    window.open(`https://www.fan.tv/movies/${movie.id}`);
  }

  handleMovieClick(movie, ev) {
    if (!ev.shiftKey) this.openMovie(movie);
  }

  renderMovie(offset, movie, i) {
    let className = 'image';
    if (this.state.active === offset + i) {
      className += ' active';
      if (this.state.stopped) {
        className += ' stopped';
        if (this.shouldOpen) {
          this.shouldOpen = false;
          this.openMovie(movie);
        }
      }
    }
    return (
      <td
        {...{className}}
        key={i}
        onClick={_.partial(::this.handleMovieClick, movie)}
        style={{backgroundImage: `url('${getPosterUrl(movie)}')`}}
      />
    );
  }

  renderVote(vote, name, offset) {
    const columns = _.chain(vote)
      .map((n, id) => _.times(n, () => BY_ID[id]))
      .flatten()
      .sortBy('title')
      .value();
    return [
      <tr key={`${name}.0`}>
        <td colSpan={_.max(_.map(this.state.votes, sum))}>{name}</td>
      </tr>,
      <tr key={`${name}.1`} onClick={_.partial(::this.clear, name)}>
        {_.map(columns, _.partial(::this.renderMovie, offset))}
      </tr>
    ];
  }

  render() {
    let offset = 0;
    return (
      <div className='results'>
        <div className='logo' />
        <table>
          <tbody>
            {
              _.map(this.state.votes, (vote, name) => {
                const row = this.renderVote(vote, name, offset);
                offset += sum(vote);
                return row;
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
}
