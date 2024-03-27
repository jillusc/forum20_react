import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styles from '../../styles/LogInSignUpForm.module.css';
import btnStyles from '../../styles/Button.module.css';
import appStyles from '../../App.module.css';
import { Form, Button, Col, Row, Container, Alert } from 'react-bootstrap';
import axios from 'axios';

const SignUpForm = () => {
    const [signUpData, setSignUpData] = useState({
        username: '',
        password1: '',
        password2: '',
    });
    const { username, password1, password2 } = signUpData;

    const [errors, setErrors] = useState({});
    const history = useHistory();

    const handleChange = (event) => {
        setSignUpData({
            ...signUpData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('/dj-rest-auth/registration/', signUpData);
            history.push('/login');
        } catch (err) {
            setErrors(err.response?.data);
        }
    };

    return (
<Container className="mt-5">
  <Row className="justify-content-center">
    <Col xs={12} md={6} lg={4}>
      <div className={`${appStyles.Content} p-4`}>
                        <h1 className={styles.Header}><strong>Sign up</strong></h1>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="username">
                                <Form.Label className="d-none">Username</Form.Label>
                                <Form.Control
                                    className={styles.Input}
                                    type="text"
                                    placeholder="Username"
                                    name="username"
                                    value={username}
                                    onChange={handleChange}
                                    aria-label="Username"
                                />
                            </Form.Group>
                            {errors.username?.map((message, idx) => (
                                <Alert variant="warning" key={idx}>{message}</Alert>
                            ))}

                            <Form.Group controlId="password1">
                                <Form.Label className="d-none">Password</Form.Label>
                                <Form.Control
                                    className={styles.Input}
                                    type="password"
                                    placeholder="Password"
                                    name="password1"
                                    value={password1}
                                    onChange={handleChange}
                                    aria-label="Password"
                                />
                            </Form.Group>
                            {errors.password1?.map((message, idx) => (
                                <Alert key={idx} variant="warning">{message}</Alert>
                            ))}

                            <Form.Group controlId="password2">
                                <Form.Label className="d-none">Confirm Password</Form.Label>
                                <Form.Control
                                    className={styles.Input}
                                    type="password"
                                    placeholder="Confirm Password"
                                    name="password2"
                                    value={password2}
                                    onChange={handleChange}
                                    aria-label="Confirm Password"
                                />
                            </Form.Group>
                            {errors.password2?.map((message, idx) => (
                                <Alert key={idx} variant="warning">{message}</Alert>
                            ))}
                            <div className="d-flex justify-content-center">
                                <Button
                                    className={`${btnStyles.Button}`}
                                    type="submit">SIGN UP</Button></div>
                            {errors.non_field_errors?.map((message, idx) => (
                                <Alert key={idx} variant="warning" className="mt-3">
                                    {message}
                                </Alert>
                            ))}                        </Form>
                    </div>
                    <div className={`mt-3 ${appStyles.Content}`}>
  <strong>Already registered? </strong><Link className={styles.TextLink} to="/login">Log in </Link>
</div>

                </Col>
            </Row>
        </Container>
    );
};

export default SignUpForm;