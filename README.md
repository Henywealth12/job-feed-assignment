Markdown
# Job Feed Assignment

## Overview
This project implements a job browsing feature with filtering, pagination, and URL synchronization using **NestJS** (backend) and **React + TypeScript** (frontend).

---

# Phase 1 — Technical Design

## Backend Design

### Endpoint Design
**GET /jobs**  
**Query Parameters:**  
- page (number, default: 1)  
- limit (number, default: 10)  
- category (string, optional)  
- type (string, optional)  

**Example Request:**  
`/jobs?page=2&limit=10&category=engineering&type=contract`

**Response:**  
```json
{
  "data": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0
  }
}
DTO Definitions
Request DTO: page?, limit?, category?, type?
Response DTO:
TypeScript
interface Job {
  id: string;
  title: string;
  category: string;
  type: string;
  description: string;
}

interface JobsResponseDto {
  data: Job[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
Filtering Strategy
Filtering handled in service layer
Steps: apply filters → pagination → return response
Mimics a real database query for scalability
Pagination Strategy
skip = (page - 1) * limit
totalPages = Math.ceil(total / limit)
Edge Cases
page too large → empty data
invalid query params → default or 400
no results → empty array
invalid filters → ignore
Frontend Design
Component Structure

JobsPage
 ├── FiltersSidebar
 │    ├── CategoryFilter
 │    └── TypeFilter
 ├── JobsList
 │    └── JobCard
 └── Pagination
URL Synchronization
URL query params = single source of truth
Example: /jobs?category=engineering&type=contract&page=2
Updating filters updates URL → triggers data fetch → UI updates
Fetching Strategy
Fetch when query params change
Keep previous data while loading to avoid flicker
Loading, error, and empty states handled properly
Reusability
Reusable filter components for category and type
State Management
URL query params control all state
Avoid duplicated state in components
Phase 2 — Implementation Overview
Backend (NestJS)
GET /jobs endpoint implemented
Query params: page, limit, category, type
Mock in-memory jobs data used
Filtering & pagination applied in service
Response includes data and meta (total, page, limit, totalPages)
Example Job Data
TypeScript
[
  { id: '1', title: 'Frontend Engineer', category: 'Engineering', type: 'Full-time', description: 'Work on React apps' },
  { id: '2', title: 'UI Designer', category: 'Design', type: 'Contract', description: 'Create UI mockups' }
]
Frontend (React + Vite)
JobsPage contains:
FiltersSidebar (category/type filters)
JobsList (JobCard components)
Pagination
URL synchronization implemented via useSearchParams
Loading, empty, and error states handled
Reusable components for filters and pagination
API requests made to backend /jobs endpoint
Data fetched based on current query params in URL
Running the Project
Backend
Bash
cd backend
npm install
npm run start
Frontend
Bash
cd frontend
npm install
npm run dev
Visit frontend at http://localhost:5173/jobs
Notes
Filtering logic structured like a real database query for easy future integration
React components designed to be reusable and maintainable
URL-driven state ensures shareable & predictable browsing experience

---

# 🔹 Next Step

Now you can:

1. Create your **GitHub repo**  
2. Paste the above content into `README.md`  
3. Create **backend/** and **frontend/** folders with the code (I can provide code next)  
4. Commit & push  

---

If you want, I can **write the full backend + frontend code files for Phase 2** in **copy-paste format**, so you literally just add them to the repo and submit a complete working project.  

Do you want me to do that now?
