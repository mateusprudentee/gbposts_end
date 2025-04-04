import "./style.css";
import { useEffect, useState, useMemo } from 'react';
import { TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel, Chip, Box, Button, OutlinedInput, Skeleton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

function Post() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [minLikes, setMinLikes] = useState('');
  const [maxLikes, setMaxLikes] = useState('');

  useEffect(() => {
    fetch('https://dummyjson.com/posts')
      .then(res => {
        if (!res.ok) {
          throw new Error('Erro ao carregar a API');
        }
        return res.json();
      })
      .then(data => {
        setTimeout(() => {
          setPosts(data.posts || []);
          setLoading(false);
        }, 1000);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const allCategories = useMemo(() => {
    const categories = new Set();
    posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => categories.add(tag));
      }
    });
    return Array.from(categories);
  }, [posts]);

  const allUsers = useMemo(() => {
    const users = new Set();
    posts.forEach(post => {
      if (post.userId) {
        users.add(post.userId);
      }
    });
    return Array.from(users).sort((a, b) => a - b);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let result = [...posts];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(term) || 
        post.body.toLowerCase().includes(term)
      );
    }
    
    if (selectedCategories.length > 0) {
      result = result.filter(post => 
        post.tags && post.tags.some(tag => selectedCategories.includes(tag))
      );
    }
    
    if (selectedUsers.length > 0) {
      result = result.filter(post => 
        selectedUsers.includes(post.userId)
      );
    }
    
    if (minLikes) {
      const min = parseInt(minLikes);
      result = result.filter(post => 
        (post.reactions?.likes || post.likes || 0) >= min
      );
    }
    
    if (maxLikes) {
      const max = parseInt(maxLikes);
      result = result.filter(post => 
        (post.reactions?.likes || post.likes || 0) <= max
      );
    }
    
    switch (sortOption) {
      case 'newest': result.sort((a, b) => b.id - a.id); break;
      case 'oldest': result.sort((a, b) => a.id - b.id); break;
      case 'most-likes': result.sort((a, b) => (b.reactions?.likes || b.likes || 0) - (a.reactions?.likes || a.likes || 0)); break;
      case 'least-likes': result.sort((a, b) => (a.reactions?.likes || a.likes || 0) - (b.reactions?.likes || b.likes || 0)); break;
      case 'title-asc': result.sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'title-desc': result.sort((a, b) => b.title.localeCompare(a.title)); break;
      default: break;
    }
    
    return result;
  }, [posts, searchTerm, selectedCategories, selectedUsers, sortOption, minLikes, maxLikes]);

  const sortOptionsMap = {
    'newest': 'Mais recentes',
    'oldest': 'Mais antigos',
    'most-likes': 'Mais curtidas',
    'least-likes': 'Menos curtidas',
    'title-asc': 'Título (A-Z)',
    'title-desc': 'Título (Z-A)'
  };

  if (error) return <div className="container" id="error-container">Error: {error}</div>;

  return (
    <div className="container" id="main-container">
      <div className="botao-menu flex" id="header-container">
        <div className="title" id="page-title">
          <p>Postagens</p>
        </div>
      </div>

      <div className="content-wrapper" id="content-wrapper">
        <div className="posts-list" id="posts-list-container">
          {loading ? (
            [...Array(3)].map((_, index) => (
              <div key={index} className="cards-post" id={`skeleton-post-${index}`}>
                <div className="cards-post-title">
                  <Skeleton variant="text" width="80%" height={30} />
                </div>
                <div className="cards-post-body">
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="90%" height={20} />
                  <Skeleton variant="text" width="95%" height={20} />
                </div>
                <div className="corpoInferior">
                  <div className="flex">
                    <div className="cards-post-likes">
                      <Skeleton variant="circular" width={20} height={20} />
                      <Skeleton variant="text" width={20} height={20} />
                    </div>
                    <div className="cards-post-deslikes">
                      <Skeleton variant="circular" width={20} height={20} />
                      <Skeleton variant="text" width={20} height={20} />
                    </div>
                    <div className="cards-post-chips">
                      <Skeleton variant="rectangular" width={60} height={24} />
                      <Skeleton variant="rectangular" width={60} height={24} />
                    </div>
                  </div>
                  <div className="post-user">
                    <Skeleton variant="text" width="60%" height={20} />
                  </div>
                </div>
              </div>
            ))
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post.id} className="cards-post" id={`post-${post.id}`}>
                <div className="cards-post-title">
                  <h3>{post.title || 'Título'}</h3>
                </div>
                <div className="cards-post-body">
                  <p>{post.body || 'Conteúdo da postagem'}</p>
                </div>
                <div className="corpoInferior">
                  <div className="flex">
                    <div className="cards-post-likes" id={`post-likes-${post.id}`}>
                      <ThumbUpIcon fontSize="small" />
                      <span>{post.reactions?.likes || post.likes || 0}</span>
                    </div>
                    <div className="cards-post-deslikes" id={`post-dislikes-${post.id}`}>
                      <ThumbDownIcon fontSize="small" />
                      <span>{post.reactions?.dislikes || post.dislikes || 0}</span>
                    </div>
                    <div className="cards-post-chips" id={`post-tags-${post.id}`}>
                      {post.tags ? (
                        post.tags.map((tag, index) => (
                          <Chip key={index} label={tag} size="small" sx={{ marginRight: 1 }} />
                        ))
                      ) : (
                        <Chip label="Sem tags" size="small" />
                      )}
                    </div>
                  </div>
                  <div className="post-user" id={`post-user-${post.id}`}>
                    <p>Postado por: {post.userId || 'Anônimo'}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results" id="no-results-message">
              <p>Nenhuma postagem encontrada com os filtros atuais.</p>
            </div>
          )}
        </div>

        <div className="filters-sidebar" id="filters-container">
          <Box sx={{ p: 2 }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '20px' }}>
              <FilterListIcon /> Filtros
            </h3>
            
            <TextField
              fullWidth
              id="search-input"
              label="Buscar postagens"
              variant="outlined"
              margin="normal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="categories-label">Selecione as categorias</InputLabel>
              <Select
                id="categories-select"
                labelId="categories-label"
                multiple
                value={selectedCategories}
                onChange={(e) => setSelectedCategories(e.target.value)}
                input={<OutlinedInput label="Selecione as categorias" />}
                renderValue={(selected) => selected.length > 0 ? selected.join(', ') : "Selecione as categorias"}
              >
                {allCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="users-label">Selecione os usuários</InputLabel>
              <Select
                id="users-select"
                labelId="users-label"
                multiple
                value={selectedUsers}
                onChange={(e) => setSelectedUsers(e.target.value)}
                input={<OutlinedInput label="Selecione os usuários" />}
                renderValue={(selected) => selected.length > 0 ? selected.map(u => `Usuário ${u}`).join(', ') : "Selecione os usuários"}
              >
                {allUsers.map((userId) => (
                  <MenuItem key={userId} value={userId}>
                    Usuário {userId}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className="flex" style={{ gap: '10px', marginBottom: '16px' }}>
              <TextField
                id="min-likes-input"
                fullWidth
                label="Curtidas Min"
                type="number"
                value={minLikes}
                onChange={(e) => setMinLikes(e.target.value)}
              />
              <TextField
                id="max-likes-input"
                fullWidth
                label="Curtidas Max"
                type="number"
                value={maxLikes}
                onChange={(e) => setMaxLikes(e.target.value)}
              />
            </div>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="sort">Ordene os posts</InputLabel>
              <Select
                id="sort-select"
                labelId="sort"
                value={sortOption}
                label="Ordene os posts"
                onChange={(e) => setSortOption(e.target.value)}
                renderValue={(selected) => selected ? sortOptionsMap[selected] : "Ordene os posts"}
              >
                <MenuItem value="newest">Mais recentes</MenuItem>
                <MenuItem value="oldest">Mais antigos</MenuItem>
                <MenuItem value="most-likes">Mais curtidas</MenuItem>
                <MenuItem value="least-likes">Menos curtidas</MenuItem>
                <MenuItem value="title-asc">Título (A-Z)</MenuItem>
                <MenuItem value="title-desc">Título (Z-A)</MenuItem>
              </Select>
            </FormControl>

            <Button 
              id="apply-filters-button"
              variant="contained" 
              fullWidth 
              onClick={() => setPosts([...posts])}
              sx={{ py: 1.5 }}
            >
              Aplicar Filtros
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default Post;