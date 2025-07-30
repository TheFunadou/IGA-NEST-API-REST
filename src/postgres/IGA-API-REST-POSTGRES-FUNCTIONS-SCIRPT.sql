--- Categories FUNCTIONS SCRIPT

--Insert into CategoryAttributes
CREATE OR REPLACE FUNCTION insert_category_attribute(
	--provide a exist category_id in the table Category
    p_category_id INTEGER,
	--Description of the new subcategory example : "Casco de bombero"
    p_description VARCHAR(100),
	--The path where the new subcategory will be inserted, this path is shaped for the ID of the father's categories example
	-- If I have the ID (1, Safety Helmets) and I want to insert a new subcategory that is a child of this one, I have to put (1) in my path "Insert * from insert_category_attributes (<Description>, ARRAY[1]::INT[])".
	-- If I want not insert a subcategory with father only insert the subcategory description "Insert * from insert_category_attributes (<Description>, ARRAY[]::INT[])"
    p_path INT[] DEFAULT ARRAY[]::INT[]
) RETURNS INTEGER AS $$
DECLARE
    v_father_id INTEGER := NULL;
	--Set the level in 0
    v_level INTEGER := 0;
    v_new_id INTEGER;
    v_path_elements INT[];
BEGIN
    -- Check if the array is Integer type
    v_path_elements := COALESCE(p_path, ARRAY[]::INT[]);

	-- Handle insert in the root (level 0)
    IF array_length(v_path_elements, 1) IS NULL OR array_length(v_path_elements, 1) = 0 THEN
        v_father_id := NULL;
        v_level := 0;

    ELSE
		-- Validate the ID's path with recursive search
        WITH RECURSIVE path_search AS (
            SELECT 
                ca.id,
                ca.father_id,
                ca.level,
                ARRAY[ca.id]::INT[] AS current_path
            FROM "CategoryAttributes" ca
            WHERE ca.father_id IS NULL
              AND ca.category_id = p_category_id
              AND ca.id = v_path_elements[1]
            
            UNION ALL
            
            SELECT 
                child.id,
                child.father_id,
                child.level,
                parent.current_path || child.id
            FROM "CategoryAttributes" child
            JOIN path_search parent ON child.father_id = parent.id
            WHERE child.id = v_path_elements[array_length(parent.current_path, 1) + 1]
              AND child.category_id = p_category_id
        )
        SELECT ps.id, ps.level + 1
        INTO v_father_id, v_level
        FROM path_search ps
        WHERE ps.current_path = v_path_elements;

        IF v_father_id IS NULL THEN
            RAISE EXCEPTION 'Ruta de IDs no encontrada: %. Verifique que los IDs existan en orden y pertenezcan a category_id %.', 
                array_to_string(v_path_elements::TEXT[], ' -> '), p_category_id;
        END IF;
    END IF;

    -- Insert the new record
    INSERT INTO "CategoryAttributes" (category_id, description, father_id, level)
    VALUES (p_category_id, p_description, v_father_id, v_level)
    RETURNING id INTO v_new_id;

    RETURN v_new_id;
END;
$$ LANGUAGE plpgsql;


SELECT insert_category_attribute(1, 'Ala completa', ARRAY[]::INT[]);
SELECT insert_category_attribute(1, 'Clase "E"', ARRAY[2,3]::INT[]);



---Eliminate CategoryAttribute record (children to father)
CREATE OR REPLACE FUNCTION delete_category_attribute(
    p_target_id INT,
    p_path INT[] DEFAULT ARRAY[]::INT[]
) RETURNS VOID AS $$
DECLARE
    v_path_elements INT[];
    v_has_children BOOLEAN := FALSE;
    v_path_valid BOOLEAN := FALSE;
    v_target_valid BOOLEAN := FALSE;
    v_last_path_id INT;
    v_actual_path INT[];
