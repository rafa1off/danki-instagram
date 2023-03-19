import firebase from 'firebase';
import {db} from './firebase.js'
import { useEffect, useState } from 'react';

function Feed(props) {
    const [comentarios, setComentarios] = useState([])

    useEffect(() => {         
        db.collection('posts').doc(props.id).collection('comentarios').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
            setComentarios(snapshot.docs.map((document) => {
                return {id:document.id, info:document.data()}
            }))
        })
    }, [])

    function comentarPost(id, e) {
        e.preventDefault()

        let comentarioAtual = document.querySelector('#comentario-'+id);

        db.collection('posts').doc(id).collection('comentarios').add({
            userName: props.user,
            comentario: comentarioAtual.value,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })

        document.querySelector('.areaComentar'+id).reset();
    }
    
    return (
        <div className = 'postSingle'>
            <img src={props.info.image}></img>
            <p><b>{props.info.userName}</b> {props.info.titulo}</p>
            <hr></hr>
            <div className='coments'>
                {
                    comentarios.map((val) => {
                        return (
                            <div className='comentSingle'>
                                <p><b>{val.info.userName}</b> {val.info.comentario}</p>
                            </div>
                       )
                   })
                }
            </div>
            <form className={'areaComentar'+props.id} onSubmit={(e) => comentarPost(props.id, e)}>
                <textarea id={'comentario-'+props.id} placeholder='Insira seu comentário..'></textarea>
                <input type='submit' value='Comentar'></input>
            </form>
        </div >
    )
}

export default Feed;