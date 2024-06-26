import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";

import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import feedbackStyles from "../../styles/CustomFeedback.module.css"

import { axiosReq } from "../../API/axiosDefaults";
import { useCurrentUser, useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { SuccessMessage, ErrorMessage } from "../../components/CustomFeedback";

const ProfileEditForm = () => {
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errors, setErrors] = useState({});
    const currentUser = useCurrentUser();
    const setCurrentUser = useSetCurrentUser();
    const history = useHistory();
    const { id } = useParams();
    const imageFile = useRef();
    const [profileData, setProfileData] = useState({
        name: "", content: "", image: "",
    });
    const { name, content, image } = profileData;

    useEffect(() => {
        const handleMount = async () => {
            if (currentUser?.profile_id?.toString() === id) {
                try {
                    const { data } = await axiosReq.get(`/profiles/${id}/`);
                    const { name, content, image } = data;
                    setProfileData({ name, content, image });
                } catch (err) {
                    history.push("/");
                }
            } else {
                history.push("/");
            }
        };

        handleMount();
    }, [currentUser, history, id]);

    const handleChange = (event) => {
        setProfileData({
            ...profileData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});
        const formData = new FormData();
        formData.append("name", name);
        formData.append("content", content);
        if (imageFile?.current?.files[0]) {
            formData.append("image", imageFile?.current?.files[0]);
        }
        try {
            const { data } = await axiosReq.put(`/profiles/${id}/`, formData);
            setCurrentUser((currentUser) => ({
                ...currentUser,
                profile_image: data.image,
            }));
            setSuccessMessage("Profile edited successfully.");
            setSuccessMessage("")
            setTimeout(() => {
                history.push(`/profiles/${data.id}`);
            }, 2000);
        } catch (err) {
            if (err.response?.data) {
                setErrors(err.response.data);
            } else {
                setErrorMessage("Profile edit failed. Please check and try again.");
            }
        }
    };

    const textFields = (
        <>
            <Form.Group>
                <Form.Label htmlFor="bio-textarea">Bio</Form.Label>
                <Form.Control
                    id="bio-textarea"
                    type="text"
                    name="content"
                    value={content}
                    as="textarea"
                    rows={6}
                    onChange={handleChange}
                />
            </Form.Group>
            {errors?.content?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                    {message}
                </Alert>
            ))}
            <Button className={`${btnStyles.Button}`} type="submit">
                Save
            </Button>
            <Button className={`${btnStyles.Button}`} onClick={() => history.goBack()}>
                Cancel
            </Button>
        </>
    );

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col className="py-2 p-0 p-md-2 text-center" md={7} lg={6}>
                    <Container className={appStyles.Content}>
                        <Form.Group>
                            {image && (
                                <figure>
                                    <Image src={image} fluid />
                                </figure>
                            )}
                            {errors?.image?.map((message, idx) => (
                                <Alert variant="warning" key={idx}>
                                    {message}
                                </Alert>
                            ))}
                            <div>
                                <Form.Label
                                    className={`${btnStyles.Button} btn my-auto`}
                                    htmlFor="image-upload"
                                    aria-label="Change profile image"
                                >
                                    Change image
                                </Form.Label>
                            </div>
                            <Form.File
                                id="image-upload"
                                ref={imageFile}
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files.length) {
                                        setProfileData({
                                            ...profileData,
                                            image: URL.createObjectURL(e.target.files[0]),
                                        });
                                    }
                                }}
                                aria-label="File input for changing profile image"
                            />
                        </Form.Group>
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
                        <div className="d-md-none">{textFields}</div>
                    </Container>
                </Col>
                <Col md={5} lg={6} className="d-none d-md-block p-0 p-md-2 text-center">
                    <Container className={appStyles.Content}>{textFields}</Container>
                </Col>
            </Row>
        </Form>
    );
};

export default ProfileEditForm;
