const express = require('express')
const router = express.Router()
const pool = require('../config/config.js')

router.get('/', (req, res) => {
    const sql = `
        SELECT
            products.*,
            JSON_AGG(JSONB_BUILD_OBJECT (
                'store', stores.title,
                'address', stores.address,
                'quantity', product_stores.quantity
        )) AS stores
        FROM
            products 
        INNER JOIN product_stores
            ON products.id = product_stores.product_id
        INNER JOIN stores
            ON stores.id = product_stores.store_id
        GROUP BY
            products.id
        ORDER BY
            products.id ASC
    `

  pool.query(sql, (err, result) => {
    if (err) {
      console.log(err),
        res.status(500).json({ message: 'Internal Server Error' })
    } else {
      res.status(200).json(result.rows)
    }
  })
})

router.get('/:id', (req, res) => {
  const { id } = req.params
    const sql = `
        SELECT
            products.*,
            JSON_AGG(JSONB_BUILD_OBJECT (
                'store', stores.title,
                'address', stores.address,
                'quantity', product_stores.quantity
        )) AS stores
        FROM
            products 
        INNER JOIN product_stores
            ON products.id = product_stores.product_id
        INNER JOIN stores
            ON stores.id = product_stores.store_id
        WHERE
            products.id = $1
        GROUP BY
            products.id 
    `

  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err),
        res.status(500).json({ message: 'Internal Server Error' })
    } else {
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Product Not Found' })
      } else {
        res.status(200).json(result.rows[0])
      }
    }
  })
})

module.exports = router
