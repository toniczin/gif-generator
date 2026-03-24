require('dotenv').config();

module.exports = {
  apiKey: process.env.CREATOMATE_API_KEY,
  templateId: process.env.TEMPLATE_ID,
  outputDir: './output',
};
