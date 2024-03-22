const { writeFileSync } = require('fs');
const sequelizeErd = require('sequelize-erd');
const db = require('../models/index'); // Anta att scripts-mappen ligger på samma nivå som models-mappen

async function generateErd() {
  const svg = await sequelizeErd({ source: db.sequelize, engine: 'dot' }); // Använder 'mermaid' som motor, men 'dot' är också ett alternativ
  writeFileSync('./erd.svg', svg);
}

generateErd().catch(console.error);
