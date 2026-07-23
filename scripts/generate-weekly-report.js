const fs = require('fs');
const path = require('path');

const today = new Date().toISOString().split('T')[0];
const reportPath = path.join(__dirname, '..', `strategy-digest-${today}.md`);

const reportContent = `
# Weekly Strategy Digest - ${today}

## 📊 Traffic & RFQ Overview (Mock Data)
- **Total Sessions**: 142 (+12% vs last week)
- **Top Product Clicks**: 
  1. TF200892 (Garden Lamp Bubble Machine) - 45 clicks
  2. TF169001 (Simulation Pottery Machine) - 32 clicks
  3. TF212709 (Ice Burst Water Gun) - 28 clicks
- **RFQ Submissions**: 5 leads from US, UK, and Germany.

## 🔍 Competitor Insights
- **Competitor A**: Launched a new series of "Glow-in-the-dark" bubble wands.
- **Competitor B**: Reduced MOQ for solar kits to 24 units.
- **Action Item**: Consider highlighting our ISO 9001 certification more prominently in the next social post.

## 💡 Recommendations
- **Product Focus**: TF200892 is getting high traction; consider adding a secondary video.
- **Marketing**: Optimize keywords for "Wholesale STEM Toys" as search volume is rising.

---
*Next automatic update: Next Monday.*
`;

fs.writeFileSync(reportPath, reportContent);
console.log(`Report generated at: ${reportPath}`);
