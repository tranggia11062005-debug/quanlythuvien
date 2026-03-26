const getAllCategories = async (req, res) => {
  const [rows] = await db.query(`
    SELECT c.id, c.name, p.name AS parent_name
    FROM categories c
    LEFT JOIN categories p ON c.parent_id = p.id
  `);
  res.json(rows);
};
