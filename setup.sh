#!/bin/bash

echo "🚀 Setting up VocalReach project structure..."

# Root files
touch .env
touch .env.example
touch .eslintrc.json
touch .prettierrc
touch .gitignore
touch tsconfig.json
touch tsup.config.ts
touch vitest.config.ts
touch package.json
touch README.md

# src/
mkdir -p src
touch src/index.ts
touch src/pipeline.ts

# src/stages/
mkdir -p src/stages
touch src/stages/ocean.ts
touch src/stages/prospeo.ts
touch src/stages/eazyreach.ts
touch src/stages/brevo.ts

# src/validators/
mkdir -p src/validators
touch src/validators/env.validator.ts
touch src/validators/ocean.schema.ts
touch src/validators/prospeo.schema.ts
touch src/validators/eazyreach.schema.ts
touch src/validators/brevo.schema.ts

# src/utils/
mkdir -p src/utils
touch src/utils/logger.ts
touch src/utils/limiter.ts
touch src/utils/retry.ts
touch src/utils/sleep.ts
touch src/utils/dedup.ts
touch src/utils/display.ts

# src/templates/
mkdir -p src/templates
touch src/templates/template.ts
touch src/templates/email-a.ts
touch src/templates/email-b.ts
touch src/templates/email-c.ts

# src/checkpoint/
mkdir -p src/checkpoint
touch src/checkpoint/prompt.ts
touch src/checkpoint/summary.ts

# src/snapshot/
mkdir -p src/snapshot
touch src/snapshot/save.ts
touch src/snapshot/resume.ts

# src/config/
mkdir -p src/config
touch src/config/index.ts

# src/types/
mkdir -p src/types
touch src/types/index.ts

# tests/
mkdir -p tests
touch tests/ocean.test.ts
touch tests/prospeo.test.ts
touch tests/eazyreach.test.ts
touch tests/brevo.test.ts
touch tests/pipeline.test.ts

# output/ and logs/ (gitignored)
mkdir -p output
mkdir -p logs

# Add to .gitignore
cat > .gitignore << 'EOF'
node_modules/
dist/
output/
logs/
.env
*.log
EOF

echo "✅ VocalReach structure created successfully!"
echo ""
echo "📁 Run: cd vocalreach && bash setup.sh"