INSERT INTO
    products (title, sku, price)
VALUES
    ('knife', 'kitchen-008', 35000);

INSERT INTO
    product_stores (store_id, product_id, quantity)
SELECT
    3,
    id,
    15
FROM
    products
WHERE
    sku = 'kitchen-008';