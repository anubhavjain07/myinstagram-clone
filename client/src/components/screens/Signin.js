import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import { Container } from 'react-materialize';
import { UserContext } from '../../App'

const Signin = () => {
    const { state, dispatch } = useContext(UserContext);
    const history = useHistory();
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const PostData = () => {
        if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "Invalid email", classes: '#c62828 red darken-3' });
            return;
        }
        fetch('/signin', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        })
            .then(res => res.json())
            .then(data => {
                //console.log(data);
                if (data.error) {

                    M.toast({ html: data.error, classes: '#c62828 red darken-3' })
                }
                else {
                    localStorage.setItem('jwt', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    dispatch({ type: 'USER', payload: data.user });
                    M.toast({ html: "Signed In success", classes: '#43a047 green darken-1' });
                    history.push('/');

                }
            })
            .catch(err => {
                console.log(err);
            });
    };
    return (
        <Container>
            <div className="mycard">
                <div className="card auth-card input-field">
                    <h2>Picster</h2>
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => PostData()}>
                        Login
                    </button>
                    <h5>
                        <Link to='/signup'> Don't have an account ?</Link>
                    </h5>
                    <h6>
                        <Link to='/reset'> Forgot password ?</Link>
                    </h6>
                </div>
            </div>
        </Container>
    );
}

export default Signin;