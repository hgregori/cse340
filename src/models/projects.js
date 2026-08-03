import db from './db.js';

const getAllProjects = async () => {
    const query = `
        SELECT
            sp.project_id,
            sp.project_name AS title,
            sp.project_description AS description,
            sp.start_date AS date,
            sp.end_date,
            sp.location,
            sp.organization_id,
            o.name AS organization_name
        FROM public."serviceproject" sp
        JOIN public."organization" o
            ON sp.organization_id = o.organization_id
        ORDER BY sp.start_date;
    `;

    const result = await db.query(query);

    return result.rows;
};

const getUpcomingProjects = async (numberOfProjects) => {
    const query = `
        SELECT
            sp.project_id,
            sp.project_name AS title,
            sp.project_description AS description,
            sp.start_date AS date,
            sp.location,
            sp.organization_id,
            o.name AS organization_name
        FROM public."serviceproject" sp
        JOIN public."organization" o
            ON sp.organization_id = o.organization_id
        WHERE sp.start_date >= CURRENT_DATE
        ORDER BY sp.start_date ASC
        LIMIT $1;
    `;

    const result = await db.query(query, [numberOfProjects]);

    return result.rows;
};

const getProjectDetails = async (Id) => {
    const query = `
        SELECT
            sp.project_id,
            sp.project_name AS title,
            sp.project_description AS description,
            sp.start_date AS date,
            sp.location,
            sp.organization_id,
            o.name AS organization_name
        FROM public."serviceproject" sp
        JOIN public."organization" o
            ON sp.organization_id = o.organization_id
        WHERE sp.project_id = $1;
    `;

    const result = await db.query(query, [Id]);

    return result.rows.length > 0 ? result.rows[0] : null;
};

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            sp.project_id,
            sp.project_name AS title,
            sp.project_description AS description,
            sp.start_date AS date,
            sp.location,
            sp.organization_id
        FROM public."serviceproject" sp
        WHERE sp.organization_id = $1
        ORDER BY sp.start_date;
    `;

    const result = await db.query(query, [organizationId]);

    return result.rows;
};

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
            SELECT 
                sp.project_id, 
                sp.project_name AS title, 
                sp.project_description AS description, 
                sp.start_date AS date, 
                sp.location, 
                sp.organization_id,
                o.name AS organization_name
            FROM public."serviceproject" sp
            JOIN public."projectcategory" pc ON sp.project_id = pc.project_id
            JOIN public."organization" o ON sp.organization_id = o.organization_id
            WHERE pc.category_id = $1
            ORDER BY sp.start_date;
        `;

    const result = await db.query(query, [categoryId]);

    return result.rows;
};

const createProject = async (title, description, location, date, organizationId, status) => {
    const query = `
      INSERT INTO "serviceproject" (project_name, project_description, location, status, organization_id, start_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, status, organizationId, date];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}

const updateProject = async (
    projectId,
    projectName,
    projectDescription,
    startDate,
    location,
    organizationId
) => {
    const query = `
    UPDATE serviceproject
    SET project_name = $1,
        project_description = $2,
        location = $3,
        start_date = $4,
        organization_id = $5
    WHERE project_id = $6
    RETURNING project_id;
  `;

    const queryParams = [
        projectName,
        projectDescription,
        location,
        startDate,
        organizationId,
        projectId
    ];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Project not found');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated project with ID:', projectId);
    }

    return result.rows[0].project_id;
};



// Add volunteer functionality
const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO projectvolunteer (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        RETURNING *;
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows[0];
};

const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM projectvolunteer
        WHERE user_id = $1 AND project_id = $2;
    `;
    await db.query(query, [userId, projectId]);
    return true;
};

const isUserVolunteer = async (userId, projectId) => {
    const query = `
        SELECT 1 FROM projectvolunteer
        WHERE user_id = $1 AND project_id = $2;
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};

const getVolunteerCount = async (projectId) => {
    const query = `
        SELECT COUNT(*) AS count FROM projectvolunteer
        WHERE project_id = $1;
    `;
    const result = await db.query(query, [projectId]);
    return parseInt(result.rows[0].count, 10);
};

const getProjectsByUser = async (userId) => {
    const query = `
        SELECT sp.project_id, sp.project_name AS title, sp.start_date AS date
        FROM projectvolunteer pv
        JOIN serviceproject sp ON pv.project_id = sp.project_id
        WHERE pv.user_id = $1
        ORDER BY sp.start_date DESC;
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

export {
    getAllProjects,
    getUpcomingProjects,
    getProjectDetails,
    getProjectsByOrganizationId,
    getProjectsByCategoryId,
    createProject,
    updateProject,
    addVolunteer,
    removeVolunteer,
    isUserVolunteer,
    getVolunteerCount,
    getProjectsByUser
};