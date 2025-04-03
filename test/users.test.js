const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
const {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  authenticateUser
} = require('../services/users');
const { v4: uuidv4 } = require('uuid');

describe('User Service', () => {
  let testUser;
  let createdUser;

  beforeEach(async () => {
    testUser = {
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    createdUser = await createUser(testUser.username, testUser.email, testUser.password);
  });

  afterEach(async () => {
    if (createdUser) {
      await deleteUser(createdUser.id);
    }
  });

  // ✅ Test de la création d'un utilisateur avec mot de passe hashé
  test('should create a user with hashed password', async () => {
    expect(createdUser).not.toBeNull();
    expect(createdUser.username).toBe(testUser.username);
    expect(createdUser.email).toBe(testUser.email);
    expect(await bcrypt.compare(testUser.password, createdUser.password)).toBe(true);
  });

  // ✅ Test de récupération par ID
  test('should retrieve a user by ID', async () => {
    const user = await getUserById(createdUser.id);
    expect(user).not.toBeNull();
    expect(user.id).toBe(createdUser.id);
    expect(user.username).toBe(createdUser.username);
  });

  // ❌ Cas limite : Récupérer un utilisateur inexistant
  test('should return null for a non-existing user', async () => {
    const user = await getUserById(uuidv4());
    expect(user).toBeNull();
  });

  // ✅ Test de mise à jour d'un utilisateur
  test('should update a user', async () => {
    const newUsername = faker.internet.username();
    const updatedUser = await updateUser(createdUser.id, { username: newUsername });

    expect(updatedUser).not.toBeNull();
    expect(updatedUser.username).toBe(newUsername);
  });

  // ❌ Cas limite : Mise à jour d’un utilisateur inexistant
  test('should return null when updating a non-existing user', async () => {
    const updatedUser = await updateUser(uuidv4(), { username: 'NewUsername' });
    expect(updatedUser).toBeNull();
  });

  // ✅ Test de suppression d’un utilisateur
  test('should delete a user successfully', async () => {
    const deletionResult = await deleteUser(createdUser.id);
    expect(deletionResult).toBe(true);

    const deletedUser = await getUserById(createdUser.id);
    expect(deletedUser).toBeNull();
  });

  // ❌ Cas limite : Suppression d’un utilisateur inexistant
  test('should return false when deleting a non-existing user', async () => {
    const deletionResult = await deleteUser(uuidv4());
    expect(deletionResult).toBe(false);
  });

  // ✅ Test d’authentification avec un mot de passe correct
  test('should authenticate user with correct password', async () => {
    const authenticatedUser = await authenticateUser(testUser.email, testUser.password);

    expect(authenticatedUser).not.toBeNull();
    expect(authenticatedUser.email).toBe(testUser.email);
  });

  // ❌ Cas limite : Authentification avec un mauvais mot de passe
  test('should not authenticate user with incorrect password', async () => {
    const authenticatedUser = await authenticateUser(testUser.email, 'wrongpassword');

    expect(authenticatedUser).toBeNull();
  });

  // ❌ Cas limite : Authentification avec un email inexistant
  test('should not authenticate non-existing user', async () => {
    const authenticatedUser = await authenticateUser(faker.internet.email(), testUser.password);

    expect(authenticatedUser).toBeNull();
  });

  // ❌ Cas limite : Création d’un utilisateur avec un email déjà utilisé
  test('should not allow duplicate email registration', async () => {
    const duplicateUser = await createUser(testUser.username, testUser.email, faker.internet.password());

    expect(duplicateUser).toBeNull();
  });
});
