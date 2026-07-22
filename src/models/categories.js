import db from "./db.js";

const getAllCategories = async () => {
    const query = `
        SELECT
            category_id,
            category_name
        FROM public."category"
        ORDER BY category_name;
    `;

    const result = await db.query(query);

    return result.rows;
};

const getCategoryById = async (id) => {
    const query = `
        SELECT
            category_id,
            category_name
        FROM public."category"
        WHERE category_id = $1;
    `;

    const result = await db.query(query, [id]);

    return result.rows[0];
};

const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.category_name
        FROM public."category" c
        JOIN public."projectcategory" pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.category_name;
    `;

    const result = await db.query(query, [projectId]);

    return result.rows;
};

const assignCategoryToProject = async (projectId, categoryId) => {
    const query =  `INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2)`;
    await db.query(query, [categoryId, projectId]);
}

const updateCategoryAssignments = async(projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}

export { getAllCategories, getCategoryById, getCategoriesByProjectId, updateCategoryAssignments };