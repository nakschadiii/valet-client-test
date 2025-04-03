const supabase = require("../utils/supabase");
const { categorizeVehicleType } = require("./car.types");
const { getReservations } = require("./parking.reservations");

/**
 * Récupère toutes les places de parking pour un parking spécifique
 * @param {string} parkingId - ID du parking
 * @returns {Array|null} - Liste des places de parking ou null en cas d'erreur
 */
const getAllParkingSpots = async (parkingId) => {
  const { data, error } = await supabase
    .from('parking_lots')
    .select('layout')
    .eq('id', parkingId)
    .single();

  if (error) {
    console.error("❌ Erreur lors de la récupération des places de parking :", error);
    return null;
  }

  return data ? data.layout : null;
};

/**
 * Récupère une place de parking spécifique par son ID de place dans le parking
 * @param {string} parkingId - ID du parking
 * @param {string} spotId - ID de la place
 * @returns {object|null} - Place spécifique ou null en cas d'erreur
 */
const getParkingSpotById = async (parkingId, spotId) => {
  const spots = await getAllParkingSpots(parkingId);
  if (!spots) return null;

  const spot = spots.find(spot => spot.id === spotId);
  return spot || null;
};

/**
 * Ajoute une place de parking dans le layout du parking
 * @param {string} parkingId - ID du parking
 * @param {object} newSpot - Nouvelle place à ajouter
 * @returns {object|null} - Données du parking mis à jour ou null en cas d'erreur
 */
const addParkingSpot = async (parkingId, newSpot) => {
  const { data, error } = await supabase
    .from('parking_lots')
    .select('layout')
    .eq('id', parkingId)
    .single();

  if (error) {
    console.error("❌ Erreur lors de la récupération du parking :", error);
    return null;
  }

  const updatedLayout = [...data.layout, newSpot]; // Ajoute la nouvelle place au layout

  // Met à jour le parking avec la nouvelle place ajoutée
  const { data: updatedParking, error: updateError } = await supabase
    .from('parking_lots')
    .update({ layout: updatedLayout })
    .eq('id', parkingId)
    .select();

  if (updateError) {
    console.error("❌ Erreur lors de la mise à jour du parking :", updateError);
    return null;
  }

  return updatedParking[0]; // Retourne le parking mis à jour
};

/**
 * Met à jour une place existante dans le layout d'un parking
 * @param {string} parkingId - ID du parking
 * @param {string} spotId - ID de la place à mettre à jour
 * @param {object} updatedSpot - Données mises à jour de la place
 * @returns {object|null} - Données du parking mis à jour ou null en cas d'erreur
 */
const updateParkingSpot = async (parkingId, spotId, updatedSpot) => {
  const { data, error } = await supabase
    .from('parking_lots')
    .select('layout')
    .eq('id', parkingId)
    .single();

  if (error) {
    console.error("❌ Erreur lors de la récupération du parking :", error);
    return null;
  }

  // Recherche et met à jour la place
  const updatedLayout = data.layout.map(spot => 
    spot.id === spotId ? { ...spot, ...updatedSpot } : spot
  );

  // Met à jour le parking avec la place modifiée
  const { data: updatedParking, error: updateError } = await supabase
    .from('parking_lots')
    .update({ layout: updatedLayout })
    .eq('id', parkingId)
    .select();

  if (updateError) {
    console.error("❌ Erreur lors de la mise à jour du parking :", updateError);
    return null;
  }

  return updatedParking[0]; // Retourne le parking mis à jour
};

/**
 * Supprime une place de parking du layout du parking
 * @param {string} parkingId - ID du parking
 * @param {string} spotId - ID de la place à supprimer
 * @returns {object|null} - Données du parking mis à jour ou null en cas d'erreur
 */
const removeParkingSpot = async (parkingId, spotId) => {
  const { data, error } = await supabase
    .from('parking_lots')
    .select('layout')
    .eq('id', parkingId)
    .single();

  if (error) {
    console.error("❌ Erreur lors de la récupération du parking :", error);
    return null;
  }

  // Filtre pour retirer la place
  const updatedLayout = data.layout.filter(spot => spot.id !== spotId);

  // Met à jour le parking sans la place supprimée
  const { data: updatedParking, error: updateError } = await supabase
    .from('parking_lots')
    .update({ layout: updatedLayout })
    .eq('id', parkingId)
    .select();

  if (updateError) {
    console.error("❌ Erreur lors de la mise à jour du parking :", updateError);
    return null;
  }

  return updatedParking[0]; // Retourne le parking mis à jour
};

/**
 * Récupère les places de parking en fonction du type de véhicule
 * @param {string} parkingId - L'ID du parking
 * @param {string} vehicleType - Le type de véhicule (small, medium, large, etc.)
 * @returns {Array} - Tableau des places de parking disponibles pour le type de véhicule
 */
const getParkingSpotsByCarType = async (parkingId, vehicleType) => {
  // On récupère toutes les places du parking
  const { data, error } = await supabase
    .from('parking_lots')
    .select('layout')
    .eq('id', parkingId)
    .single();

  if (error) {
    console.error('Erreur lors de la récupération des places de parking:', error);
    return [];
  }

  // Filtrer les places en fonction du type de véhicule
  const spots = data.layout.filter(spot => spot.vehicleType === categorizeVehicleType(vehicleType));
  return spots;
};

/**
 * Récupère les places de parking libres pour un parking spécifique
 * @param {string} parkingId - ID du parking
 * @returns {Array} - Liste des places de parking libres
 */
const getFreeSpots = async () => {
  const { data, error } = await supabase
    .from('parking_lots')
    .select('id, layout');

  const reservations = await getReservations();

  if (error) {
    console.error("❌ Erreur lors de la récupération des places de parking :", error);
    return [];
  }

  // Filtrer les places qui ne sont pas réservées
  const freeSpots = data.map(parking => [parking.id, parking.layout.filter(spot => !reservations.some(reservation => reservation?.id_parking_spot === spot.id))]);
  return Object.fromEntries(freeSpots);
};

/**
 * Récupère les places de parking libres pour un type de véhicule spécifique
 * @param {string} vehicleType - Type de véhicule
 * @returns {Array} - Liste des places de parking libres pour ce type de véhicule
 */
const getFreeSpotsByType = async (vehicleType) => {
  const { data, error } = await supabase
    .from('parking_lots')
    .select('id, layout');

  const reservations = await getReservations();

  if (error) {
    console.error("❌ Erreur lors de la récupération des places de parking :", error);
    return [];
  }

  // Filtrer les places qui ne sont pas réservées et qui correspondent au type de véhicule
  const freeSpots = data.map(parking => [parking.id, parking.layout.filter(spot => !reservations.some(reservation => reservation?.id_parking_spot === spot.id) && spot.vehicleType === categorizeVehicleType(vehicleType))]);
  return Object.fromEntries(freeSpots);
};


module.exports = {
    getAllParkingSpots,
    getParkingSpotsByCarType,
    getParkingSpotById,
    addParkingSpot,
    updateParkingSpot,
    removeParkingSpot,
    getFreeSpots,
    getFreeSpotsByType
};