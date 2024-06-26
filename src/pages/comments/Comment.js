import React, { useState } from "react";
import { Link } from "react-router-dom";
import Media from "react-bootstrap/Media";

import styles from "../../styles/Comment.module.css";
import feedbackStyles from "../../styles/CustomFeedback.module.css"

import Avatar from "../../components/Avatar";
import { MoreDropdown } from "../../components/MoreDropdown";
import CommentEditForm from "./CommentEditForm";

import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosRes } from "../../API/axiosDefaults";
import { SuccessMessage, ErrorMessage } from "../../components/CustomFeedback";

const Comment = (props) => {
    const { profile_id, profile_image, owner, updated_at, content, id,
        setComments, hideOwner
    } = props;
    const [showEditForm, setShowEditForm] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errors, setErrors] = useState({});
    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner;

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this comment?\n\nThis action cannot be undone.");
        if (confirmDelete) {
            try {
                await axiosRes.delete(`/comments/${id}/`);
                setSuccessMessage("Comment successfully deleted.");
                setTimeout(() => {
                    setComments((prevComments) => ({
                        ...prevComments,
                        results: prevComments.results.filter((comment) => comment.id !== id),
                    }));
                    setSuccessMessage("");
                }, 2000);
            } catch (err) {
                if (err.response?.data) {
                    setErrors(err.response.data);
                } else {
                    setErrorMessage("Comment deletion failed. Please try again.");
                }
            }
        }
    };

    return (
        <>
            <hr />
            <Media className="w-100">
                <Link to={`/profiles/${profile_id}`} aria-label={`View profile of ${owner}`}>
                    <Avatar src={profile_image} />
                </Link>
                <Media.Body className={`align-self-center ml-2 ${styles.MediaBody}`}>
                    {!hideOwner && (
                        <div className={styles.OwnerAndDate}>
                            <span className={styles.Owner}>{owner}</span>
                            <span className={styles.Date}>{updated_at}</span>
                        </div>
                    )}
                    {showEditForm ? (
                        <CommentEditForm
                            id={id}
                            profile_id={profile_id}
                            content={content}
                            profileImage={profile_image}
                            setComments={setComments}
                            setShowEditForm={setShowEditForm}
                            errors={errors}
                        />
                    ) : (
                        <p className={styles.Comment}>{content}</p>
                    )}
                </Media.Body>
                {is_owner && !showEditForm && (
                    <div className={styles.caretIconContainer}>
                        <MoreDropdown handleEdit={() => setShowEditForm(true)} handleDelete={handleDelete} />
                    </div>
                )}
                {successMessage && (
                    <div className={feedbackStyles.fixedMessage}>
                        <SuccessMessage message={successMessage} />
                    </div>
                )}
                {errorMessage && (
                    <div className={feedbackStyles.fixedMessage}>
                        <ErrorMessage message={errorMessage} />
                    </div>
                )}
            </Media>
        </>
    );
};

export default Comment;
