CREATE TABLE Organization (
	organization_id SERIAL NOT NULL PRIMARY KEY,
	name VARCHAR(150) NOT NULL,
	description TEXT NOT NULL,
	contact_email VARCHAR(255) NOT NULL UNIQUE
		CHECK (contact_email LIKE '%@%'),
	logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO Organization (name, description, contact_email, logo_filename)
	VALUES 
	('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
	('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
	('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

SELECT * FROM Organization;

CREATE TABLE ServiceProject (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    project_name VARCHAR(150) NOT NULL,
    project_description TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    location VARCHAR(150) NOT NULL,
    status VARCHAR(20) NOT NULL
        CHECK (status IN ('Planned', 'In Progress', 'Completed')),
    FOREIGN KEY (organization_id)
        REFERENCES Organization(organization_id)
        ON DELETE CASCADE
);

INSERT INTO ServiceProject
(organization_id, project_name, project_description, start_date, end_date, location, status)
VALUES

-- BrightFuture Builders (organization_id = 1)

(1, 'Community Park Renovation',
 'Renovating public park facilities with sustainable materials.',
 '2025-01-10', '2025-04-30', 'Springfield', 'Completed'),

(1, 'Affordable Housing Initiative',
 'Construction of affordable housing units for low-income families.',
 '2025-03-01', NULL, 'Riverdale', 'In Progress'),

(1, 'Neighborhood Playground Upgrade',
 'Installing new playground equipment and safety surfaces.',
 '2025-02-15', '2025-05-20', 'Oakwood', 'Completed'),

(1, 'Community Center Expansion',
 'Expanding a local community center to support more programs.',
 '2025-06-01', NULL, 'Lakeside', 'In Progress'),

(1, 'Solar-Powered Bus Shelter Project',
 'Building eco-friendly bus shelters powered by solar energy.',
 '2025-07-01', NULL, 'Brookfield', 'Planned'),

-- GreenHarvest Growers (organization_id = 2)

(2, 'Urban Community Garden',
 'Creating a community garden to provide fresh produce.',
 '2025-01-20', '2025-05-15', 'Downtown', 'Completed'),

(2, 'School Gardening Program',
 'Teaching students sustainable gardening practices.',
 '2025-02-01', NULL, 'Westfield', 'In Progress'),

(2, 'Rooftop Farming Initiative',
 'Developing rooftop farming spaces in urban areas.',
 '2025-03-15', NULL, 'Metro City', 'In Progress'),

(2, 'Local Farmers Market Support',
 'Supporting small growers through community markets.',
 '2025-04-10', '2025-06-30', 'Eastwood', 'Completed'),

(2, 'Neighborhood Compost Program',
 'Encouraging composting and waste reduction practices.',
 '2025-08-01', NULL, 'Greendale', 'Planned'),

-- UnityServe Volunteers (organization_id = 3)

(3, 'Food Drive Coordination',
 'Organizing volunteers to collect and distribute food donations.',
 '2025-01-05', '2025-02-28', 'Springfield', 'Completed'),

(3, 'Holiday Charity Campaign',
 'Coordinating seasonal charity events for families in need.',
 '2025-11-01', NULL, 'Riverdale', 'Planned'),

(3, 'Senior Assistance Program',
 'Providing volunteer support to senior citizens.',
 '2025-03-01', NULL, 'Oakwood', 'In Progress'),

(3, 'Community Cleanup Day',
 'Mobilizing volunteers for neighborhood cleanup efforts.',
 '2025-04-22', '2025-04-22', 'Lakeside', 'Completed'),

(3, 'Youth Mentorship Initiative',
 'Connecting volunteers with local youth mentorship programs.',
 '2025-06-15', NULL, 'Brookfield', 'In Progress');

 SELECT * FROM ServiceProject;

  CREATE TABLE Category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO Category (category_name)
VALUES
    ('Community Development'),
    ('Environmental Sustainability'),
    ('Volunteer Services');

SELECT * FROM category;

CREATE TABLE ProjectCategory (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    PRIMARY KEY (project_id, category_id),

    FOREIGN KEY (project_id)
        REFERENCES "serviceproject"(project_id)
        ON DELETE CASCADE,

    FOREIGN KEY (category_id)
        REFERENCES Category(category_id)
        ON DELETE CASCADE
);

INSERT INTO ProjectCategory (project_id, category_id)
VALUES

-- BrightFuture Builders
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 2),

-- GreenHarvest Growers
(6, 2),
(7, 2),
(8, 2),
(9, 1),
(10, 2),

-- UnityServe Volunteers
(11, 3),
(12, 3),
(13, 3),
(14, 3),
(15, 3);

SELECT
    sp.project_name,
    c.category_name
FROM ProjectCategory pc
JOIN "serviceproject" sp
    ON pc.project_id = sp.project_id
JOIN Category c
    ON pc.category_id = c.category_id
ORDER BY sp.project_name;

SELECT
    sp.project_name,
    o.name AS organization_name,
    c.category_name
FROM "serviceproject" sp
JOIN "Organization" o
    ON sp.organization_id = o.organization_id
JOIN ProjectCategory pc
    ON sp.project_id = pc.project_id
JOIN Category c
    ON pc.category_id = c.category_id
ORDER BY sp.project_name;

UPDATE ServiceProject
SET start_date = CASE project_id
    WHEN 2 THEN DATE '2026-09-01'
    WHEN 4 THEN DATE '2026-10-15'
    WHEN 5 THEN DATE '2026-12-01'
    WHEN 7 THEN DATE '2026-09-15'
    WHEN 8 THEN DATE '2026-10-01'
    WHEN 10 THEN DATE '2026-11-15'
    WHEN 12 THEN DATE '2026-12-10'
    WHEN 13 THEN DATE '2026-09-20'
    WHEN 15 THEN DATE '2026-11-01'
    ELSE start_date
END
WHERE project_id IN (2, 4, 5, 7, 8, 10, 12, 13, 15);w