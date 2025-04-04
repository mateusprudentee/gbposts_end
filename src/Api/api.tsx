import  { useState, useEffect } from 'react';
import axios from 'axios';



const Api = () => {
        const [posts, setPosts] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
      
        useEffect(() => {
          const fetchPosts = async () => {
            try {
              const response = await axios.get('https://dummyjson.com/posts');
              setPosts(response.data.posts); // A API retorna os posts dentro de um objeto com propriedade 'posts'
              setLoading(false);
            } catch (err) {
              setError(err.message);
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
      }
    

export default Api