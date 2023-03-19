import { useEffect, useState } from 'react';
import firebase from 'firebase';
import { auth, storage, db } from './firebase.js'

function Header(props) {

    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState(null);

    useEffect(() => {

    }, [])

    function criarConta(e) {
        e.preventDefault();

        let email = document.getElementById('email-cadastro').value;
        let username = document.getElementById('user-cadastro').value;
        let senha = document.getElementById('senha-cadastro').value;

        auth.createUserWithEmailAndPassword(email,senha)
            .then((authUser) => {
                authUser.user.updateProfile({
                    displayName: username
                })
                alert('Conta criada com sucesso!')
                let modal = document.querySelector('.modalCriarConta')

                modal.style.display = 'none'
            }).catch((error) => {
                alert(error.message)
            })
            
    }

    function logarConta(e) {
        e.preventDefault();

        let email = document.getElementById('email-login').value;
        let senha = document.getElementById('senha-login').value;

        auth.signInWithEmailAndPassword(email, senha)
            .then((auth) => {
                props.setUser(auth.user.displayName)
                alert('Logado com sucesso!')
                window.location.href = '/';
            }).catch((error) => {
                alert(error.message)
            })
    }

    function deslogarConta(e) {
        e.preventDefault()

        auth.signOut()
            .then((val) => {
                props.setUser(null)
                window.location.href = '/';
            })
    }

    function abrirModalUplod(e) {
        e.preventDefault();

        let modal = document.querySelector('.modalUpload')

        modal.style.display = 'block'
    }

    function fecharModalUpload(e) {
        let modal = document.querySelector('.modalUpload')

        modal.style.display = 'none'
    }

    function uploadPost(e) {
        e.preventDefault();

        let tituloUpload = document.getElementById('titulo-upload').value;

        const uploadTask = storage.ref(`images/${file.name}`).put(file)

        uploadTask.on('state.changed', (snapshot) => {
            const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
        }, (error) => {
            
        }, () => {
            storage.ref('images').child(file.name).getDownloadURL()
                .then((url) => {
                    db.collection('posts').add({
                        titulo: tituloUpload,
                        image: url,
                        userName: props.user,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    })

                    setProgress(0);
                    setFile(null);
                    alert('Upload realizado com sucesso!')

                    document.getElementById('form-upload').reset()
                    fecharModalUpload()
                })
        })
    }

    function abrirModalCriarConta(e) {
        e.preventDefault();

        let modal = document.querySelector('.modalCriarConta')

        modal.style.display = 'block'
    }

    function fecharModalCriarConta(e) {
        e.preventDefault();

        let modal = document.querySelector('.modalCriarConta')

        modal.style.display = 'none'
    }

    return (
        <div className="header">
            
            <div className='modalCriarConta'>
                <div className='formCriarConta'>
                    <div onClick={(e)=>fecharModalCriarConta(e)} className='close-modalCriarConta'>X</div>

                    <h2>Crie sua conta</h2>
                    <form onSubmit={(e)=>criarConta(e)}>
                        <input id='email-cadastro' type='text' placeholder='Email'></input>
                        <input id='user-cadastro' type='text' placeholder='Usuário'></input>
                        <input id='senha-cadastro' type='password' placeholder='Senha'></input>
                        <input type='submit' value='Criar conta'></input>
                    </form>
                </div>
            </div>

            <div className='modalUpload'>
                <div className='formUpload'>
                    <div onClick={(e)=>fecharModalUpload(e)} className='close-modalCriarConta'>X</div>

                    <h2>Post</h2>
                    <form id='form-upload' onSubmit={(e)=>uploadPost(e)}>
                        <input onChange={(e)=>setFile(e.target.files[0])} type='file' name='file'></input>
                        <input id='titulo-upload' type='text' placeholder='Descrição'></input>
                        <progress id='progress-upload' value={progress}></progress>
                        <input type='submit' value='Postar'></input>
                    </form>
                </div>
            </div>

            <div className='center'>
                <div className="header-logo">
                    <a href=''><img src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png' /></a>
                </div>
                {
                    (props.user) ?
                    <div className='header-logadoInfo'>
                        <span>Olá, <b>{props.user}</b>!</span>
                        <a onClick={(e) => abrirModalUplod(e)} href='#'>Postar</a>
                        <a onClick={(e) => deslogarConta(e)} href='#'>Deslogar</a>
                    </div>
                    :
                    <div className='header-loginForm'>
                    <form onSubmit={(e)=>logarConta(e)}>
                        <input id='email-login' type="text" placeholder='Login'></input>
                        <input id='senha-login' type='password' placeholder='Senha'></input>
                        <input type='submit' name='submit' value='Logar'></input>
                    </form>
                    <div className='btn-criarConta'>
                        <a onClick={(e)=>abrirModalCriarConta(e)} href='#'>Criar Conta!</a>
                    </div>
                    </div>
                }
            </div>
      </div>
    )
}

export default Header;