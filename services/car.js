const supabase = require('../utils/supabase');  // Supposons que supabase est configuré dans ce fichier

/**
 * Enregistre une voiture dans la base de données avec association à un utilisateur.
 * @param {string} userId - ID de l'utilisateur propriétaire
 * @param {string} registration - Numéro d'immatriculation de la voiture
 * @param {string} type - Type de véhicule (e.g. "small", "medium", "large")
 * @returns {object|null} - Données de la voiture enregistrée ou null en cas d'erreur
 */
const registerCar = async (user, registration, type) => {
  if (!user || !registration || !type) {
    throw new Error("L'utilisateur, le numéro d'immatriculation et le type de véhicule sont obligatoires.");
  }

  // Vérifier si l'utilisateur a déjà enregistré cette voiture
  const { data: existingCar } = await supabase
    .from('cars')
    .select('id')
    .eq('user', user)
    .eq('registration', registration)
    .single();

  if (existingCar) return null; // Empêcher les doublons

  // Insérer la voiture liée à l'utilisateur
  const { data, error } = await supabase
    .from('cars')
    .insert([{ user, registration, type }])
    .select();

  if (error) {
    return null;
  }

  return data[0];
};

/**
 * Récupère les informations d'une voiture par son ID, en s'assurant qu'elle appartient à l'utilisateur.
 * @param {string} userId - ID de l'utilisateur
 * @param {string} carId - ID de la voiture
 * @returns {object|null} - Données de la voiture ou null si non trouvée
 */
const getCarById = async (userId, carId) => {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', carId)
    .eq('user', userId) // Vérification de l'appartenance
    .single();

  if (error) {
    return null;
  }

  return data;
};

/**
 * Met à jour les informations d'une voiture uniquement si elle appartient à l'utilisateur.
 * @param {string} userId - ID de l'utilisateur
 * @param {string} carId - ID de la voiture
 * @param {object} updateData - Données à mettre à jour (ex: { registration, type })
 * @returns {object|null} - Données mises à jour ou null si la voiture n'existe pas ou erreur
 */
const updateCar = async (userId, carId, updateData) => {
  if (!userId || !carId || !updateData) {
    throw new Error("L'utilisateur et les informations de la voiture sont obligatoires.");
  }

  // Vérifier que l'utilisateur possède bien cette voiture
  const { data: existingCar } = await supabase
    .from('cars')
    .select('id')
    .eq('id', carId)
    .eq('user', userId)
    .single();

  if (!existingCar) return null;

  const { data, error } = await supabase
    .from('cars')
    .update(updateData)
    .eq('id', carId)
    .eq('user', userId)
    .select();

  return error ? null : data[0];
};

/**
 * Supprime une voiture uniquement si elle appartient à l'utilisateur.
 * @param {string} userId - ID de l'utilisateur
 * @param {string} carId - ID de la voiture
 * @returns {boolean} - True si supprimée, False sinon
 */
const deleteCar = async (userId, carId) => {
  // Vérifier que la voiture appartient bien à l'utilisateur
  const { data: existingCar } = await supabase
    .from('cars')
    .select('id')
    .eq('id', carId)
    .eq('user', userId)
    .single();

  if (!existingCar) return false;

  const { error } = await supabase
    .from('cars')
    .delete()
    .eq('id', carId)
    .eq('user', userId);

  return !error;
};

module.exports = {
  registerCar,
  getCarById,
  updateCar,
  deleteCar
};
