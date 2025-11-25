from datetime import date

def calculate_score(task):
    today = date.today()

    days_left = (task["due_date"] - today).days
    urgency = max(0, 30 - days_left) / 30      # 0 to 1
    importance = task["importance"] / 10        # 0 to 1
    effort_factor = 1 / (task["estimated_hours"] + 1)  # small tasks higher
    dependency_factor = len(task["dependencies"]) * 0.05

    score = (
        urgency * 4 +
        importance * 4 +
        effort_factor * 2 +
        dependency_factor
    ) * 25  # scale to 0–100

    return round(score, 2)
