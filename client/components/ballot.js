import _ from 'underscore';
import React, {Component} from 'react';
import Candidate from './candidate';
import io from '../utils/io';
import movies from '../movies';

export default class extends Component {
  state = {
    name: '',
    votes: {}
  }

  componentWillMount() {
    io.on('name', ::this.setName);
    io.on('votes', (votes) => this.setState({votes}));
    io.on('connect', () => io.emit('name', this.getName()));
  }

  getName() {
    const {name} = this.state;
    try { return localStorage.name || name; } catch (er) { return name; }
  }

  setName(name) {
    try { localStorage.name = name; } catch (er) {}
    this.setState({name});
  }

  requestName() {
    const name = prompt('Please enter your name.');
    if (name) io.emit('name', name);
  }

  vote(id) {
    if (!this.state.name) return alert('Please enter your name before voting!');
    io.emit('vote', id);
  }

  clearVotes() {
    const {name} = this.state;
    if (name) io.emit('clear', name);
  }

  renderCandidate(movie) {
    const {id: key} = movie;
    const {name, votes} = this.state;
    const vote = (votes[name] || {})[key] || 0;
    const onVote = _.bind(this.vote, this, key);
    return <Candidate {...{key, movie, onVote, vote}} />;
  }

  renderClearVotes() {
    if (!this.state.name) return;
    return (
      <button type='button' onClick={::this.clearVotes}>Clear Votes</button>
    );
  }

  render() {
    const {name} = this.state;
    return (
      <div className='ballot'>
        <div className='logo-padding'><div className='logo' /></div>
        <div className='header'>
          <div className='name'>{name ? `Hi, ${name}!` : 'Who are you?'}</div>
          {this.renderClearVotes()}
          <button type='button' onClick={::this.requestName}>
            {name ? 'Change Name' : 'Enter Name'}
          </button>
        </div>
        {_.map(_.sortBy(movies, 'title'), ::this.renderCandidate)}
      </div>
    );
  }
}
