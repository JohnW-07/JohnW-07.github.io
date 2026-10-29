/** `/resume` copy. The facts themselves live in `@/data/profile`. */
export const resumePage = {
  title: "Resume",
  description: "John Wu's résumé: experience, education, credentials and skills, with the PDF.",
  sub: "experience newest first · education, credentials and skills on the right",
  download: "[ download pdf ↓ ]",
  sections: { education: "EDUCATION", credentials: "CREDENTIALS", skills: "SKILLS" },
  keys: { school: "school", degree: "degree", graduation: "grad", gpa: "gpa", minors: "minors", program: "program" },
} as const;
