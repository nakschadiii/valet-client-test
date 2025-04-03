const { fakerFR } = require("@faker-js/faker");
const { v4: uuidv4 } = require("uuid"); // Pour générer des UUID uniques
const supabase = require("../utils/supabase");
const { categorizeVehicleType } = require("./car.types");

/**
 * Génère un plan de parking avec des véhicules aléatoires
 * @param {number} rows - Nombre de lignes
 * @param {number} cols - Nombre de colonnes
 * @returns {Array} - Tableau d'emplacements avec ID unique
 */
const generateParkingLayout = (rows, cols) => {
  if (rows <= 0 || cols <= 0) {
    throw new Error("Le nombre de lignes et de colonnes doit être positif.");
  }

  return Array.from({ length: rows * cols }, (_, index) => ({
    id: uuidv4(),
    x: Math.floor(index / cols),
    y: index % cols,
    vehicleType: categorizeVehicleType(fakerFR.vehicle.type()),
  }));
};

/**
 * Récupère un parking par son nom et sa ville
 * @param {string} city - Nom de la ville
 * @param {string} name - Nom du parking
 * @returns {object|null} - Données du parking ou null en cas d'erreur
 */
const getParkingLotByNameAndCity = async (city, name) => {
  if (!city || !name) {
    throw new Error("Le nom de la ville et du parking sont obligatoires.");
  }

  const { data, error } = await supabase
    .from("parking_lots")
    .select("*")
    .eq("city", city)
    .eq("name", name)
    .maybeSingle();

  if (error) {
    //console.error("❌ Erreur lors de la récupération du parking :", error);
    return null;
  }

  return data;
};

/**
 * Insère un parking dans la base de données avec validation
 * @param {string} city - Nom de la ville
 * @param {string} name - Nom du parking
 * @param {number} rows - Nombre de lignes
 * @param {number} cols - Nombre de colonnes
 * @returns {object|null} - Données du parking inséré ou null en cas d'erreur
 */
const generateParkingLot = async (city, name, rows = 5, cols = 10) => {
  if (!city || !name) {
    throw new Error("Le nom de la ville et du parking sont obligatoires.");
  }

  if (rows <= 0 || cols <= 0) {
    throw new Error("Les dimensions du parking doivent être positives.");
  }

  const existingParking = await getParkingLotByNameAndCity(city, name);
  if (existingParking) {
    throw new Error("Un parking avec ce nom existe déjà dans cette ville.");
  }

  const layout = generateParkingLayout(rows, cols);
  const { data, error } = await supabase
    .from("parking_lots")
    .insert([{ city, name, layout }])
    .select();

  if (error) {
    //console.error("❌ Erreur lors de l'insertion du parking :", error);
    return null;
  }

  return data[0];
};


/**
 * Récupère un parking spécifique à partir de son ID
 * @param {string} id - L'ID du parking à récupérer
 * @returns {Object|null} - Le parking ou null en cas d'erreur
 */
const getParkingLot = async (id) => {
  const { data, error } = await supabase
    .from("parking_lots")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    //console.error("❌ Erreur lors de la récupération du parking :", error);
    return null;
  }

  return data;
};

/**
 * Récupère tous les parkings stockés dans la base de données
 * @returns {Array|null} - Tableau des parkings ou null en cas d'erreur
 */
const getParkingLots = async () => {
  const { data, error } = await supabase.from("parking_lots").select("*");

  if (error) {
    //console.error("❌ Erreur lors de la récupération des parkings :", error);
    return null;
  }

  return data;
};

/**
 * Met à jour un parking existant
 * @param {string} id - ID du parking à modifier
 * @param {Object} updates - Champs à mettre à jour
 * @returns {object|null} - Données mises à jour ou null en cas d'erreur
 */
const updateParkingLot = async (id, updates) => {
  const { data, error } = await supabase
    .from("parking_lots")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) {
    //console.error("❌ Erreur lors de la mise à jour du parking :", error);
    return null;
  }

  return data[0];
};

/**
 * Supprime un parking par son ID
 * @param {string} id - ID du parking à supprimer
 * @returns {boolean} - true si suppression réussie, sinon false
 */
const deleteParkingLot = async (id) => {
  const { data } = await supabase
    .from("parking_lots")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    //console.warn("⚠️ Parking not found with ID:", id, data);
    return false;
  }

  const { error } = await supabase.from("parking_lots").delete().eq("id", id);

  if (error) {
    //console.error("❌ Erreur lors de la suppression du parking :", error);
    return false;
  }

  return true;
};

module.exports = {
  generateParkingLayout,
  generateParkingLot,
  getParkingLots,
  getParkingLotByNameAndCity,
  getParkingLot,
  updateParkingLot,
  deleteParkingLot
};