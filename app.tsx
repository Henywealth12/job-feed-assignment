// app.tsx
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import path from 'path';
import React, { useState, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Backend (mock data + API) ----------
interface Job {
  id: number;
  title: string;
  category: string;
  type: string;
}

const jobs: Job[] = [
  { id: 1, title: "Frontend Engineer", category: "Engineering", type: "Full-time" },
  { id: 2, title: "UI Designer", category: "Design", type: "Contract" },
  { id: 3, title: "Backend Engineer", category: "Engineering", type: "Contract" },
  { id: 4, title: "Product Designer", category: "Design", type: "Full-time" },
  { id: 5, title: "DevOps Engineer", category: "Engineering", type: "Full-time" },
  { id: 6, title: "QA Engineer", category: "Engineering", type: "Contract" },
  { id: 7, title: "Graphic Designer", category: "Design", type: "Contract" },
];

app.get('/jobs', (req, res) => {
  let { page = '1', limit = '10', category, type } = req.query as Record<string, string>;
  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);

  let filtered = jobs;
  if (category) filtered = filtered.filter(job => job.category.toLowerCase() === category.toLowerCase());
  if (type) filtered = filtered.filter(job => job.type.toLowerCase() === type.toLowerCase());

  const total = filtered.length;
  const totalPages = Math.ceil(total / limitNum);
  const start = (pageNum - 1) * limitNum;
  const data = filtered.slice(start, start + limitNum);

  res.json({ data, meta: { total, page: pageNum, limit: limitNum, totalPages } });
});

// ---------- Frontend (React in same file) ----------
const App = () => {
  const [jobsList, setJobsList] = useState<Job[]>([]);
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    const res = await fetch(`http://localhost:3000/jobs?page=${page}&limit=5&category=${category}&type=${type}`);
    const json = await res.json();
    setJobsList(json.data);
    setMeta(json.meta);
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, [page, category, type]);

  return (
    <div style={{ display: 'flex', padding: '20px' }}>
      <div style={{ marginRight: '20px' }}>
        <h3>Category</h3>
        <button onClick={() => { setCategory('Engineering'); setPage(1); }}>Engineering</button>
        <button onClick={() => { setCategory('Design'); setPage(1); }}>Design</button>
        <button onClick={() => { setCategory(''); setPage(1); }}>All</button>
        <h3>Type</h3>
        <button onClick={() => { setType('Full-time'); setPage(1); }}>Full-time</button>
        <button onClick={() => { setType('Contract'); setPage(1); }}>Contract</button>
        <button onClick={() => { setType(''); setPage(1); }}>All</button>
      </div>
      <div>
        {loading ? <p>Loading...</p> : jobsList.length === 0 ? <p>No jobs found</p> :
          <ul>{jobsList.map(job => <li key={job.id}>{job.title} ({job.category} - {job.type})</li>)}</ul>
        }
        <div style={{ marginTop: '20px' }}>
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} disabled={p === page} style={{ margin: '0 5px' }}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ---------- Serve React Frontend ----------
app.get('/', (req, res) => {
  const html = ReactDOMServer.renderToString(<App />);
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Jobs Page</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
      </body>
    </html>
  `);
});

const server = createServer(app);
server.listen(3000, () => console.log('App running on http://localhost:3000'));
