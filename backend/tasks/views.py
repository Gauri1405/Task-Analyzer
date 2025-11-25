import json
from datetime import date
from django.http import JsonResponse
from .scoring import calculate_score

def analyze_tasks(request):
    data = json.loads(request.body)
    tasks = data.get("tasks", [])

    final = []

    for t in tasks:
        score = calculate_score({
            "title": t["title"],
            "due_date": date.fromisoformat(t["due_date"]),
            "estimated_hours": t["estimated_hours"],
            "importance": t["importance"],
            "dependencies": t.get("dependencies", [])
        })

        t2 = t.copy()
        t2["score"] = score
        final.append(t2)

    final = sorted(final, key=lambda x: x["score"], reverse=True)

    return JsonResponse({"tasks": final})


def suggest_tasks(request):
    # for simplicity, demo data
    sample = [
        {
            "title": "Fix login",
            "due_date": "2025-11-20",
            "estimated_hours": 2,
            "importance": 8,
            "dependencies": []
        }
    ]
    return JsonResponse({"top_3": sample})
