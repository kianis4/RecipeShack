from django.test import TestCase
import unittest
from unittest.mock import patch, MagicMock
from users.models import User


class TestUser(TestCase):

    def setUp(self):
        # Initialize a test user
        self.user = User.getUserByUsername("testuser")

    def tearDown(self):
        # Remove the test user from the database
        pass

    def test_create_duplicate_user(self):
        # Test that creating a user with an existing username returns None
        duplicate_user = User.createNewUser("testuser", "testpassword")
        self.assertIsNone(duplicate_user)

    def test_authenticate_valid_user(self):
        # Test that a valid user can be authenticated
        authenticated_user = User.authenticateAndRetrieveUser("testuser", "testpassword")
        self.assertIsNotNone(authenticated_user)
        self.assertEqual(authenticated_user.getUsername(), "testuser")

    def test_authenticate_invalid_user(self):
        # Test that an invalid user cannot be authenticated
        authenticated_user = User.authenticateAndRetrieveUser("testuser", "wrongpassword")
        self.assertIsNone(authenticated_user)

    def test_get_user_by_username(self):
        # Test that a user can be retrieved by username
        retrieved_user = User.getUserByUsername("testuser")
        self.assertIsNotNone(retrieved_user)
        self.assertEqual(retrieved_user.getUsername(), "testuser")

    def test_get_favorites(self):
        # Test that a user's favorite recipes can be retrieved
        favorites = self.user.getFavorites()
        self.assertIsInstance(favorites, list)

    @patch.object(User, '_User__save')
    def test_add_favorite(self, mock_save):
        # Test that a recipe can be added to a user's favorites
        mock_save.return_value = True
        result = self.user.addFavorite(147)
        self.assertTrue(result)
        self.assertIn({'ID': 147, 'Name': 'Campfire Orange Cake', 'TotalTime': 30, 'ImageURL': 'http://4.bp.blogspot.com/-5EoVv2IBiiM/VITFjck7N6I/AAAAAAAAIN8/ccN2Dy6STn8/s1600/IMG_7661.JPG', 'Ingredients': [235], 'Rating': 4.5, 'Calories': 332.5}, self.user.getFavorites())

    @patch.object(User, '_User__save')
    def test_add_existing_favorite(self, mock_save):
        # Test that adding an existing favorite does not modify the favorites list
        self.user.addFavorite(147)
        mock_save.return_value = True
        result = self.user.addFavorite(147)
        self.assertFalse(result)
        self.assertIn({'ID': 147, 'Name': 'Campfire Orange Cake', 'TotalTime': 30, 'ImageURL': 'http://4.bp.blogspot.com/-5EoVv2IBiiM/VITFjck7N6I/AAAAAAAAIN8/ccN2Dy6STn8/s1600/IMG_7661.JPG', 'Ingredients': [235], 'Rating': 4.5, 'Calories': 332.5}, self.user.getFavorites())

    @patch.object(User, '_User__save')
    def test_remove_favorite(self, mock_save):
        # Test that a recipe can be removed from a user's favorites
        self.user.addFavorite("recipe123")
        mock_save.return_value = True
        result = self.user.removeFavorite("recipe123")
        self.assertTrue(result)
        self.assertNotIn("recipe123", self.user.getFavorites())

    def test_remove_nonexistent_favorite(self):
        # Test that removing a nonexistent favorite does not modify the favorites list
        result = self.user.removeFavorite("recipe123")
        self.assertFalse(result)
        self.assertNotIn("recipe123", self.user.getFavorites())
