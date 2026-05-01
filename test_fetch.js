import { getPosts } from './src/data/store.js';
getPosts().then(posts => console.log('Posts:', posts.length)).catch(console.error);
