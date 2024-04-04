import React, { useState } from "react";

import Form from "react-bootstrap/Form";

import formStyles from "../../styles/FormStyles.module.css"
import btnStyles from "../../styles/Button.module.css";

import { axiosRes } from "../../API/axiosDefaults";

function CommentEditForm(props) {
  const { id, content, setShowEditForm, setComments } = props;
  const [formContent, setFormContent] = useState(content);

  const handleChange = (event) => {
    setFormContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put(`/comments/${id}/`, {
        content: formContent.trim(),
      });
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.map((comment) => {
          return comment.id === id
            ? {
              ...comment,
              content: formContent.trim(),
              updated_at: "now",
            }
            : comment;
        }),
      }));
      setShowEditForm(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="pr-1">
        <Form.Control
          className={formStyles.Form}
          as="textarea"
          value={formContent}
          onChange={handleChange}
          rows={2}
        />
      </Form.Group>
      <div className="text-right">
        <button
          className={btnStyles.Button}
          disabled={!content.trim()}
          type="submit"
        >
          save
        </button>
        <button
          className={btnStyles.Button}
          onClick={() => setShowEditForm(false)}
          type="button"
        >
          cancel
        </button>
      </div>
    </Form>
  );
}

export default CommentEditForm;
