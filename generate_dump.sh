#!/bin/bash
OUTPUT="/Users/tourist/Desktop/VaultPay_Complete_Source.txt"
echo "================================================================" > "$OUTPUT"
echo "               VAULTPAY COMPLETE SOURCE AND DOCUMENTATION       " >> "$OUTPUT"
echo "================================================================" >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "==================== 1. PROJECT REPORT ====================" >> "$OUTPUT"
cat /Users/tourist/.gemini/antigravity-ide/brain/c9735cdf-1bba-4ba0-b218-36a34f3a6507/VaultPay_Project_Report.md >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "==================== 2. MEGA PROMPT ====================" >> "$OUTPUT"
cat /Users/tourist/.gemini/antigravity-ide/brain/c9735cdf-1bba-4ba0-b218-36a34f3a6507/VaultPay_Full_Prompt.md >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "==================== 3. FRONTEND SOURCE CODE ====================" >> "$OUTPUT"
find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.css" \) -not -path "*/node_modules/*" | while read file; do
  echo "--- FILE: $file ---" >> "$OUTPUT"
  cat "$file" >> "$OUTPUT"
  echo "" >> "$OUTPUT"
done

echo "==================== 4. BACKEND SOURCE CODE ====================" >> "$OUTPUT"
find backend -type f \( -name "*.ts" -o -name "*.prisma" \) -not -path "*/node_modules/*" -not -path "*/dist/*" | while read file; do
  echo "--- FILE: $file ---" >> "$OUTPUT"
  cat "$file" >> "$OUTPUT"
  echo "" >> "$OUTPUT"
done

echo "==================== 5. CONFIGURATION FILES ====================" >> "$OUTPUT"
echo "--- FILE: package.json (Frontend) ---" >> "$OUTPUT"
cat package.json >> "$OUTPUT"
echo "" >> "$OUTPUT"
echo "--- FILE: backend/package.json (Backend) ---" >> "$OUTPUT"
cat backend/package.json >> "$OUTPUT"
echo "" >> "$OUTPUT"

echo "Done generating massive source dump."
