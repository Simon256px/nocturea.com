// One case study per entry in src/_data/projects.js, built to
// /work/<slug>.html. Nothing to edit here when a project is added.

export default function* ({ projects }) {
  for (const project of projects) {
    yield {
      url: project.url,
      layout: "layouts/case.vto",
      title: `${project.name} — Nocturea`,
      description: project.summary,
      active: "work",
      project,
    };
  }
}
