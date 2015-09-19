import {List, Map} from 'immutable';

export const INITIAL_STATE = Map();

export function setEntries(state, entries) {
  return state.set('entries', List(entries))
}

export function next(state) {
  const entries = state.get('entries')
                        .concat(getWinners(state.get('vote')));
  if(entries.size === 1) {
    // We could have just returned
    // Map({winner: entries.first()}) here.
    // But instead we still take the old state
    // as the starting point and explicitly
    // remove 'vote' and 'entries' keys from it.
    // The reason for this is future-proofing:
    // At some point we might have some unrelated
    // data in the state, and it should pass through
    // this function unchanged. It is generally
    // a good idea in these state transformation
    // functions to always morph the old state
    // into the new one instead of building
    // the new state completely from scratch.
    return state.remove('vote')
                .remove('entries')
                .set('winner', entries.first());
  } else {
    return state.merge({
      vote: Map({pair: entries.take(2)}),
      entries: entries.skip(2)
    });
  }
}

export function vote(voteState, entry) {
  return voteState.updateIn(
    ['tally', entry],
    0,
    tally => tally + 1
  );
}


function getWinners(vote) {
  if(!vote) return [];
  const [a, b] = vote.get('pair');
  const aVotes = vote.getIn(['tally', a], 0);
  const bVotes = vote.getIn(['tally', b], 0);
  if      (aVotes > bVotes) return [a];
  else if (aVotes < bVotes) return [b];
  else                      return [a, b];
}
