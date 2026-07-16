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

export { getAllCategories, getCategoryById, getCategoriesByProjectId };