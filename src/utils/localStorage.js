export const getBlogPosts = () => {
    return JSON.parse(localStorage.getItem('blogPosts') || '[]');
};

export const saveBlogPosts = (posts) => {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
};

export const getLikedBlogs = () => {
    return new Set(JSON.parse(localStorage.getItem('likedBlogs') || '[]'));
};

export const saveLikedBlogs = (likedSet) => {
    localStorage.setItem('likedBlogs', JSON.stringify([...likedSet]));
};

export const getBookmarkedBlogs = () => {
    return new Set(JSON.parse(localStorage.getItem('bookmarkedBlogs') || '[]'));
};

export const saveBookmarkedBlogs = (bookmarkedSet) => {
    localStorage.setItem('bookmarkedBlogs', JSON.stringify([...bookmarkedSet]));
};

export const addBlogPost = (post) => {
    const posts = getBlogPosts();
    const newPost = {
        id: Date.now(),
        ...post,
        published_date: new Date().toLocaleDateString(),
        likes: 0,
        bookmarked: false,
        image: post.image || 'https://via.placeholder.com/400x300'
    };
    const updatedPosts = [newPost, ...posts];
    saveBlogPosts(updatedPosts);
    return newPost;
};

export const updateBlogPost = (id, updatedData) => {
    const posts = getBlogPosts();
    const updatedPosts = posts.map(post =>
        post.id === parseInt(id) ? { ...post, ...updatedData } : post
    );
    saveBlogPosts(updatedPosts);
    return updatedPosts.find(post => post.id === parseInt(id));
};

export const deleteBlogPost = (id) => {
    const posts = getBlogPosts();
    const updatedPosts = posts.filter(post => post.id !== parseInt(id));
    saveBlogPosts(updatedPosts);
    return true;
};
