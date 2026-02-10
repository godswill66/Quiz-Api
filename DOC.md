---

## 📄 2. DOC.md
**The technical "Brains" of the project—perfect for showing off your logic.**

```markdown
# Technical Documentation & Logic 🧠

## 1. Directory & Execution Logic
The project follows a modular structure where the entry point is nested in `src/server.js`. 

* **Root-Level Configuration**: `package.json` and `.env` are maintained at the root. 
* **Path Resolution Logic**: We utilize `path.resolve(__dirname, '../.env')` within `server.js`. This ensures the environment variables are correctly loaded regardless of whether the process is started from the root or the `src` folder.



## 2. Linux-Production Compatibility
During deployment on Render (Linux), we addressed **Case-Sensitivity Logic**:
* **The Problem**: Windows ignores file casing, but Linux fails if casing doesn't match exactly.
* **The Fix**: The utility `validateObjectId.js` uses strict PascalCase. We utilized `git mv` to force the Git index to recognize casing changes that are normally ignored on Windows.

## 3. The Backend Engine Logic

### A. Authentication Flow
1. User submits credentials.
2. **Bcrypt** hashes the password for storage.
3. Upon login, a **JWT** is issued, which the `authMiddleware` verifies for protected routes.



### B. Automated Grading Logic
When a user submits a quiz:
1. **Validation**: The `validateObjectId` utility ensures the Quiz ID is a valid MongoDB format.
2. **Data Aggregation**: The server uses `.populate('questions')` to fetch the correct answers from the database.
3. **Comparison Engine**: It performs a string match between `userSelectedOption` and the `isCorrect` field in the DB.
4. **Scoring Algorithm**: 
   $$Percentage = (\frac{Correct}{Total}) \times 100$$
5. **Grade Mapping**: The percentage is mapped to a letter grade ($A, B, C, D, F$) and saved to the user's result history.



## 4. Deployment Logic
* **Environment Variables**: Sensitive data is injected via Render's dashboard, keeping the `.env` out of version control for security.
* **Port Allocation**: The server uses `process.env.PORT || 3000` to adapt to Render's dynamic port assignment (typically port 10000).