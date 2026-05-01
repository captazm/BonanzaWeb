import { getPosts, getProducts } from './src/data/store.js';

async function test() {
    try {
        console.log("Fetching posts...");
        const posts = await getPosts();
        console.log(`Successfully fetched ${posts.length} posts!`);
        console.log(posts.map(p => p.title));
    } catch (e) {
        console.error("Failed:", e);
    }
}
test();
