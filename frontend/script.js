// --- 1. CORE SCORING LOGIC ---

/**
 * Calculates a prioritization score for a task based on urgency, importance, and effort.
 * NOTE: The task's due_date must be a Date object for this function to work.
 * @param {object} task - The task object containing title, due_date, estimated_hours, importance, and dependencies.
 * @returns {number} The calculated score (0-100).
 */
function calculate_score(task) {
    // Ensure due_date is a Date object (it comes as a string from the form)
    const today = new Date();
    // Reset time for accurate day comparison
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.due_date);
    dueDate.setHours(0, 0, 0, 0);

    const ms_per_day = 1000 * 60 * 60 * 24;
    const days_left = Math.ceil((dueDate.getTime() - today.getTime()) / ms_per_day);
    
    // 0 to 1. Closer tasks score higher, maxing out at 1 for tasks due today or past.
    // We cap the urgency boost to tasks due within 30 days.
    const urgency = Math.max(0, 30 - days_left) / 30; 
    
    // 0 to 1. Assumes importance is 0-10.
    const importance = task.importance / 10; 
    
    // Small tasks score higher (e.g., 1 hour -> 0.5, 9 hours -> 0.1)
    const effort_factor = 1 / (task.estimated_hours + 1); 
    
    // Minimal boost for tasks that are blocking others
    const dependencies_count = task.dependencies ? task.dependencies.length : 0;
    const dependency_factor = dependencies_count * 0.05;

    // Weighted Score Formula: (Urgency * 4 + Importance * 4 + Effort * 2 + Dependencies * 0.05) * 25
    const score = (
        urgency * 4 +
        importance * 4 +
        effort_factor * 2 +
        dependency_factor
    ) * 25; // scale to 0–100

    return Math.round(score * 100) / 100; // Round to 2 decimal places
}

/**
 * Maps the numerical score to a priority level and badge class.
 * This determines the color and text displayed on the UI card.
 * @param {number} score - The task's prioritization score.
 * @returns {object} {level: "High/Medium/Low", class: "high/medium/low"}
 */
function get_priority(score) {
    if (score >= 70) { // Example threshold for High
        return { level: "High", class: "high" };
    } else if (score >= 40) { // Example threshold for Medium
        return { level: "Medium", class: "medium" };
    } else {
        return { level: "Low", class: "low" };
    }
}


// --- 2. INPUT & PARSING LOGIC ---

/**
 * Gets a task object from the individual form inputs.
 * @returns {object|null} A single task object or null if validation fails.
 */
function getTaskFromForm() {
    const title = document.getElementById('title').value.trim();
    const dueDate = document.getElementById('due-date').value;
    const hours = parseInt(document.getElementById('estimated-hours').value);
    const importance = parseInt(document.getElementById('importance').value);
    const dependenciesRaw = document.getElementById('dependencies').value.trim();

    if (!title || !dueDate || isNaN(hours) || isNaN(importance)) {
        return null;
    }
    
    // Simple way to handle dependencies: split by comma and filter empty strings
    const dependencies = dependenciesRaw ? dependenciesRaw.split(',').map(d => d.trim()).filter(d => d) : [];

    return {
        title: title,
        due_date: dueDate, // Stored as YYYY-MM-DD string
        estimated_hours: hours,
        importance: importance,
        dependencies: dependencies
    };
}

/**
 * Parses a list of tasks from the JSON textarea.
 * @returns {Array<object>} An array of task objects.
 */
function getTasksFromJSON() {
    const jsonText = document.getElementById('json-list').value.trim();
    if (!jsonText) return [];

    try {
        const tasks = JSON.parse(jsonText);
        // Basic validation: ensure it's an array
        if (Array.isArray(tasks)) {
            return tasks;
        }
        alert("JSON format error: Input must be a valid JSON array.");
        return [];
    } catch (e) {
        alert("JSON parsing error: Please check your JSON syntax.");
        console.error("JSON Error:", e);
        return [];
    }
}


// --- 3. RENDERING LOGIC ---

/**
 * Generates the HTML markup for a single task card.
 * @param {object} task - The task object with an added 'score' property.
 * @returns {string} The HTML string for the task card.
 */
function renderTaskCard(task) {
    const priority = get_priority(task.score);
    
    // Example description based on priority and dependencies
    let description = "";
    if (priority.level === "High") {
        description = `Urgent task with high importance. Score: ${task.score}`;
    } else if (priority.level === "Medium") {
        description = `Moderately urgent task. Score: ${task.score}`;
    } else {
        description = `Lower priority task due further out. Score: ${task.score}`;
    }
    if (task.dependencies && task.dependencies.length > 0) {
        description += `. Blocks ${task.dependencies.length} task(s).`;
    }

    return `
        <div class="task-card ${priority.class}">
            <span class="priority-badge ${priority.class}">${priority.level}</span>
            <h3>${task.title}</h3>
            <p>Due date: ${task.due_date}</p>
            <p>Estimated hours: ${task.estimated_hours}</p>
            <p>Importance: ${task.importance}</p>
            <p class="description">${description}</p>
        </div>
    `;
}

/**
 * Main function to run the analysis and display results.
 */
function analyzeTasks() {
    const formTask = getTaskFromForm();
    const jsonTasks = getTasksFromJSON();

    let allTasks = [];
    if (formTask) {
        allTasks.push(formTask);
    }
    allTasks = allTasks.concat(jsonTasks);

    if (allTasks.length === 0) {
        document.getElementById('results-list').innerHTML = "<p style='text-align: center; color: #888;'>No tasks provided for analysis.</p>";
        return;
    }

    // 1. Calculate Score for all tasks
    const scoredTasks = allTasks.map(task => {
        // Ensure data integrity before scoring
        if (task.title && task.due_date && task.estimated_hours && task.importance) {
            task.score = calculate_score(task);
        } else {
            // Assign a minimum score if data is incomplete
            task.score = 0; 
        }
        return task;
    });

    // 2. Sort the tasks by score (descending)
    scoredTasks.sort((a, b) => b.score - a.score);

    // 3. Render the results
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = scoredTasks.map(renderTaskCard).join('');
}


// --- 4. EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    // Attach the analysis function to the button click
    const analyzeButton = document.getElementById('analyze-button');
    analyzeButton.addEventListener('click', (event) => {
        // Prevent default form submission if it were inside a <form>
        event.preventDefault(); 
        analyzeTasks();
    });

    // Optional: Run analysis on change of sorting strategy
    const sortingStrategy = document.getElementById('sorting-strategy');
    sortingStrategy.addEventListener('change', () => {
        // Re-analyze or re-sort the existing data when strategy changes
        // For simplicity, we just trigger a full analysis here.
        analyzeTasks();
    });
});