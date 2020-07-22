import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';

const Profile = () => {
    const [mypics, setPics] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    //console.log(state);

    useEffect(() => {
        fetch('/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
            .then(res => res.json())
            .then(result => {
                //console.log(result);
                setPics(result.myposts);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);


    return (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
            <div style={{
                display: "flex",
                padding: "10px",
                justifyContent: "space-around",
                margin: "18px 0px",
                borderBottom: '1px solid grey'
            }}>
                <div>
                    <img style={{ width: "160px", height: "160px", borderRadius: "80px" }} src={state ? state.pic : ''} alt="profile" />
                </div>
                <div>
                    <h4>{state ? state.name : 'Loading..'}</h4>
                    <h5>{state ? state.email : 'Loading..'}</h5>
                    <div style={{
                        display: "flex",
                        width: '108%',
                        justifyContent: 'space-between'
                    }}>
                        <h6>{mypics.length} Posts</h6>
                        <h6>{state ? state.followers.length : '0'} Followers</h6>
                        <h6>{state ? state.following.length : '0'} Following</h6>
                    </div>
                </div>
            </div>

            <div className="gallery">
                {
                    mypics.map(item => {
                        return (
                            <img key={item._id} className="item" src={item.photo} alt={item.title} />
                        );

                    })
                }

            </div>

        </div>
    );
}

export default Profile;