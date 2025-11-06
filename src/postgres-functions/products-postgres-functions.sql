
--Required tables : ProductVersion,Product,ProductImage,ProductAttributes,CategoryAttributes (view schema.prisma)
--Get product version cards by subcategory array id's path 
--p_category_id: ID of the main category
--p_path: ARRAY OF SUBCATEGORY ID'S PATH [1,2,3]
--p_offset: Take the rows from 0 (default)
--p_limit: Rows limit
CREATE OR REPLACE FUNCTION get_product_versions_by_path(
    p_category_id INT,
    p_path INT[],
    p_offset INT DEFAULT 0,
    p_limit INT DEFAULT 10
)
--Function result
RETURNS TABLE (
    product_version_id INT,
    sku INT,
    unit_price NUMERIC,
    attributes TEXT[],
    product_name VARCHAR(60),
    main_image_url TEXT
) AS $$
BEGIN
    --Query
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
            --Conditional
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
    ) = cardinality(p_path)
    OFFSET p_offset
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

--get_product_versions_by_path example:
SELECT * FROM get_product_versions_by_path(1,ARRAY[1],0,10);
SELECT * FROM get_product_versions_by_path(1,ARRAY[1,2],0,10);

------------------------------------------------------------------------------

--Required tables: ProductVersion,Product,ProductImage,ProductAttributes,CategoryAttributes,CustomerFavorites (view schema.prisma)
--p_category_id: ID of the main category
--p_path: ARRAY OF SUBCATEGORY ID'S PATH [1,2,3]
--p_customer_id: Customer ID to determine whether a product is a favorite or not
--p_offset: Take the rows from 0 (default)
--p_limit: Rows limit
CREATE OR REPLACE FUNCTION get_product_versions_by_path_customer(
    p_category_id INT,
    p_path INT[],
    p_customer_id INT,
	p_offset INT DEFAULT 0,
    p_limit INT DEFAULT 10
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
    ) = cardinality(p_path)
	OFFSET p_offset
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

--get_product_versions_by_path_customer example:
SELECT * FROM get_product_versions_by_path_customer (1,ARRAY[1],1,0,10);
SELECT * FROM get_product_versions_by_path_customer (1,ARRAY[1,2],1,0,10);

--------------------------------------------------------------------------------------
--Required tables: ProductVersion,Product,ProductImage view schema.prisma
--Parameters
--p_limit: Limit of rows needed
CREATE OR REPLACE FUNCTION get_random_product_versions(
    p_limit INT DEFAULT 10
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
    ORDER BY RANDOM()
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM get_random_product_versions(10);

--------------------------------------------------------------------------------------------

--Required tables: ProductVersion,Product,ProductImage,ProductFavorites view schema.prisma
--Parameters
--p_customer_id: id of the customer
--p_limit: Limit of rows needed
CREATE OR REPLACE FUNCTION get_random_product_versions_customer(
    p_customer_id INT,
	p_limit INT DEFAULT 10
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
    ORDER BY RANDOM()
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM get_random_product_versions_customer(1,10);