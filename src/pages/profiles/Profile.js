import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import styles from "../../styles/Profile.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useSetProfileData } from "../../contexts/ProfileDataContext";

import Avatar from "../../components/Avatar";

const Profile = (props) => {
    const { profile, mobile, imageSize = 55 } = props;
    const { id, following_id, image, owner } = profile;
    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner;
    const { handleFollow, handleUnfollow } = useSetProfileData();

    return (
        <div
            className={`my-3 d-flex align-items-center ${mobile && "flex-column"}`}>
            <div>
                <Link to={`/profiles/${id}`} className="align-self-center" aria-label="View profile">
                    <Avatar src={image} height={imageSize} />
                </Link>
            </div>
            <div className={`mx-2 ${styles.WordBreak}`}>
                <Link to={`/profiles/${id}`} className={appStyles.Link} aria-label="View profile">
                    {owner}
                </Link>
            </div>
            <div className={`text-right ${!mobile && "ml-auto"}`}>
                {!mobile && currentUser && !is_owner &&
                    (following_id
                        ? <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="tooltip-unfollow">Unfollow</Tooltip>}>
                            <Button className={`${btnStyles.Button} ${styles.tooltipButton} ${styles.unfollowButton}`}
                            onClick={() => handleUnfollow(profile)} aria-label="Unfollow this profile">&nbsp;</Button>
                        </OverlayTrigger>
                        : <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="tooltip-follow">Follow</Tooltip>}>
                            <Button className={`${btnStyles.Button} ${styles.tooltipButton} ${styles.followButton}`}
                            onClick={() => handleFollow(profile)} aria-label="Follow this profile">+</Button>
                        </OverlayTrigger>
                    )
                }
            </div>
        </div>
    )
}

export default Profile;
