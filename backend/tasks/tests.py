from django.test import TestCase
from datetime import date, timedelta
from .scoring import calculate_score

class ScoreTest(TestCase):
    def test_basic(self):
        t = {
            "title": "Test Task",
            "due_date": date.today() + timedelta(days=1),
            "estimated_hours": 2,
            "importance": 8,
            "dependencies": []
        }
        score = calculate_score(t)
        self.assertTrue(score > 0)
