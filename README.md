
# amjad-portfolio

# My Project

## Project Info
"This is a personal portfolio built to showcase my work, skills, and contact information. It's developed using React and Tailwind CSS with responsive design."

**Live Demo**: [https://amjadawadallah.com](https://amjadawadallah.com)

## How to Run the Project Locally

You can run this project locally using Node.js and npm. Follow these steps:

```sh
# Step 1: Clone the repository using your Git URL.
git clone https://github.com/amjad-awad-allah/amjad-portfolio.git

# Step 2: Navigate to the project directory.
cd amjad-portfolio

# Step 3: Install the necessary dependencies.
npm install

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## How to Edit the Code

You can edit the code using any IDE or code editor (such as VS Code). After making changes, commit and push them to the GitHub repository.

You can also edit files directly in GitHub:

Navigate to the desired file(s).

Click the "Edit" button (pencil icon) at the top right of the file view.

Make your changes and commit them.

Or you can use GitHub Codespaces for an online development environment:

Go to the main page of your repository.

Click on the green "Code" button.

Select the "Codespaces" tab.

Click on "New codespace" to launch a development environment.

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- shadcn/ui
- Tailwind CSS

## Supabase Configuration

This project uses Supabase as a backend service.

The connection is configured in:
`amjad-portfolio/src/lib`

Here’s the configuration used in the project:

```js
const supabaseUrl = 'change this Text with SupbaseUrl';
const supabaseKey = 'change this Text with SupabaseKey';
```

## Deployment

You can deploy the project using platforms like Netlify, Vercel, or any static hosting provider that supports React.

## Custom Domain

This project is available at amjadawadallah.com. If you need to change the domain settings, configure them through your deployment provider.

---

## 🧱 Database Schema

This project uses a PostgreSQL database on Supabase. Below is a summary of the main tables and their structure:

<details> 
<summary><strong>📋 Personal_Info</strong></summary>

| Column Name        | Data Type | Nullable |  
|--------------------|-----------|----------|  
| id                 | integer   | NO       |  
| name               | text      | NO       |  
| date_of_birth      | date      | NO       |  
| place_of_birth     | text      | NO       |  
| current_location   | text      | NO       |  
| marital_status     | text      | NO       |  
| languages          | jsonb     | NO       |  
| cv_en              | text      | YES      |  
| cv_de              | text      | YES      |  
| work_experience_en | text      | YES      |  
| work_experience_de | text      | YES      |  
| profile_image_url  | text      | YES      |  
| email              | text      | YES      |  
| phone_number       | text      | YES      |  
| linkedin_url       | text      | YES      |  
| github_url         | text      | YES      |  

</details>

<details> 
<summary><strong>💼 Professional_Experience</strong></summary>

| Column Name        | Data Type | Nullable |  
|--------------------|-----------|----------|  
| id                 | integer   | NO       |  
| company_name       | text      | NO       |  
| position           | text      | NO       |  
| start_date         | date      | NO       |  
| end_date           | date      | NO       |  
| description_en     | text      | NO       |  
| description_de     | text      | NO       |  

</details>

<details> 
<summary><strong>🚀 Projects</strong></summary>

| Column Name        | Data Type  | Nullable |  
|--------------------|------------|----------|  
| id                 | integer    | NO       |  
| project_name       | text       | NO       |  
| experience_id      | integer    | YES      |  
| description_en     | text       | NO       |  
| description_de     | text       | NO       |  
| technologies_used  | jsonb      | NO       |  
| achievements       | jsonb      | NO       |  
| image_url          | text       | YES      |  

</details>

<details> 
<summary><strong>🧠 Technical_Skills</strong></summary>

| Column Name          | Data Type | Nullable |  
|----------------------|-----------|----------|  
| id                   | integer   | NO       |  
| skill_category       | text      | NO       |  
| skill_name           | text      | NO       |  
| proficiency_level_en | text      | NO       |  
| proficiency_level_de | text      | NO       |  

</details>

<details> 
<summary><strong>🎓 Education</strong></summary>

| Column Name         | Data Type | Nullable |  
|---------------------|-----------|----------|  
| id                  | integer   | NO       |  
| institution_name    | text      | NO       |  
| degree_en           | text      | NO       |  
| degree_de           | text      | NO       |  
| field_of_study_en   | text      | NO       |  
| field_of_study_de   | text      | NO       |  
| start_date          | date      | NO       |  
| end_date            | date      | NO       |  

</details>

<details> 
<summary><strong>📜 Certifications</strong></summary>

| Column Name         | Data Type | Nullable |  
|---------------------|-----------|----------|  
| id                  | integer   | NO       |  
| certification_name_en | text    | NO       |  
| certification_name_de | text    | NO       |  
| issuing_organization | text     | NO       |  
| date_obtained       | date      | NO       |  

</details>

---

## ☁️ Deployment

This project can be deployed using:

- Vercel (recommended)
- Netlify
- Any other static hosting provider that supports React/Vite

To connect your domain (amjadawadallah.com), refer to your hosting provider's domain settings.

## 📝 Editing the Code

You can edit the code using any code editor (e.g., VS Code). After making changes:

```bash
git add .
git commit -m "your message"
git push
```

Alternatively, use GitHub Codespaces for an online editor:

Go to your repository on GitHub.

Click the green Code button.

Select the Codespaces tab.

Click New codespace.

---

## 📬 Contact

For inquiries or collaborations, feel free to reach out via:

- Email: [amjad.awadallah93@gmail.com](mailto:amjad.awadallah93@gmail.com)
- LinkedIn: [www.linkedin.com/in/amjad-awad-allah](https://www.linkedin.com/in/amjad-awad-allah)
- GitHub: [https://github.com/amjad-awad-allah](https://github.com/amjad-awad-allah)
```
