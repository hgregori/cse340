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