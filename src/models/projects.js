import db from "./db.js";

const getAllProjects = async () => {
    const query = `
        SELECT
            sp.project_id,
            sp.project_name,
            sp.project_description,
            sp.start_date,
            sp.end_date,
            sp.location,
            sp.status,
            o.name AS organization_name
        FROM public."serviceproject" sp
        JOIN public."organization" o
            ON sp.organization_id = o.organization_id
        ORDER BY sp.start_date;
    `;

    const result = await db.query(query);

    return result.rows;
};

const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          date
        FROM project
        WHERE organization_id = $1
        ORDER BY date;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId };