import express from 'express';
import { showOrganizationsPage } from "./controllers/organizations.js";
import { showHomePage } from './controllers/index.js';

import { 
    showUserRegistrationForm, 
    processUserRegistrationForm,
    showLoginForm, 
    processLoginForm, 
    processLogout,
    showDashboard,
    requireLogin,
    requireRole,
    showUsers
} from './controllers/users.js';

import {
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
} from './controllers/organizations.js';

import { 
    showProjectsPage, 
    showProjectDetailsPage, 
    showNewProjectForm, 
    processNewProjectForm, 
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
} from './controllers/projects.js';

import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    categoryValidation,
    showEditCategoryForm,
    processEditCategoryForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm
} from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);

router.get('/organizations', showOrganizationsPage);

router.get('/projects', showProjectsPage);

router.get('/project/:id', showProjectDetailsPage); 

router.get('/categories', showCategoriesPage);

router.get('/category/:id', showCategoryDetailsPage);
router.get('/new-category', requireRole('admin'), showNewCategoryForm);
router.post('/new-category', categoryValidation,requireRole('admin'), processNewCategoryForm);
router.get('/edit-category/:id', requireRole('admin'),showEditCategoryForm);
router.post('/edit-category/:id', categoryValidation,requireRole('admin'), processEditCategoryForm);

// error-handling routes
router.get('/test-error', testErrorPage);

// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);

// Route for new organization page
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
// Route to handle new organization form submission
router.post('/new-organization', organizationValidation,requireRole('admin'), processNewOrganizationForm);

// Route to display the edit organization form
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
// Route to handle the edit organization form submission
router.post('/edit-organization/:id', organizationValidation, requireRole('admin'), processEditOrganizationForm);

// Route for new project page
router.get('/new-project', requireRole('admin'), showNewProjectForm);

// Route to handle new project form submission
router.post('/new-project', requireRole('admin'), processNewProjectForm);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);

// Route to display the edit project form
router.get('/edit-project/:id', requireRole('admin'), (req, res, next) => {
    console.log('EDIT PROJECT ROUTE HIT');
    next();
}, showEditProjectForm);

router.post('/edit-project/:id', projectValidation,requireRole('admin'), processEditProjectForm);

// User registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// User login routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Dashboard route
router.get('/dashboard', requireLogin, showDashboard);

// Users route (only for Admin)
router.get('/users', requireRole('admin'), showUsers);

export default router;