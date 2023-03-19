import './App.css';
import 'firebase';
import {db, auth } from './firebase';
import { useEffect, useState } from 'react';
import Header from './Header.js'
import Feed from './Feed'

function App() {
  const [user, setUser] = useState();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged((val) => {
      if(val != null) {
        setUser(val.displayName)
      }
    })

    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
      setPosts(snapshot.docs.map((document) => {
        return {id:document.id, info:document.data()}
      }))
    })
  }, [])

  return (
    <div className="App">
      
      <Header setUser={setUser} user={user}></Header>

      {
        (user) ?
        posts.map((val) => {
          return (
            <Feed user={user} info={val.info} id={val.id}></Feed>
          )
        })
        :
        <div>
            
        </div>
      }
      
    </div>
  );
}

export default App;
