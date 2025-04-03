const categoriesVehicleTypes = require('../json/categoriesVehicleTypes');

/**
 * Catégorise un type de véhicule en fonction des catégories définies.
 * @param {string} type - Type de véhicule généré
 * @returns {string} - Catégorie du véhicule ou 'unknown' si non trouvé
 */
const categorizeVehicleType = (type) => {
  return Object.keys(categoriesVehicleTypes).find(category =>
    categoriesVehicleTypes[category].includes(type)
  ) || 'unknown';
};

module.exports = { categorizeVehicleType };