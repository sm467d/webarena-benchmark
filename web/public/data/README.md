# WebArena Benchmark Data Files

This directory contains normalized performance data for the WebArena benchmark leaderboard.

**Total size:** ~881 KB (uncompressed), ~200 KB (gzipped)

## Files Overview

| File | Size | Records | Purpose |
|------|------|---------|---------|
| `models.json` | 1.7 KB | 10 models | Model metadata |
| `tasks.json` | 202 KB | 812 tasks | Task metadata |
| `results.json` | 439 KB | 8,028 results | Raw performance data |
| `leaderboard.json` | 7.2 KB | 10 models | Pre-aggregated leaderboard |
| `task_difficulty.json` | 128 KB | 812 tasks | Per-task statistics |
| `heatmap_data.json` | 104 KB | 812×10 matrix | Visualization data |

---

## File Schemas

### `models.json`

Metadata for all evaluated models.

```json
[
  {
    "id": "deepsky",              // Internal model identifier
    "name": "DeepSky Agent",      // Display name
    "date": "09/2025",            // Release date
    "open": false,                // Open source?
    "size_b": "-",                // Model size in billions
    "success_rate": 66.9,         // Overall success rate %
    "has_trajectories": true      // Trajectory data available?
  }
]
```

**Use cases:**
- Model filter dropdowns
- Model comparison selectors
- Model detail cards

---

### `tasks.json`

Metadata for all 812 benchmark tasks.

```json
[
  {
    "id": 0,                      // Task ID
    "intent": "What is the...",   // Task description
    "site": "shopping_admin",     // Domain/site
    "template_id": 279,           // Intent template ID
    "eval_type": "string_match",  // Evaluation method
    "reference_answer": "..."     // Expected answer (truncated)
  }
]
```

**Use cases:**
- Task viewer/browser
- Task search
- Domain filtering
- Reference answers display

---

### `results.json`

Normalized performance results (source of truth).

```json
[
  {
    "t": 0,          // task_id
    "m": "deepsky",  // model_id
    "s": 1           // success (1=pass, 0=fail)
  }
]
```

**Key abbreviations:**
- `t` = task_id
- `m` = model_id
- `s` = success

**Why abbreviated?**
- Saves ~60% file size
- Faster parsing
- Still human-readable

**Use cases:**
- Custom queries/aggregations
- Model-to-model comparisons
- Task-specific analysis

---

### `leaderboard.json`

Pre-aggregated leaderboard with domain breakdown.

```json
[
  {
    "id": "deepsky",
    "name": "DeepSky Agent",
    "total_tasks": 812,
    "successes": 543,
    "success_rate": 66.9,
    "rank": 1,
    "domain_breakdown": {
      "gitlab": {
        "success": 148,
        "total": 196,
        "rate": 75.5
      },
      // ... other domains
    }
  }
]
```

**Domains:**
- `gitlab` - GitLab tasks
- `map` - OpenStreetMap tasks
- `reddit` - Reddit tasks
- `shopping` - Shopping site tasks
- `shopping_admin` - Shopping admin tasks
- `wikipedia` - Wikipedia tasks

**Use cases:**
- Main leaderboard table
- Domain-specific tabs
- Per-domain rankings
- Quick stats display

---

### `task_difficulty.json`

Statistics for each task across all models.

```json
[
  {
    "id": 0,
    "success_count": 3,              // How many models passed
    "success_rate": 30.0,            // % of models that passed
    "difficulty": "hard",            // easy/medium/hard/very_hard
    "passing_models": [              // Models that passed
      "deepsky",
      "jace",
      "gui_hybrid"
    ]
  }
]
```

**Difficulty categories:**
- `easy`: ≥80% models pass
- `medium`: 40-80% models pass
- `hard`: 20-40% models pass
- `very_hard`: <20% models pass

**Use cases:**
- Task difficulty filter
- Identifying hard problems
- Research opportunities
- Task viewer details

---

### `heatmap_data.json`

Full performance matrix for visualization.

```json
{
  "model_ids": ["agentoccam", "deepsky", ...],  // Column headers
  "task_ids": [0, 1, 2, ...],                   // Row headers
  "matrix": [
    [0, 1, 1, 0, ...],  // Task 0 results
    [0, 0, 1, 1, ...],  // Task 1 results
    // ... 812 rows total
  ]
}
```

**Matrix values:**
- `1` = Success
- `0` = Failure
- `null` = No data (task not evaluated)

**Dimensions:** 812 tasks × 10 models = 8,120 cells

**Use cases:**
- Heatmap visualization
- Visual pattern detection
- Quick performance overview

---

## Data Flow

```
Raw Trajectories (data/trajectories/)
          ↓
Normalization Script (scripts/normalize_data.py)
          ↓
Normalized JSONs (web/public/data/)
          ↓
Frontend Components (React/Next.js)
```

---

## Updating Data

To regenerate all data files:

```bash
# From repo root
python scripts/normalize_data.py
```

This will:
1. Extract results from all trajectory files
2. Combine with test.raw.json metadata
3. Generate all 6 JSON files
4. Overwrite existing files

**When to update:**
- New model added to trajectories/
- Trajectory data corrected
- Leaderboard metadata updated

---

## Performance Considerations

### File Sizes
- **Total:** 881 KB uncompressed
- **Gzipped:** ~200 KB (75% reduction)
- **Single request:** Can fetch all files in <500ms on good connection

### Optimization Tips

1. **Use CDN** - Vercel/Netlify auto-gzip and cache
2. **Lazy load** - Only fetch what's needed per page:
   - Leaderboard page → `leaderboard.json` only
   - Heatmap page → `heatmap_data.json` + `models.json`
   - Task viewer → `tasks.json` + `results.json`
3. **Cache aggressively** - Data updates weekly at most
4. **Preload** - Use `<link rel="preload">` for critical data

---

## Data Quality

### Coverage
- ✅ All 10 models have trajectory data
- ✅ All 812 tasks have metadata
- ✅ 8,028 task×model combinations

### Extraction Success Rates
Some models have lower extraction rates due to data format issues:
- **High extraction** (>90%): deepsky, jace, gui_hybrid, step
- **Partial extraction**: agentoccam (8.3% - needs better parser)
- **Zero extraction**: Some models need custom parsers

To improve extraction, update `scripts/normalize_data.py` with model-specific parsers.

---

## API Usage Examples

### Fetch Leaderboard
```typescript
const leaderboard = await fetch('/data/leaderboard.json').then(r => r.json());
// No computation needed - render directly!
```

### Get Task Details
```typescript
const tasks = await fetch('/data/tasks.json').then(r => r.json());
const task = tasks.find(t => t.id === 42);
```

### Check Model Performance on Specific Task
```typescript
const results = await fetch('/data/results.json').then(r => r.json());
const taskResults = results.filter(r => r.t === 42); // Task 42
// [{m: "deepsky", s: 1}, {m: "jace", s: 0}, ...]
```

### Render Heatmap
```typescript
const heatmap = await fetch('/data/heatmap_data.json').then(r => r.json());
// Direct matrix access - no processing needed
heatmap.matrix[taskId][modelIndex] // → 0 or 1
```

---

## Future Enhancements

Potential additions:
- `trajectories/` - Processed trajectory summaries (per task)
- `model_pairs.json` - Head-to-head comparison matrix
- `template_stats.json` - Performance by intent template
- `temporal_data.json` - Performance over time (if date metadata improves)

---

## Questions?

See the main [DEPLOYMENT.md](../../../DEPLOYMENT.md) for more context.

Generated by: `scripts/normalize_data.py`
