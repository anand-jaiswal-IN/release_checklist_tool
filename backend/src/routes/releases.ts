import { Hono } from 'hono';
import {
  getAllReleases,
  getReleaseById,
  createRelease,
  updateRelease,
  deleteRelease,
} from '../controllers/releaseController';

const releases = new Hono();

// GET /api/releases - Get all releases
releases.get('/', getAllReleases);

// GET /api/releases/:id - Get release by ID
releases.get('/:id', getReleaseById);

// POST /api/releases - Create new release
releases.post('/', createRelease);

// PUT /api/releases/:id - Update release
releases.put('/:id', updateRelease);

// DELETE /api/releases/:id - Delete release
releases.delete('/:id', deleteRelease);

export default releases;
