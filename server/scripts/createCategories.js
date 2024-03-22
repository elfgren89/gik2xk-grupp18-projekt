const { sequelize, Category } = require('../models');

async function createCategories() {
  await sequelize.sync(); // await/async synkroniserar db

  const categories = [
    { name: 'Barnkalas' },
    { name: 'Examen' },
    { name: 'Födelsedag' },
    { name: 'Halloween' },
    { name: 'Möhippa' },
    { name: 'Svensexa' },
    { name: 'Säsong' },
  ];

  for (const categoryData of categories) {
    await Category.create(categoryData);
  }
  console.log('Kategorier har skapats!');
}

createCategories().catch(console.error);
