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

export { getAllProjects, getUpcomingProjects, getProjectDetails, getProjectsByOrganizationId };