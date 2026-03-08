-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    series TEXT,
    tagline TEXT,
    description TEXT,
    price TEXT,
    featured BOOLEAN DEFAULT false,
    badge TEXT,
    specs JSONB,
    colors TEXT[],
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author TEXT,
    date TEXT,
    category TEXT,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access on posts" ON posts FOR SELECT USING (true);

-- Create policies for data migration and admin access
-- IMPORTANT: In production, you should use service_role key or authenticated roles.
CREATE POLICY "Allow all access for migration" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access for migration posts" ON posts FOR ALL USING (true) WITH CHECK (true);
