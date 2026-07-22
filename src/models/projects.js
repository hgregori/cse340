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

const createProject = async (title, description, location, date, organizationId) => {
    const query = `
      INSERT INTO project (title, description, location, date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}

const updateProject = async (projectId, title, description, location, date, organizationId) => {
    const query = `
      UPDATE project
      SET
        title = $2,
        description = $3,
        location = $4,
        date = $5,
        organization_id = $6
      WHERE project_id = $1;
    `;

    const queryParams = [projectId, title, description, location, date, organizationId];
    await db.query(query, queryParams);

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated project with ID:', projectId);
    }
}

export { 
    getAllProjects, 
    getUpcomingProjects, 
    getProjectDetails, 
    getProjectsByOrganizationId,
    getProjectsByCategoryId,
    createProject,
    updateProject
};