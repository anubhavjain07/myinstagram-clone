import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import { Container } from 'react-materialize';


const Signup = () => {
    const history = useHistory();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState('');
    const [url, setUrl] = useState(undefined);


    useEffect(() => {
        if (url) {
            uploadFields();
        }
    }, [url])

    const uploadFields = () => {

        if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "Invalid email", classes: '#c62828 red darken-3' });
            return;
        }
        fetch('/signup', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                password,
                email,
                pic: url
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {

                    M.toast({ html: data.error, classes: '#c62828 red darken-3' })
                }
                else {
                    M.toast({ html: data.message, classes: '#43a047 green darken-1' });
                    history.push('/signin');

                }
            })
            .catch(err => {
                console.log(err);
            });

    }

    const uploadPic = () => {
        const data = new FormData();
        data.append('file', image);
        data.append('upload_preset', 'insta-clone');
        data.append('cloud_name', 'anubhavjain07');
        fetch('https://api.cloudinary.com/v1_1/anubhavjain07/image/upload', {
            method: 'post',
            body: data
        })
            .then(res => res.json())
            .then(data => {
                //console.log(data);
                setUrl(data.url);
            })
            .catch(err => {
                console.log(err);
            });
    }


    const PostData = () => {
        if (image) {
            uploadPic();
        }
        else {
            uploadFields();
        }

    };

    return (
        <Container>
            <div className="mycard">
                <div className="card auth-card input-field">
                    <h2>Picster</h2>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
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
                    <div className="file-field input-field">
                        <div className="btn waves-effect waves-light #64b5f6 blue darken-1">
                            <span>Upload Pic</span>
                            <input
                                type="file"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" />
                        </div>
                    </div>
                    <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => PostData()}>
                        SignUp
                    </button>
                    <h5>
                        <Link to='/signin'> Already have an account ?</Link>
                    </h5>
                </div>
            </div>
        </Container>
    );
}

export default Signup;