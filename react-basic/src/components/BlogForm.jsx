import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import PropTypes from "prop-types";

const BlogForm = ({ editing }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [body, setBody] = useState("");
  const [originalBody, setOriginalBody] = useState("");
  const [publish, setPublish] = useState(false);
  const [originalPublish, setOriginalPublish] = useState(false);

  // 게시글 수정할 때 기존 데이터 가져오기
  useEffect(() => {
    if (editing) {
      axios.get(`http://localhost:3001/posts/${id}`).then((res) => {
        setTitle(res.data.title);
        setOriginalTitle(res.data.title);
        setBody(res.data.body);
        setOriginalBody(res.data.body);
        setPublish(res.data.publish);
        setOriginalPublish(res.data.publish);
      });
    }
  }, [id]);

  // 수정된 내용이 없을 때 버튼 비활성화
  const isEdited = () => {
    return (
      title !== originalTitle ||
      body !== originalBody ||
      publish !== originalPublish
    ); // 하나만 true 여도 true
  };

  // editing이 true 일 경우 게시글 수정, false일때 게시글 업로드
  const onSubmit = () => {
    if (editing) {
      axios
        .patch(`http://localhost:3001/posts/${id}`, {
          title: title,
          body: body,
          publish: publish,
        })
        .then((res) => {
          navigate(`/blogs/${id}`);
        });
    } else {
      axios
        .post(`http://localhost:3001/posts`, {
          title: title,
          body: body,
          publish: publish,
          createdAt: Date.now(), // 현재시간 가져오기
        })
        .then((res) => {
          console.log(res);
          navigate("/admin");
        });
    }
  };

  // 취소 버튼 누를 시 페이지 뒤로가기
  const goBack = () => {
    if (editing) {
      navigate(`/blogs/${id}`);
    } else {
      navigate(`/blogs`);
    }
  };

  const onChangePublish = (e) => {
    // console.log(e.target.checked);
    setPublish(e.target.checked);
  };
  return (
    <div>
      <h1>{editing ? "Edit" : "Create"} a blog post</h1>
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          className="form-control"
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Body</label>
        <textarea
          className="form-control"
          type="text"
          value={body}
          onChange={(event) => {
            setBody(event.target.value);
          }}
          rows="10"
        />
      </div>
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          checked={publish}
          onChange={onChangePublish}
        />
        <label className="form-check-label">Publish</label>
      </div>
      <button
        className="btn btn-primary"
        onClick={onSubmit}
        disabled={editing && !isEdited()}
      >
        {editing ? "Edit" : "Post"}
      </button>
      <button className="btn btn-danger ms-2" onClick={goBack}>
        Cancel
      </button>
    </div>
  );
};

BlogForm.propTypes = {
  editing: PropTypes.bool,
};

BlogForm.defaultProps = {
  editing: false, // false이면 create true 이면 edit
};

export default BlogForm;
