# Project Analysis Prompt

**Role:** Senior Full-Stack Developer & UI/UX Specialist

**Task:** Analyze the provided codebase (`as_dance_full_project`) and provide a comprehensive report.

**1. Project Structure & Code Quality**
- Review the file structure in `frontend/src` and `backend`.
- Identify any redundant, unused, or "unwanted" code (e.g., legacy logs, temporary files, commented-out blocks).
- Assess the separation of concerns (Components vs Styles vs Logic).

**2. Responsiveness & UI/UX**
- Analyze key components (`HeroSection.jsx`, `Navbar.jsx`, `Footer.jsx`, `OfferBanner.jsx`) for responsive design.
- Check `styles.css` for appropriate media queries (Mobile < 768px, Tablet < 1024px).
- **Specific Requirement:** Ensure the project works properly on Mobile, Tablet, Desktop, and Laptop.
- Identify missing mobile UI elements (e.g., Hamburger menu).

**3. Recommendations**
- Detailed list of files to delete.
- Code snippets to fix responsiveness issues.
- Suggestions to improve the "Premium Neon" aesthetic.

**Output:**
- A `clean_up_plan.md` with deletion targets.
- A `responsiveness_report.md` with identified issues and fixes.