BEGIN
    -- Asegurar arreglo no nulo
    v_path_elements := COALESCE(p_path, ARRAY[]::INT[]);

    -- 🌱 Caso 1: Eliminar nodo raíz (sin padre)
    IF array_length(v_path_elements, 1) IS NULL OR array_length(v_path_elements, 1) = 0 THEN
        -- Verificar que el nodo objetivo existe y es raíz
        SELECT TRUE
        INTO v_target_valid
        FROM "CategoryAttributes"
        WHERE id = p_target_id AND father_id IS NULL;

        IF NOT v_target_valid THEN
            RAISE EXCEPTION 'El nodo con ID % no es raíz o no existe.', p_target_id;
        END IF;
    ELSE
        -- 🌳 Caso 2: Eliminar nodo hijo con ruta jerárquica
        
        -- 1. Validar que el path es una secuencia jerárquica válida
        WITH RECURSIVE valid_path AS (
            -- Comenzar con el primer nodo del path (debe ser raíz)
            SELECT 
                id, 
                father_id, 
                1 AS level, 
                ARRAY[id] AS actual_path
            FROM "CategoryAttributes" 
            WHERE id = v_path_elements[1] 
            AND father_id IS NULL
            
            UNION ALL
            
            -- Verificar cada siguiente nodo en el path
            SELECT 
                ca.id, 
                ca.father_id, 
                vp.level + 1, 
                vp.actual_path || ca.id
            FROM "CategoryAttributes" ca
            JOIN valid_path vp ON ca.father_id = vp.id
            WHERE vp.level < array_length(v_path_elements, 1)
            AND ca.id = v_path_elements[vp.level + 1]
        )
        SELECT actual_path
        INTO v_actual_path
        FROM valid_path
        WHERE level = array_length(v_path_elements, 1);
        
        -- Si no obtenemos un path, es inválido
        IF v_actual_path IS NULL OR v_actual_path <> v_path_elements THEN
            RAISE EXCEPTION 'La secuencia jerárquica % no es válida. La secuencia correcta sería: %',
                array_to_string(v_path_elements::TEXT[], ' → '),
                CASE WHEN v_actual_path IS NULL THEN 'NO EXISTE' ELSE array_to_string(v_actual_path::TEXT[], ' → ') END;
        END IF;
        
        -- 2. Verificar que el nodo objetivo es hijo directo del último nodo del path
        v_last_path_id := v_path_elements[array_length(v_path_elements, 1)];
        
        SELECT TRUE
        INTO v_target_valid
        FROM "CategoryAttributes"
        WHERE id = p_target_id 
        AND father_id = v_last_path_id;
        
        IF NOT v_target_valid THEN
            RAISE EXCEPTION 'El nodo con ID % no es hijo directo del último nodo en la ruta (%).',
                p_target_id, v_last_path_id;
        END IF;
    END IF;

    -- Validar si el nodo tiene hijos
    SELECT EXISTS (
        SELECT 1 FROM "CategoryAttributes"
        WHERE father_id = p_target_id
    ) INTO v_has_children;

    IF v_has_children THEN
        RAISE EXCEPTION 'No se puede eliminar el nodo % porque tiene hijos.', p_target_id;
    END IF;

    -- Eliminar
    DELETE FROM "CategoryAttributes"
    WHERE id = p_target_id;
    
    RAISE NOTICE 'Nodo % eliminado correctamente.', p_target_id;
END;
$$ LANGUAGE plpgsql;

--Eliminate node without childrens
SELECT delete_category_attribute(1);

--Eliminate node with childrens
SELECT delete_category_attribute(3, ARRAY[1,3]);


