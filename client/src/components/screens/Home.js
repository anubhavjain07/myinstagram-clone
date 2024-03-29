import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';
import { Container } from 'react-materialize';

const Home = () => {
    const [data, setData] = useState([]);
    const { state, dispatch } = useContext(UserContext);

    useEffect(() => {
        fetch('/allpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
            .then(res => res.json())
            .then(result => {
                //console.log(result);
                setData(result.posts)
            })
            .catch(err => {
                console.log(err);
            })
    }, [data]);


    const likePost = (id) => {
        fetch('/like', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        })
            .then(res => res.json())
            .then(result => {
                // console.log(result);
                const newdata = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    }
                    else {
                        return item
                    }

                })
                setData(newdata);

            })
            .catch(err => {
                console.log(err);
            });
    };

    const unlikePost = (id) => {
        fetch('/unlike', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        })
            .then(res => res.json())
            .then(result => {
                //console.log(result);
                const newdata = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    }
                    else {
                        return item
                    }

                })
                setData(newdata);
            })
            .catch(err => {
                console.log(err);
            });
    };


    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId,
                text
            })
        })
            .then(res => res.json())
            .then(result => {
                //console.log(result);
                const newdata = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    }
                    else {
                        return item
                    }

                })
                setData(newdata);
            })
            .catch(err => {
                console.log(err);
            });

    };

    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
            method: 'delete',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        })
            .then(res => res.json())
            .then(result => {
                //console.log(result);
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData);
            })
            .catch(err => {
                console.log(err);
            });
    };

    return (
        <Container>
            <div className="home">
                {
                    data.map(item => {
                        return (
                            <div className="card home-card" key={item._id}>
                                <h5 style={{ padding: "8px" }}>
                                    <Link to={item.postedBy._id !== state._id ? '/profile/' + item.postedBy._id : '/profile/'}>
                                        <span><img style={{ width: "24px", height: "24px", borderRadius: "12px" }} src={item.postedBy.pic} alt="profile" /></span>  {item.postedBy.name}
                                    </Link>
                                    {item.postedBy._id === state._id && <i className="material-icons" style={{ float: 'right' }}
                                        onClick={() => deletePost(item._id)}
                                    >delete</i>}
                                </h5>
                                <div className="card-image">
                                    <img src={item.photo} alt="post" />
                                </div>
                                <div className="card-content">
                                    {
                                        item.likes.includes(state._id)
                                            ?
                                            <i className="material-icons" onClick={() => { unlikePost(item._id) }}>favorite</i>
                                            :
                                            <i className="material-icons" onClick={() => { likePost(item._id) }}>favorite_border</i>

                                    }
                                    <a style={{ marginInlineStart: "10px" }} className="material-icons" href={'#comment' + item._id}>comment</a>

                                    <h6>{item.likes.length} likes</h6>
                                    <h6>{item.title}</h6>
                                    <p>{item.body}</p>
                                    {
                                        item.comments.map(record => {
                                            return (
                                                <h6 key={record._id}><span style={{ fontWeight: "500" }}>{record.postedBy.name}</span> {record.text}</h6>
                                            );
                                        })
                                    }
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        makeComment(e.target[0].value, item._id)
                                    }}>
                                        <input id={'comment' + item._id} type="text" placeholder="Add a Comment" />
                                    </form>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </Container>
    );
}

export default Home;