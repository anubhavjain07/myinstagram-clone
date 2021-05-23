import React, { useContext, useRef, useEffect, useState } from 'react';
import '../App.css';
import { Link, useHistory, Switch } from 'react-router-dom';
import { UserContext } from '../App';
import M from 'materialize-css';

const NavBar = () => {
    const searchModal = useRef(null);
    const [search, setSearch] = useState('')
    const { state, dispatch } = useContext(UserContext);
    const history = useHistory();
    const [userDetails, setUserDetails] = useState([]);

    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, []);

    const renderList = () => {
        if (state) {
            return [
                <li key="1"><Link to="/" className="sidenav-close" ><i data-target="modal1" className="material-icons modal-trigger" style={{ color: "black" }}>search</i></Link></li>,
                <li className="sidenav-close" key="2"><Link to="/profile">Profile</Link></li>,
                <li className="sidenav-close" key="3"><Link to="/create">Create Post</Link></li>,
                <li className="sidenav-close" key="4"><Link to="/myfollowingpost">My Following Post</Link></li>,
                <li className="sidenav-close" key="5">
                    <Link to="/signin" onClick={() => {
                        localStorage.clear();
                        dispatch({ type: 'CLEAR' });
                        //history.push('/signin');

                    }}>
                        Logout
                    </Link>
                </li>
            ]
        }
        else {
            return [
                <li className="sidenav-close" key="6"><Link to="/signin">Signin</Link></li>,
                <li className="sidenav-close" key="7"><Link to="/signup">SignUp</Link></li>
            ]
        }
    }

    const fetchUsers = (query) => {
        setSearch(query);
        fetch('/searchusers', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query
            })

        })
            .then(res => res.json())
            .then(results => {
                console.log(results);
                setUserDetails(results.user);
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <nav>
            <div className="nav-wrapper">
                <Link style={{ marginLeft: "8px" }} to={state ? '/' : 'signin'} className="brand-logo left">Picster</Link>
                <a href="#" data-target="mobile-demo" className="sidenav-trigger right"><i className="material-icons">menu</i></a>
                <ul id="nav-mobile" className="right  hide-on-med-and-down">
                    {renderList()}
                </ul>
                <ul className="sidenav" id="mobile-demo">
                    {renderList()}
                </ul>

                {document.addEventListener('DOMContentLoaded', function () {
                    var elems = document.querySelectorAll('.sidenav');
                    var instances = M.Sidenav.init(elems);
                })}

            </div>
            <div id="modal1" className="modal" ref={searchModal} style={{ color: 'black' }}>
                <div className="modal-content">
                    <input
                        type="text"
                        placeholder="Search User"
                        value={search}
                        onChange={(e) => fetchUsers(e.target.value)}
                    />

                    <ul className="collection">
                        {userDetails.map(item => {
                            return <Link key={item._id} to={item._id !== state._id ? '/profile/' + item._id : '/profile'} onClick={() => {
                                setSearch('');
                                setUserDetails([]);
                                M.Modal.getInstance(searchModal.current).close();
                            }}>
                                <li className="collection-item">{item.email}</li>
                            </Link>
                        })}

                    </ul>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" onClick={() => {
                        setSearch('')
                        setUserDetails([])
                    }}>Close</button>
                </div>
            </div>
        </nav>


    );
};

export default NavBar;
