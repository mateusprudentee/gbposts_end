import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

interface PostReactions {
  likes: number;
  dislikes: number;
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions: PostReactions;
}

interface ApiResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

const Api = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get<ApiResponse>('https://dummyjson.com/posts');
        setPosts(data.posts);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          setError(err.response?.data?.message || err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <div>Tags: {post.tags.join(', ')}</div>
            <div>Likes: {post.reactions.likes}</div>
            <div>Dislikes: {post.reactions.dislikes}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Api;