--Get the childrens from father
CREATE OR REPLACE FUNCTION get_children_from_father(id_root INT)
RETURNS TABLE (
	id_subcategory int,
    attribute VARCHAR(45),
    level INTEGER,
    parent_attribute VARCHAR(45)
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE subtree AS (
        -- Nodo raíz
        SELECT 
            ca.id,
            ca.description,
            ca.level,
            ca.father_id
        FROM "CategoryAttributes" ca
        WHERE ca.id = id_root

        UNION ALL

        -- Hijos recursivos
        SELECT 
            child.id,
            child.description,
            child.level,
            child.father_id
        FROM "CategoryAttributes" child
        INNER JOIN subtree parent ON child.father_id = parent.id
    )
    SELECT 
		s.id,
        s.description AS attribute,
        s.level,
        COALESCE(
            (SELECT description FROM "CategoryAttributes" WHERE id = s.father_id),
            'Raíz'
        ) AS parent_attribute
    FROM subtree s
    GROUP BY s.id, s.description, s.level, s.father_id
    ORDER BY s.level, s.description;
END;
$$ LANGUAGE plpgsql;


SELECT * FROM get_children_from_father(2);

--Search product by category id and path example (1,[1,2]) result -> 1, Casco Dieletrico, {"ala completa".....}
CREATE OR REPLACE FUNCTION get_product_versions_by_path(
    p_category_id INT,
    p_path INT[]
)
RETURNS TABLE (
    product_version_id INT,
    sku INT,
    unit_price NUMERIC,
    attributes TEXT[],
    product_name VARCHAR(60),
    main_image_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pv.id AS product_version_id,
        pv.sku,
        pv.unit_price,
        pv.attributes,
        p.product_name,
        (
            SELECT pi.image_url 
            FROM "ProductImage" pi 
            WHERE pi.product_version_id = pv.id AND pi.main_image = true
            LIMIT 1
        ) AS main_image_url
    FROM "ProductVersion" pv
    JOIN "Product" p ON p.id = pv.product_id
    WHERE (
        SELECT COUNT(DISTINCT ca.id)
        FROM "ProductAttributes" pa
        JOIN "CategoryAttributes" ca ON ca.id = pa.category_attribute_id
        WHERE pa.product_id = pv.product_id
          AND ca.category_id = p_category_id
          AND ca.id = ANY(p_path)
    ) = cardinality(p_path);
END;
$$ LANGUAGE plpgsql;


--- Search products with category_id, path[1,2,3] on ProductAttributes and customer_id for favorites
CREATE OR REPLACE FUNCTION get_product_versions_by_path_customer(
    p_category_id INT,
    p_path INT[],
    p_customer_id INT
)
RETURNS TABLE (
    product_version_id INT,
    sku INT,
    unit_price NUMERIC,
    attributes TEXT[],
    product_name VARCHAR(60),
    main_image_url TEXT,
    is_favorite BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pv.id AS product_version_id,
        pv.sku,
        pv.unit_price,
        pv.attributes,
        p.product_name,
        (
            SELECT pi.image_url 
            FROM "ProductImage" pi 
            WHERE pi.product_version_id = pv.id AND pi.main_image = true
            LIMIT 1
        ) AS main_image_url,
        EXISTS (
            SELECT 1
            FROM "CustomerFavorites" cf
            WHERE cf.product_version_id = pv.id AND cf.customer_id = p_customer_id
        ) AS is_favorite
    FROM "ProductVersion" pv
    JOIN "Product" p ON p.id = pv.product_id
    WHERE (
        SELECT COUNT(DISTINCT ca.id)
        FROM "ProductAttributes" pa
        JOIN "CategoryAttributes" ca ON ca.id = pa.category_attribute_id
        WHERE pa.product_id = pv.product_id
          AND ca.category_id = p_category_id
          AND ca.id = ANY(p_path)
    ) = cardinality(p_path);
END;
$$ LANGUAGE plpgsql;


--GetProductVersionsCardsCustomer
SELECT *
FROM get_product_versions_by_path_customer(
    1,               -- category_id
    ARRAY[4,6],  -- path de atributos
    1               -- customer_id
);

--GetProductVersionsCards

SELECT * 
FROM get_product_versions_by_path(
    1,              -- category_id
    ARRAY[1]  -- path de category_attribute.id
);

--Get users by partial name or username
CREATE OR REPLACE FUNCTION get_user_by_name_or_username(
    p_name VARCHAR(100),
	p_offset int default 0,
	p_limit int default 10
)
RETURNS TABLE (
	id int,
	username varchar(40),
	name varchar(40),
	last_name varchar(40),
	email varchar(40),
	created_at TIMESTAMP
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.id,
        u.username,
        u.name,
        u.last_name,
        u.email,
        u.created_at
    FROM
        "User" u
    WHERE
        LOWER(u.name || ' ' || u.last_name) LIKE '%' || LOWER(p_name) || '%'
        OR LOWER(u.username) LIKE '%' || LOWER(p_name) || '%'
	ORDER BY u.id
	OFFSET p_offset
	LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;


SELECT * FROM get_user('yon');
