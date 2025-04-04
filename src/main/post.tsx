import "./style.css";
import { useEffect, useState, useMemo } from 'react';
import { TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel, Chip, Box, Button, OutlinedInput, Skeleton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions?: {
    likes: number;
    dislikes: number;
  };
  likes?: number;
  dislikes?: number;
}

interface ApiResponse {
  posts: Post[];
}

type SortOption = 'newest' | 'oldest' | 'most-likes' | 'least-likes' | 'title-asc' | 'title-desc';

function Post() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [minLikes, setMinLikes] = useState<string>('');
  const [maxLikes, setMaxLikes] = useState<string>('');

  useEffect(() => {
    fetch('https://dummyjson.com/posts')
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Erro ao carregar a API');
        }
        return await res.json() as ApiResponse;
      })
      .then(data => {
        setTimeout(() => {
          setPosts(data.posts || []);
          setLoading(false);
        }, 1000);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    posts.forEach(post => {
      post.tags?.forEach(tag => categories.add(tag));
    });
    return Array.from(categories);
  }, [posts]);

  const allUsers = useMemo(() => {
    const users = new Set<number>();
    posts.forEach(post => {
      users.add(post.userId);
    });
    return Array.from(users).sort((a, b) => a - b);
  }, [posts]);

  const getLikes = (post: Post): number => {
    return post.reactions?.likes || post.likes || 0;
  };

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
        post.tags?.some(tag => selectedCategories.includes(tag))
      );
    }
    
    if (selectedUsers.length > 0) {
      result = result.filter(post => 
        selectedUsers.includes(post.userId)
      );
    }
    
    if (minLikes) {
      const min = parseInt(minLikes) || 0;
      result = result.filter(post => 
        getLikes(post) >= min
      );
    }
    
    if (maxLikes) {
      const max = parseInt(maxLikes) || Infinity;
      result = result.filter(post => 
        getLikes(post) <= max
      );
    }
    
    switch (sortOption) {
      case 'newest': 
        result.sort((a, b) => b.id - a.id); 
        break;
      case 'oldest': 
        result.sort((a, b) => a.id - b.id); 
        break;
      case 'most-likes': 
        result.sort((a, b) => getLikes(b) - getLikes(a)); 
        break;
      case 'least-likes': 
        result.sort((a, b) => getLikes(a) - getLikes(b)); 
        break;
      case 'title-asc': 
        result.sort((a, b) => a.title.localeCompare(b.title)); 
        break;
      case 'title-desc': 
        result.sort((a, b) => b.title.localeCompare(a.title)); 
        break;
      default: 
        break;
    }
    
    return result;
  }, [posts, searchTerm, selectedCategories, selectedUsers, sortOption, minLikes, maxLikes]);

  const sortOptionsMap: Record<SortOption, string> = {
    'newest': 'Mais recentes',
    'oldest': 'Mais antigos',
    'most-likes': 'Mais curtidas',
    'least-likes': 'Menos curtidas',
    'title-asc': 'Título (A-Z)',
    'title-desc': 'Título (Z-A)'
  };

  const handleCategoriesChange = (event: { target: { value: unknown } }) => {
    setSelectedCategories(event.target.value as string[]);
  };

  const handleUsersChange = (event: { target: { value: unknown } }) => {
    setSelectedUsers(event.target.value as number[]);
  };

  const handleSortChange = (event: { target: { value: unknown } }) => {
    setSortOption(event.target.value as SortOption);
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
                      <span>{getLikes(post)}</span>
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
                onChange={handleCategoriesChange}
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
                onChange={handleUsersChange}
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
                onChange={handleSortChange}
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