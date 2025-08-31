# Crear branch y abrir PR (local)

PowerShell commands:

git checkout -b feature/icjc-mvp-admin
git add .
git commit -m "feat: scaffold ICJC MVP admin + public site (models, seed, docs)"
git push -u origin feature/icjc-mvp-admin

Then open PR in GitHub UI with title:
"feat: ICJC sitio público dinámico + panel /admin con RBAC, workflow, bitácora y sync Facebook"
