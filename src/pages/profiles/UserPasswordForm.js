import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import feedbackStyles from "../../styles/CustomFeedback.module.css"

import { axiosRes } from "../../API/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { SuccessMessage, ErrorMessage } from "../../components/CustomFeedback";

const UserPasswordForm = () => {
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errors, setErrors] = useState({});
    const history = useHistory();
    const { id } = useParams();
    const currentUser = useCurrentUser();
    const [userData, setUserData] = useState({
        new_password1: "",
        new_password2: "",
    });
    const { new_password1, new_password2 } = userData;

    const handleChange = (event) => {
        setUserData({
            ...userData,
            [event.target.name]: event.target.value,
        });
    };

    useEffect(() => {
        if (currentUser?.profile_id?.toString() !== id) {
            history.push("/");
        }
    }, [currentUser, history, id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});
        try {
            await axiosRes.post("/dj-rest-auth/password/change/", userData);
            setSuccessMessage("Password changed successfully.");
            setTimeout(() => {
                setSuccessMessage("");
                history.goBack();
            }, 2000);
        } catch (err) {
            if (err.response?.data) {
                setErrors(err.response?.data);
            } else {
                setErrorMessage("Password change failed. Please try again later.");
            }
        }
    };

    return (
        <Row>
            <Col className="py-2 mx-auto text-center" md={6}>
                <Container className={appStyles.Content}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label htmlFor="new-password-input">New password</Form.Label>
                            <Form.Control
                                id="new-password-input"
                                type="password"
                                name="new_password1"
                                value={new_password1}
                                placeholder="Enter new password"
                                onChange={handleChange}
                            />
                        </Form.Group>
                        {errors?.new_password1?.map((message, idx) => (
                            <Alert key={idx} variant="warning">
                                {message}
                            </Alert>
                        ))}
                        <Form.Group>
                            <Form.Label htmlFor="confirm-password-input">Confirm password</Form.Label>
                            <Form.Control
                                id="confirm-password-input"
                                type="password"
                                name="new_password2"
                                value={new_password2}
                                placeholder="Confirm new password"
                                onChange={handleChange}
                            />
                        </Form.Group>
                        {errors?.new_password2?.map((message, idx) => (
                            <Alert key={idx} variant="warning">
                                {message}
                            </Alert>
                        ))}
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
                        <Button type="submit" className={`${btnStyles.Button}`}>
                            Save
                        </Button>
                        <Button className={`${btnStyles.Button}`} onClick={() => history.goBack()}>
                            Cancel
                        </Button>
                    </Form>
                </Container>
            </Col>
        </Row>
    );
};

export default UserPasswordForm;
