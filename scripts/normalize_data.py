#!/usr/bin/env python3
"""
WebArena Data Normalization Script

This script extracts performance data from trajectory files and generates
normalized JSON files for the web frontend.

Output files (in web/public/data/):
- models.json: Model metadata (10 models, ~2KB)
- tasks.json: Task metadata (812 tasks, ~200KB)
- results.json: Normalized results (8000+ records, ~440KB)
- leaderboard.json: Pre-aggregated leaderboard with domain breakdown (~7KB)
- task_difficulty.json: Per-task statistics (~128KB)
- heatmap_data.json: Full performance matrix for visualization (~104KB)

Total size: ~881KB (uncompressed), ~200KB gzipped

Usage:
    python scripts/normalize_data.py
"""

import json
import re
from collections import defaultdict
from pathlib import Path

def extract_task_id_from_filename(filename):
    """Extract task ID from various filename formats"""
    patterns = [
        r'^(\d+)\.json',
        r'task_(\d+)',
        r'webarena_(\d+)',
        r'task_summary_flat_(\d+)',
    ]
    for pattern in patterns:
        match = re.search(pattern, filename)
        if match:
            return int(match.group(1))
    return None

def extract_results_deepsky(file_path):
    """Extract from DeepSky format"""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            data = json.load(f)
            return data.get('task_id'), data.get('success')
    except:
        return None, None

def extract_results_jace(line):
    """Extract from Jace JSONL format"""
    try:
        data = json.loads(line)
        return data.get('task_id'), data.get('result', {}).get('success')
    except:
        return None, None

def extract_results_gui_hybrid(line):
    """Extract from GUI Hybrid JSONL format"""
    try:
        data = json.loads(line)
        return data.get('task_id'), data.get('correct')
    except:
        return None, None

def extract_results_step(file_path):
    """Extract from SteP format - has trajectory with success info"""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read(50000)  # Read first 50KB
            data = json.loads(content)
            task_id = data.get('id')
            trajectory = data.get('trajectory', [])
            if trajectory and len(trajectory) > 0:
                last_step = trajectory[-1]
                success = last_step.get('success')
                return task_id, success
    except:
        pass
    return None, None

def extract_results_agentoccam(file_path):
    """Extract from AgentOccam format"""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read(50000)
            data = json.loads(content)
            task_id = data.get('id')
            trajectory = data.get('trajectory', [])
            if trajectory and len(trajectory) > 0:
                last_step = trajectory[-1]
                success = last_step.get('success')
                return task_id, success
    except:
        pass
    return None, None

def extract_results_narada(file_path):
    """Extract from Narada format - has score field (1.0 = success, 0.0 = failure)"""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read(100000)  # Read first 100KB
            data = json.loads(content)
            # Extract task ID from filename
            task_id = extract_task_id_from_filename(file_path.name)
            score = data.get('score')
            if score is not None:
                success = score >= 0.5  # Score of 1.0 means success, 0.0 means failure
                return task_id, success
    except:
        pass
    return None, None

def extract_results_ibm_cuga(file_path):
    """Extract from IBM CUGA format - trajectory-only files without success data"""
    # IBM CUGA files don't have success data embedded, return None
    # Task ID can still be extracted for tracking
    try:
        task_id = extract_task_id_from_filename(file_path.name)
        return task_id, None
    except:
        return None, None

def extract_results_openai_operator(file_path):
    """Extract from OpenAI Operator format - list of messages without success data"""
    # OpenAI Operator files don't have success data embedded
    try:
        task_id = extract_task_id_from_filename(file_path.name)
        return task_id, None
    except:
        return None, None

def extract_results_scribeagent(file_path):
    """Extract from ScribeAgent format"""
    # ScribeAgent files need investigation
    try:
        task_id = extract_task_id_from_filename(file_path.name)
        return task_id, None
    except:
        return None, None

def extract_results_learn_by_interact(file_path):
    """Extract from Learn-by-Interact format"""
    # Learn-by-Interact files need investigation
    try:
        task_id = extract_task_id_from_filename(file_path.name)
        return task_id, None
    except:
        return None, None

