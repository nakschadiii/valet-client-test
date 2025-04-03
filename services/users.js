const bcrypt = require('bcrypt');
const supabase = require('../utils/supabase');

const SALT_ROUNDS = 10; // Définition du nombre d'itérations pour le hashage

/**
 * Crée un nouvel utilisateur avec un mot de passe hashé
 * @param {string} username - Nom d'utilisateur
 * @param {string} email - Adresse e-mail
 * @param {string} password - Mot de passe en clair
 * @returns {object|null} - L'utilisateur créé ou null en cas d'erreur
 */
const createUser = async (username, email, password) => {
    const existingUser = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
  
    if (existingUser.data) return null; // 🔥 Empêcher la création si l'email existe déjà
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, email, password: hashedPassword }])
      .select()
      .single();
  
    return error ? null : data;
  };

/**
 * Vérifie si un mot de passe correspond à celui stocké dans la base
 * @param {string} email - L'email de l'utilisateur
 * @param {string} password - Le mot de passe en clair
 * @returns {object|null} - L'utilisateur si l'authentification réussit, sinon null
 */
const authenticateUser = async (email, password) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .or(`email.eq.${email},username.eq.${email}`)
    .single();

  if (error || !data) {
    //console.error("❌ Utilisateur non trouvé.");
    return null;
  }

  const isMatch = await bcrypt.compare(password, data.password);
  if (!isMatch) {
    //console.error("❌ Mot de passe incorrect.");
    return null;
  }

  return data; // L'utilisateur authentifié
};
/**
 * Récupère un utilisateur par son ID
 * @param {string} userId - ID de l'utilisateur
 * @returns {object|null} - L'utilisateur trouvé ou null si non trouvé
 */

const getUserById = async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
  
    if (error) {
      //console.error("❌ Erreur lors de la récupération de l'utilisateur :", error);
      return null;
    }
  
    return data;
  };
  
  /**
   * Met à jour les informations d'un utilisateur
   * @param {string} userId - ID de l'utilisateur à mettre à jour
   * @param {object} updateData - Les données à mettre à jour
   * @returns {object|null} - L'utilisateur mis à jour ou null en cas d'erreur
   */
  const updateUser = async (userId, updateData) => {
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();
  
    if (error || !data) {
      return null; // 🔥 Retourner explicitement null si l'utilisateur n'est pas trouvé
    }

    if (updateData.password) {
      const hashedPassword = await bcrypt.hash(updateData.password, 10);
      data.password = hashedPassword;
    }

    const { data: updatedData, error: updateError } = await supabase
      .from('users')
      .update(data)
      .eq('id', userId)
      .select()
      .single();
  
    return updatedData;
  };
  
  /**
   * Supprime un utilisateur
   * @param {string} userId - ID de l'utilisateur à supprimer
   * @returns {boolean} - Retourne true si la suppression a réussi, sinon false
   */
  const deleteUser = async (userId) => {
    const { data, error1 } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    //console.log(data, error1);
  
    if (!data) return false; // 🔥 Vérifier si l'utilisateur existe avant suppression
  
    const { error } = await supabase.from('users').delete().eq('id', userId);
  
    //console.log(error);

    return !error;
  };
  
  module.exports = {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    authenticateUser
  };
