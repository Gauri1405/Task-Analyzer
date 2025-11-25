# Task Analyzer
This project implements a lightweight task prioritization system designed as an Internship Assignment. It utilizes a weighted scoring model to evaluate urgency, importance, effort, and dependency impact to recommend the most meaningful tasks first, adhering to the "Smart Balance" strategy.DetailsGoalPrioritize tasks based on a weighted scoring algorithm.BackendDjango (Python) with Django Rest Framework (DRF)FrontendHTML, CSS, JavaScriptPrioritizationSmart Balance Strategy (Urgency, Importance, Effort, Dependencies)✨ Features ImplementedBackend (Django/DRF)API Endpoints:/api/tasks/analyze/: Accepts a list of tasks for scoring and returns prioritized results./api/tasks/suggest/: (Implied/Planned endpoint)Core Logic: Implements the Priority Scoring Algorithm defined in tasks/scoring.py.Data Handling: Uses DRF Serializers for robust input validation.Testing: Includes Unit tests for the scoring logic.Frontend (HTML + CSS + JavaScript)Input Section: Structured form fields for Title, Due Date, Estimated Hours, Importance, and Dependencies.Bulk Input: Dedicated area for pasting lists of tasks in JSON format.Output Section: Clear display of results using color-coded cards (High, Medium, Low).User Experience: Transparent, predictable, and adjustable interface.
⚙️ Installation and Setup (Windows)Follow these steps to get the full application running locally.1. PrerequisitesEnsure you have Python 3.x and Git installed.2. Setup Backend and DependenciesBash# Clone the repository
git clone https://github.com/Gauri1405/task-analyzer.git
cd task-analyzer/backend

# Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate

# Install required dependencies (Django, DRF, etc.)
pip install -r requirements.txt

# Run migrations to set up the SQLite database
python manage.py migrate
3. Run the Django ServerBash# Ensure virtual environment is active
python manage.py runserver
# Server will run on http://127.0.0.1:8000/
4. Access the FrontendThe static files are configured to be served by Django:Open your browser and navigate to the frontend entry point (e.g., http://127.0.0.1:8000/static/frontend/index.html)ORAlternatively, you can open the frontend/index.html file directly in your browser for client-side functionality testing.🧠 Priority Scoring AlgorithmThe "Smart Balance" algorithm is the central piece of logic, balancing multiple factors to determine task criticality.The core formula weights the factors as follows:$$\text{Score} = (\text{Urgency} \times 4 + \text{Importance} \times 4 + \text{Effort Factor} \times 2 + \text{Dependency Factor}) \times 25$$FactorWeightGoalUrgency4Prioritizes tasks that are closest to their due date (within 30 days).Importance4Prioritizes tasks that are deemed highly critical by the user (1-10 scale).Effort2Rewards tasks with low Estimated Hours (quick wins).Dependencies0.05Slightly rewards tasks that unblock other dependent tasks.This strategy avoids over-weighting any single factor, leading to a transparent, predictable, and adjustable prioritization system.🚀 Bonus Features (Future Work)The following features were identified as possible enhancements:Dependency Graph Visualization: Displaying the task flow and blocker relationships.Eisenhower Matrix View: Categorizing tasks into Urgent/Important quadrants.AI-Driven Adaptive Scoring: Adjusting weights based on historical user completion rates.User-Defined Weighting Profiles: Allowing users to customize the 4, 4, 2, 0.05 weights.🤝 ContributingWe welcome all contributions, bug reports, and suggestions. Please refer to the file structure (task-analyzer/) when submitting issues or pull requests.
   
6. 📝 LicenseDistributed under the MIT License.
7. 📞 ContactProject Link:  https://github.com/Gauri1405/task-analyzer.git