def main():
    # Configuration
    trajectories_dir = Path("data/trajectories")
    test_tasks_file = Path("data/test.raw.json")
    leaderboard_file = Path("data/leaderboard.json")
    output_dir = Path("web/public/data")

    print("=" * 100)
    print("WEBARENA DATA NORMALIZATION SCRIPT")
    print("=" * 100)

    # Load test tasks metadata
    print("\n[1/6] Loading task metadata from test.raw.json...")
    with open(test_tasks_file, 'r') as f:
        test_tasks = json.load(f)
    print(f"   ✓ Loaded {len(test_tasks)} tasks")

    # Load leaderboard for model metadata
    print("\n[2/6] Loading leaderboard metadata...")
    with open(leaderboard_file, 'r') as f:
        leaderboard_data = json.load(f)
        leaderboard_entries = leaderboard_data['leaderboard']
    print(f"   ✓ Loaded {len(leaderboard_entries)} models from leaderboard")

    # Define model mapping
    model_dirs = {
        "agent_o_cam_trajectories": "agentoccam",
        "deepsky_trajectories": "deepsky",
        "ibm_cuga_webarena_trajectories": "ibm_cuga",
        "jace_zetalabs_trajectories": "jace",
        "learn_by_interact_trajectoties": "learn_by_interact",
        "narada_ai_trajectories": "narada",
        "oai_cua_trajectories": "openai_operator",
        "scribeagent_trajectories": "scribeagent",
        "gui_hybrid_trajectories": "gui_hybrid",
        "step_trajectories": "step"
    }

    # Extraction methods per model
    extraction_methods = {
        "deepsky": extract_results_deepsky,
        "step": extract_results_step,
        "agentoccam": extract_results_agentoccam,
        "narada": extract_results_narada,
        "ibm_cuga": extract_results_ibm_cuga,
        "openai_operator": extract_results_openai_operator,
        "scribeagent": extract_results_scribeagent,
        "learn_by_interact": extract_results_learn_by_interact,
    }

    print("\n[3/6] Extracting results from trajectory files...")
    print("   This may take a minute...")

    # Extract results for all models
    all_results = defaultdict(dict)  # {model_id: {task_id: success}}

    for dir_name, model_id in model_dirs.items():
        dir_path = trajectories_dir / dir_name

        print(f"\n   Processing {model_id}...", end=" ")

        if dir_name == "jace_zetalabs_trajectories":
            # JSONL file
            count = 0
            with open(dir_path, 'r', encoding='utf-8', errors='ignore') as f:
                for line in f:
                    task_id, success = extract_results_jace(line)
                    if task_id is not None:
                        all_results[model_id][task_id] = success
                        count += 1
            print(f"✓ {count} tasks")

        elif dir_name == "gui_hybrid_trajectories":
            # Multiple JSONL files
            count = 0
            for file in dir_path.glob("*.jsonl"):
                with open(file, 'r', encoding='utf-8', errors='ignore') as f:
                    for line in f:
                        task_id, success = extract_results_gui_hybrid(line)
                        if task_id is not None:
                            all_results[model_id][task_id] = success
                            count += 1
            print(f"✓ {count} tasks")

        elif dir_path.is_dir():
            # JSON files in directory or subdirectories
            json_files = list(dir_path.glob("*.json"))

            if not json_files:
                # Check subdirectories
                json_files = []
                for subdir in dir_path.iterdir():
                    if subdir.is_dir():
                        json_files.extend(subdir.glob("*.json"))

            count = 0
            extraction_fn = extraction_methods.get(model_id, extract_results_deepsky)

            for file in json_files:
                task_id, success = extraction_fn(file)
                if task_id is None:
                    # Fallback to filename
                    task_id = extract_task_id_from_filename(file.name)

                if task_id is not None:
                    all_results[model_id][task_id] = success
                    count += 1

            print(f"✓ {count} tasks")

    print(f"\n   Extraction complete!")
    print(f"   Total models with data: {len(all_results)}")

    # Show summary
    print("\n   Summary by model:")
    for model_id in sorted(all_results.keys()):
        total = len(all_results[model_id])
        successes = sum(1 for v in all_results[model_id].values() if v)
        rate = (successes / total * 100) if total > 0 else 0
        print(f"     {model_id:20} {total:4} tasks, {successes:4} successes ({rate:5.1f}%)")

    print("\n[4/6] Building normalized data structures...")

    # Build models.json
    model_name_map = {
        "deepsky": "DeepSky Agent",
        "jace": "Jace.AI",
        "gui_hybrid": "GUI-API Hybrid",
        "agentoccam": "AgentOccam",
        "ibm_cuga": "IBM CUGA",
        "learn_by_interact": "Learn-by-Interact",
        "narada": "Narada AI",
        "openai_operator": "OpenAI Operator",
        "scribeagent": "ScribeAgent",
        "step": "SteP"
    }

    models = []
    # Create reverse map for quick lookup
    official_success_rates = {}
    for entry in leaderboard_entries:
        model_name = entry.get('Model', '')
        # Find matching model_id
        model_id = None
        for mid, mname in model_name_map.items():
            if mname.lower() in model_name.lower() or model_name.lower() in mname.lower():
                model_id = mid
                break

        if model_id:
            official_success_rates[model_id] = {
                "name": model_name,
                "date": entry.get('a'),
                "open": entry.get('Open?') == '✓',
                "size_b": entry.get('Model Size (billion)'),
                "official_rate": float(entry.get('Success Rate (%)', 0)),
            }

    # Build models list with trajectory data availability
    for model_id, model_name in model_name_map.items():
        if model_id in official_success_rates:
            official_data = official_success_rates[model_id]
            has_traj = model_id in all_results
            models.append({
                "id": model_id,
                "name": official_data['name'],
                "date": official_data['date'],
                "open": official_data['open'],
                "size_b": official_data['size_b'],
                "success_rate": official_data['official_rate'],
                "has_trajectories": has_traj
            })

    print(f"   ✓ Built {len(models)} model entries")

    # Build tasks.json
    tasks = []
    for task in test_tasks:
        tasks.append({
            "id": task['task_id'],
            "intent": task['intent'],
            "site": task['sites'][0] if task['sites'] else 'unknown',
            "template_id": task.get('intent_template_id'),
            "eval_type": task['eval']['eval_types'][0] if task['eval'].get('eval_types') else 'unknown',
            "reference_answer": str(task['eval'].get('reference_answers', {}))[:100]
        })

    print(f"   ✓ Built {len(tasks)} task entries")

    # Build results.json (normalized format)
    results = []
    for model_id, task_results in all_results.items():
        for task_id, success in task_results.items():
            results.append({
                "t": task_id,
                "m": model_id,
                "s": 1 if success else 0
            })

    print(f"   ✓ Built {len(results)} result entries")

    print("\n[5/6] Generating aggregated files...")

    # Generate leaderboard.json with domain breakdown
    leaderboard_output = []
    for model in models:
        model_id = model['id']

        # Use official success rate from leaderboard
        official_rate = model['success_rate']

        # If we have trajectory data, calculate domain breakdown
        domain_breakdown = {}
        if model_id in all_results:
            model_results = all_results[model_id]
            total = len(model_results)
            successes = sum(1 for v in model_results.values() if v)

            # Domain breakdown (only for models with trajectory data)
            domain_stats = defaultdict(lambda: {'success': 0, 'total': 0})
            for task_id, success in model_results.items():
                task_meta = next((t for t in test_tasks if t['task_id'] == task_id), None)
                if task_meta:
                    domain = task_meta['sites'][0] if task_meta['sites'] else 'unknown'
                    domain_stats[domain]['total'] += 1
                    if success:
                        domain_stats[domain]['success'] += 1

            # Calculate rates
            for domain in domain_stats:
                s = domain_stats[domain]['success']
                t = domain_stats[domain]['total']
                domain_stats[domain]['rate'] = round((s / t * 100), 1) if t > 0 else 0

            domain_breakdown = dict(domain_stats)

            leaderboard_output.append({
                "id": model_id,
                "name": model['name'],
                "total_tasks": total,
                "successes": successes,
                "success_rate": official_rate,  # Use official rate
                "domain_breakdown": domain_breakdown,
                "has_trajectories": True
            })
        else:
            # Model without trajectory data - use official overall rate only
            # Estimate total tasks and successes based on official rate
            total_tasks = 812  # Standard WebArena task count
            estimated_successes = int(total_tasks * official_rate / 100)

            leaderboard_output.append({
                "id": model_id,
                "name": model['name'],
                "total_tasks": total_tasks,
                "successes": estimated_successes,
                "success_rate": official_rate,
                "domain_breakdown": {},  # No domain data available
                "has_trajectories": False
            })

    # Sort by official success rate
    leaderboard_output.sort(key=lambda x: x['success_rate'], reverse=True)
    for i, entry in enumerate(leaderboard_output):
        entry['rank'] = i + 1

    print(f"   ✓ Generated leaderboard with {len(leaderboard_output)} models")

    # Generate task_difficulty.json
    task_difficulty = []
    for task in test_tasks:
        task_id = task['task_id']
        success_count = 0
        passing_models = []

        for model_id, task_results in all_results.items():
            if task_id in task_results and task_results[task_id]:
                success_count += 1
                passing_models.append(model_id)

        total_models = len(all_results)
        success_rate = round((success_count / total_models * 100), 1) if total_models > 0 else 0

        # Categorize difficulty
        if success_rate >= 80:
            difficulty = "easy"
        elif success_rate >= 40:
            difficulty = "medium"
        elif success_rate >= 20:
            difficulty = "hard"
        else:
            difficulty = "very_hard"

        task_difficulty.append({
            "id": task_id,
            "success_count": success_count,
            "success_rate": success_rate,
            "difficulty": difficulty,
            "passing_models": passing_models
        })

    print(f"   ✓ Generated task difficulty for {len(task_difficulty)} tasks")

    # Generate heatmap_data.json (full matrix)
    model_ids = sorted(all_results.keys())
    task_ids = sorted(set(task['task_id'] for task in test_tasks))

    # Build matrix
    matrix = []
    for task_id in task_ids:
        row = []
        for model_id in model_ids:
            success = all_results[model_id].get(task_id, None)
            row.append(1 if success else 0 if success is False else None)
        matrix.append(row)

    heatmap_data = {
        "model_ids": model_ids,
        "task_ids": task_ids,
        "matrix": matrix
    }

    print(f"   ✓ Generated heatmap data ({len(task_ids)} tasks × {len(model_ids)} models)")

    print("\n[6/6] Writing output files...")

    # Create output directory
    output_dir.mkdir(parents=True, exist_ok=True)

    # Write all JSON files
    files_written = []

    with open(output_dir / "models.json", 'w') as f:
        json.dump(models, f, indent=2)
        files_written.append(("models.json", len(models), "models"))

    with open(output_dir / "tasks.json", 'w') as f:
        json.dump(tasks, f, indent=2)
        files_written.append(("tasks.json", len(tasks), "tasks"))

    with open(output_dir / "results.json", 'w') as f:
        json.dump(results, f, indent=2)
        files_written.append(("results.json", len(results), "results"))

    with open(output_dir / "leaderboard.json", 'w') as f:
        json.dump(leaderboard_output, f, indent=2)
        files_written.append(("leaderboard.json", len(leaderboard_output), "models"))

    with open(output_dir / "task_difficulty.json", 'w') as f:
        json.dump(task_difficulty, f, indent=2)
        files_written.append(("task_difficulty.json", len(task_difficulty), "tasks"))

    with open(output_dir / "heatmap_data.json", 'w') as f:
        json.dump(heatmap_data, f, indent=2)
        files_written.append(("heatmap_data.json", f"{len(task_ids)}×{len(model_ids)}", "matrix"))

    print(f"\n   Files written to {output_dir}:")
    for filename, count, unit in files_written:
        file_size = (output_dir / filename).stat().st_size
        print(f"     ✓ {filename:25} ({count} {unit:10}, {file_size/1024:6.1f} KB)")

    # Calculate total size
    total_size = sum((output_dir / f[0]).stat().st_size for f in files_written)
    print(f"\n   Total size: {total_size / 1024:.1f} KB")

    print("\n" + "=" * 100)
    print("✅ NORMALIZATION COMPLETE!")
    print("=" * 100)
    print("\nNext steps:")
    print("  1. Review generated files in web/public/data/")
    print("  2. Ready to build frontend components")
    print("  3. Frontend can fetch these JSONs directly")

if __name__ == "__main__":
    main()
