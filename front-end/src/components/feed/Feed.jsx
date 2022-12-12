import "./feed.css";
import Share from "../share/Share";
import { useState, useEffect } from "react";
import axios from "axios";
import Post from "../post/Post";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
        ? await axios.get("/posts/profile/" + username)
        : await axios.get("posts/timeline/" + user._id);
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [username, user._id]);
  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user.username) && <Share />}
        {posts.length > 0 ? (
          posts.map((p) => <Post post={p} key={p._id} />)
        ) : (
          <div className="noPostSpan">No Posts Yet!</div>
        )}
      </div>
    </div>
  );
}
