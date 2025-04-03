const supabase = require('../utils/supabase'); // Supposons que supabase est configuré dans ce fichier

/**
 * Crée une nouvelle réservation de parking
 * @param {string} parkingLotId - ID du parking (référence à parking_lots)
 * @param {string} parkingSpotId - ID de la place de parking (référence à parking_spots)
 * @param {string|null} carId - ID de la voiture (référence à cars), peut être null si aucune voiture n'est associée
 * @param {string|null} dateArrival - Date d'arrivée, format ISO 8601
 * @param {string|null} dateDeparture - Date de départ, format ISO 8601
 * @returns {object|null} - La réservation créée ou null en cas d'erreur
 */
const createReservation = async (parkingLotId, parkingSpotId, carId = null, dateArrival = null, dateDeparture = null) => {
  if (!parkingLotId || !parkingSpotId) {
    throw new Error("Les identifiants de parking et de place de parking sont obligatoires.");
  }

  const { data, error } = await supabase
    .from('parking_reservations')
    .insert([
      {
        id_parking_lot: parkingLotId,
        id_parking_spot: parkingSpotId,
        id_car: carId,
        date_reservation: new Date(),
        date_arrival: dateArrival || new Date(),
        date_departure: dateDeparture || new Date(),
      }
    ])
    .select();

  if (error) {
    console.error("❌ Erreur lors de la création de la réservation :", error);
    return null;
  }

  return data[0];
};

/**
 * Récupère toutes les réservations
 * @returns {object[]} - La liste des réservations
 */
const getReservations = async () => {
  const { data, error } = await supabase
    .from('parking_reservations')
    .select('*')
    .order('date_reservation', { ascending: true });

  if (error) {
    console.error("❌ Erreur lors de la récupération des réservations :", error);
    return [];
  }

  return data;
};

/**
 * Récupère une réservation par son ID
 * @param {string} reservationId - ID de la réservation
 * @returns {object|null} - La réservation trouvée ou null si non trouvée
 */
const getReservationById = async (reservationId) => {
  const { data, error } = await supabase
    .from('parking_reservations')
    .select('*')
    .eq('id', reservationId)
    .single();

  if (error) {
    //console.error("❌ Erreur lors de la récupération de la réservation :", error);
    return null;
  }

  return data;
};

/**
 * Met à jour les informations d'une réservation
 * @param {string} reservationId - ID de la réservation à mettre à jour
 * @param {object} updateData - Les données à mettre à jour (ex: { date_departure })
 * @returns {object|null} - La réservation mise à jour ou null en cas d'erreur
 */
const updateReservation = async (reservationId, updateData) => {
  if (!reservationId || !updateData) {
    throw new Error("L'ID de la réservation et les données à mettre à jour sont nécessaires.");
  }

  const { data, error } = await supabase
    .from('parking_reservations')
    .update(updateData)
    .eq('id', reservationId)
    .select();

  if (error) {
    //console.error("❌ Erreur lors de la mise à jour de la réservation :", error);
    return null;
  }

  return data[0];
};

/**
 * Supprime une réservation
 * @param {string} reservationId - ID de la réservation à supprimer
 * @returns {boolean} - Retourne true si la suppression a réussi, sinon false
 */
const deleteReservation = async (reservationId) => {
  if (!reservationId) {
    throw new Error("L'ID de la réservation est nécessaire pour la suppression.");
  }

  const { error } = await supabase
    .from('parking_reservations')
    .delete()
    .eq('id', reservationId);

  if (error) {
    //console.error("❌ Erreur lors de la suppression de la réservation :", error);
    return false;
  }

  return true;
};

/**
 * Récupère toutes les réservations pour un parking donné
 * @param {string} parkingLotId - ID du parking
 * @returns {Array} - Liste des réservations pour ce parking
 */
const getReservationsByParkingLot = async (parkingLotId) => {
  const { data, error } = await supabase
    .from('parking_reservations')
    .select('*')
    .eq('id_parking_lot', parkingLotId);

  if (error) {
    //console.error("❌ Erreur lors de la récupération des réservations :", error);
    return [];
  }

  return data;
};

/**
 * Récupère toutes les réservations pour une place de parking donnée
 * @param {string} parkingSpotId - ID de la place de parking
 * @returns {Array} - Liste des réservations pour cette place
 */
const getReservationsByParkingSpot = async (parkingSpotId) => {
  const { data, error } = await supabase
    .from('parking_reservations')
    .select('*')
    .eq('id_parking_spot', parkingSpotId);

  if (error) {
    //console.error("❌ Erreur lors de la récupération des réservations :", error);
    return [];
  }

  return data;
};

/**
 * Récupère les réservations associées à une voiture donnée
 * @param {string} carId - ID de la voiture
 * @returns {Array} - Liste des réservations pour cette voiture
 */
const getReservationsByCar = async (carId) => {
  const { data, error } = await supabase
    .from('parking_reservations')
    .select('*')
    .eq('id_car', carId);

  if (error) {
    //console.error("❌ Erreur lors de la récupération des réservations pour la voiture :", error);
    return [];
  }

  return data;
};

const getReservationsByUser = async (userId) => {
  const { data, error } = await supabase
    .from('parking_reservations')
    .select('*, id_car!inner(*)')
    .order('date_reservation', { ascending: true })
    .eq('id_car.user', userId);

  if (error) {
    //console.error("❌ Erreur lors de la récupération des réservations pour l'utilisateur :", error);
    return [];
  }

  return data;
};
module.exports = {
  createReservation,
  getReservationById,
  updateReservation,
  deleteReservation,
  getReservationsByParkingLot,
  getReservationsByParkingSpot,
  getReservationsByCar,
  getReservations,
  getReservationsByUser
};
