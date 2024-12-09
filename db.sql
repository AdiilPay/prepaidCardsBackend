DROP TABLE IF EXISTS transaction;
DROP TABLE IF EXISTS carte;
DROP TABLE IF EXISTS profile;
DROP TABLE IF EXISTS agent;
DROP TABLE IF EXISTS organization;


CREATE TABLE organization
(
    id   BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    fidelity_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    fidelity_rate TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Qttées d euros pour 1 point'
);

CREATE TABLE agent
(
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    login           VARCHAR(255) NOT NULL,
    password        VARCHAR(255) NOT NULL,
    organization_id BIGINT       NOT NULL REFERENCES organization (id)
);

CREATE TABLE profile
(
    id              BIGINT PRIMARY KEY,
    first_name      VARCHAR(255) NOT NULL,
    last_name       VARCHAR(255) NOT NULL,
    creation_date   DATETIME     NOT NULL,
    -- balance DECIMAL(10, 2) NOT NULL,
    points          INT UNSIGNED NOT NULL DEFAULT 0,
    organization_id BIGINT       NOT NULL REFERENCES organization (id)
);

CREATE TABLE carte
(
    id        BIGINT PRIMARY KEY,
    profil_id BIGINT NOT NULL REFERENCES profile (id)
);

CREATE TABLE transaction
(
    id          BIGINT PRIMARY KEY, -- NULL represent the System
    agent_id    BIGINT         NULL REFERENCES agent (id),
    date        DATETIME       NOT NULL,
    amount      DECIMAL(10, 2) NOT NULL,
    carte_id    BIGINT         NOT NULL REFERENCES carte (id),
    description TEXT           NOT NULL
);

DROP PROCEDURE IF EXISTS fidelity_points;
CREATE PROCEDURE fidelity_points(IN id_carte BIGINT, IN amount DECIMAL(10, 2))
BEGIN
    DECLARE enabled BOOLEAN;
    DECLARE points INT;
    DECLARE rate TINYINT;

    SET enabled = (SELECT fidelity_enabled FROM organization WHERE id = (SELECT organization_id FROM profile WHERE id = id_carte));
    IF enabled THEN

        SET points = floor(abs(amount)) + (SELECT points FROM profile WHERE id = id_carte);
        SET rate = (SELECT fidelity_rate FROM organization WHERE id = (SELECT organization_id FROM profile WHERE id = id_carte));

        -- Adding the points to the user's profile
        UPDATE profile SET points = points % rate WHERE id = id_carte;

        -- Si des points sont convertis en euros
        IF points >= 10 THEN
            -- Adding the loyalty bonus to the balance
            INSERT INTO transaction (agent_id,
                                     date,
                                     amount,
                                     carte_id,
                                     description)
            VALUES (null,
                    NOW(),
                    points div 10,
                    id_carte,
                    'Fidelity Bonus');

        END IF;
    END IF;
END;


CREATE TRIGGER transaction_insert
    AFTER INSERT
    ON transaction
    FOR EACH ROW
BEGIN
    DECLARE user_id BIGINT;
    SET user_id = (SELECT profil_id FROM carte WHERE id = NEW.carte_id);
    CALL fidelity_points(user_id, NEW.amount);
END;


-- Allow to see the detailed user information such as the balance, the organization, ect...
CREATE VIEW detailed_user AS
SELECT p.id            AS profile_id,
       p.first_name    AS first_name,
       p.last_name     AS last_name,
       p.creation_date AS creation_date,
       p.points        AS points,
       o.name          AS organization,
       sum(t.amount)   AS balance
FROM profile AS p
         JOIN carte AS c ON p.id = c.profile_id
         JOIN transaction AS t ON c.id = t.carte_id
         JOIN organization AS o ON p.organization_id = o.id
GROUP BY p.id,
         p.first_name,
         p.last_name,
         p.creation_date,
         p.points,
         o.name;