import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions: number;
}

interface ApiResponse {
  posts: Post[];
}

const Api = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<ApiResponse>('https://dummyjson.com/posts');
        setPosts(response.data.posts);
        setLoading(false);
      } catch (err) {
        const error = err as AxiosError;
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div>Carregando posts...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <div>Tags: {post.tags.join(', ')}</div>
            <div>Likes: {post.reactions}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Api;