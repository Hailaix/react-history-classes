import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

// class JokeList extends Component {
//   static defaultProps = {
//     numJokesToGet: 5
//   };

//   constructor(props) {
//     super(props);
//     this.state = {
//       jokes: [],
//       isLoading: true
//     };

//     this.generateNewJokes = this.generateNewJokes.bind(this);
//     this.vote = this.vote.bind(this);
//   }

//   /* at mount, get jokes */

//   componentDidMount() {
//     this.getJokes();
//   }

//   /* retrieve jokes from API */

//   async getJokes() {
//     try {
//       // load jokes one at a time, adding not-yet-seen jokes
//       let jokes = [];
//       let seenJokes = new Set();

//       while (jokes.length < this.props.numJokesToGet) {
//         let res = await axios.get("https://icanhazdadjoke.com", {
//           headers: { Accept: "application/json" }
//         });
//         let { ...joke } = res.data;

//         if (!seenJokes.has(joke.id)) {
//           seenJokes.add(joke.id);
//           jokes.push({ ...joke, votes: 0 });
//         } else {
//           console.log("duplicate found!");
//         }
//       }

//       this.setState({ jokes, isLoading: false });
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   /* empty joke list, set to loading state, and then call getJokes */

//   generateNewJokes() {
//     this.setState({ isLoading: true });
//     this.getJokes();
//   }

//   /* change vote for this id by delta (+1 or -1) */

//   vote(id, delta) {
//     this.setState(st => ({
//       jokes: st.jokes.map(j =>
//         j.id === id ? { ...j, votes: j.votes + delta } : j
//       )
//     }));
//   }

//   /* render: either loading spinner or list of sorted jokes. */

//   render() {
//     let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);
//     if (this.state.isLoading) {
//       return (
//         <div className="loading">
//           <i className="fas fa-4x fa-spinner fa-spin" />
//         </div>
//       )
//     }

//     return (
//       <div className="JokeList">
//         <button
//           className="JokeList-getmore"
//           onClick={this.generateNewJokes}
//         >
//           Get New Jokes
//         </button>

//         {sortedJokes.map(j => (
//           <Joke
//             text={j.joke}
//             key={j.id}
//             id={j.id}
//             votes={j.votes}
//             vote={this.vote}
//           />
//         ))}
//       </div>
//     );
//   }
// }

const JokeList = ({ numJokesToGet = 5 }) => {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //new getJokes, should run on initial mount, like before, and any time isLoading is changed.
  useEffect(() => {
    const getJokes = async () => {
      try {
        /**
         * checks isLoading as we only want to update the joke list after isLoading is changed to true,
         * not false (because we change it to false in the useEffect, causing it to run again). This seemed
         * like a better solution than having a third piece of state to keep track of.
         */
        if (isLoading) {
          const newJokes = [];
          const seenJokes = new Set();
          while (newJokes.length < numJokesToGet) {
            const res = await axios.get("https://icanhazdadjoke.com", {
              headers: { Accept: "application/json" }
            });
            const { ...joke } = res.data;

            if (!seenJokes.has(joke.id)) {
              seenJokes.add(joke.id);
              newJokes.push({ ...joke, votes: 0 });
            } else {
              console.log("duplicate found!");
            }
          }
          setJokes(newJokes);
          setIsLoading(false);
        }
      } catch (e) {
        console.error(e);
      }
    }
    getJokes();
  }, [isLoading])

  /* change vote for this id by delta (+1 or -1) */
  const vote = (id, delta) => {
    setJokes(jokes => (
      jokes.map(j => (
        j.id === id ? { ...j, votes: j.votes + delta } : j
      ))
    ));
  }
  // simply sets isLoading to true so the useEffect is run on re-render.
  const generateNewJokes = () => {
    setIsLoading(true);
  }
  const sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);
  return (
    isLoading
      ? <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
      : <div className="JokeList">
        <button
          className="JokeList-getmore"
          onClick={generateNewJokes}
        >
          Get New Jokes
        </button>

        {sortedJokes.map(j => (
          <Joke
            text={j.joke}
            key={j.id}
            id={j.id}
            votes={j.votes}
            vote={vote}
          />
        ))}
      </div>
  );
}

export default JokeList;
