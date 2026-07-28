import express from 'express';
import { showOrganizationsPage } from "./controllers/organizations.js";
import { showHomePage } from './controllers/index.js';

import {
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
} from './controllers/organizations.js';

import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';
import { showCategoriesPage, showCategoryDetailsPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);

router.get('/organizations', showOrganizationsPage);

router.get('/projects', showProjectsPage);

router.get('/project/:id', showProjectDetailsPage); 

router.get('/categories', showCategoriesPage);

router.get('/category/:id', showCategoryDetailsPage);

// error-handling routes
router.get('/test-error', testErrorPage);

// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);

// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);
// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

// Route to display the edit organization form
router.get('/edit-organization/:id', showEditOrganizationForm);
// Route to handle the edit organization form submission
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);


export default router;