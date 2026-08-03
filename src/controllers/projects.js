import { getUpcomingProjects, getProjectDetails, createProject, updateProject, addVolunteer, removeVolunteer, isUserVolunteer, getVolunteerCount } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const projectValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 150 }).withMessage('Title must be between 3 and 150 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required')
    .isLength({ max: 150 }).withMessage('Location must be less than 150 characters'),
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Date must be a valid date format'),
  body('organizationId')
    .notEmpty().withMessage('Organization is required')
    .isInt().withMessage('Organization must be a valid integer'),
  body('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isIn(['Planned', 'In Progress', 'Completed']).withMessage('Status must be Planned, In Progress, or Completed')
];

const showProjectsPage = async (req, res) => {
  const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
  const title = 'Upcoming Service Projects';

  res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res, next) => {
  try {
    const Id = req.params.id;
    const project = await getProjectDetails(Id);

    if (!project) {
      const err = new Error('Service Project Not Found');
      err.status = 404;
      return next(err);
    }

    const categories = await getCategoriesByProjectId(Id);
    const title = 'Service Project Details';
    const user = req.session.user;
    const volunteerCount = await getVolunteerCount(Id);
    const isVolunteer = user ? await isUserVolunteer(user.user_id, Id) : false;

    res.render('project', { title, project, categories, user, volunteerCount, isVolunteer });
  } catch (error) {
    next(error);
  }
};

const showNewProjectForm = async (req, res) => {
  const organizations = await getAllOrganizations();
  const title = 'Add New Service Project';

  res.render('new-project', { title, organizations });
}

const processNewProjectForm = async (req, res) => {
  const {
    title,
    description,
    location,
    date,
    organizationId,
    status
  } = req.body;

  try {
    const newProjectId = await createProject(
      title,
      description,
      location,
      date,
      organizationId,
      status
    );

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Loop through validation errors and flash them
      errors.array().forEach((error) => {
        req.flash('error', error.msg);
      });

      // Redirect back to the new project form
      return res.redirect('/new-project');
    }

    req.flash('success', 'New service project created successfully!');
    res.redirect(`/project/${newProjectId}`);
  } catch (error) {
    console.error('Error creating new project:', error);
    req.flash('error', 'There was an error creating the service project.');
    res.redirect('/new-project');
  }
};

const showEditProjectForm = async (req, res) => {
  console.log('Route reached');

  const title = 'Edit Service Project';

  const projectId = req.params.id;

  const project = await getProjectDetails(projectId);
  const organizations = await getAllOrganizations();

  console.log('Project:', project);
  console.log('Organizations:', organizations);

  res.render('edit-project', {
    title,
    project,
    organizations
  });
};

const processEditProjectForm = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    errors.array().forEach(error => {
      req.flash('error', error.msg);
    });

    return res.redirect(`/edit-project/${req.params.id}`);
  }

  const projectId = req.params.id;

  const {
    title,
    description,
    location,
    date,
    organizationId
  } = req.body;

  try {
    const updatedProjectId = await updateProject(
      projectId,
      title,
      description,
      date,
      location,
      organizationId
    );

    req.flash('success', 'Service project updated successfully!');

    res.redirect(`/project/${updatedProjectId}`);
  } catch (error) {
    console.error('Error updating project:', error);

    req.flash(
      'error',
      'There was an error updating the service project.'
    );

    res.redirect(`/edit-project/${projectId}`);
  }
};

const volunteerProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;
    await addVolunteer(userId, projectId);
    req.flash('success', 'You have signed up to volunteer for this project!');
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error('Error volunteering for project:', error);
    req.flash('error', 'There was an error signing up to volunteer.');
    res.redirect(`/project/${req.params.id}`);
  }
};

const unvolunteerProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;
    await removeVolunteer(userId, projectId);
    req.flash('success', 'You have been removed as a volunteer for this project.');
    res.redirect(req.headers.referer || `/project/${projectId}`);
  } catch (error) {
    console.error('Error removing volunteer:', error);
    req.flash('error', 'There was an error removing you as a volunteer.');
    res.redirect(`/project/${req.params.id}`);
  }
};

export {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  projectValidation,
  showEditProjectForm,
  processEditProjectForm,
  volunteerProject,
  unvolunteerProject
};