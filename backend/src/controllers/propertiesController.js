const db = require("../db");

exports.createProperty = async (req, res, next) => {
  try {
    const {
      project_name,
      builder_name,
      location,
      price,
      main_image,
      gallery_images,
      description,
      highlights,
    } = req.body;
    const q = `INSERT INTO properties (project_name,builder_name,location,price,main_image,gallery_images,description,highlights)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
    const values = [
      project_name,
      builder_name,
      location,
      price,
      main_image,
      gallery_images || [],
      description,
      highlights,
    ];
    const r = await db.query(q, values);
    res.status(201).json({ success: true, data: r.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.getAllProperties = async (req, res, next) => {
  try {
    // basic filters via query params (location, minPrice, maxPrice, project_name)
    const { location, minPrice, maxPrice, project_name } = req.query;
    let base = "SELECT * FROM properties";
    const clauses = [];
    const params = [];
    if (location) {
      params.push(location);
      clauses.push(`location = $${params.length}`);
    }
    if (project_name) {
      params.push(`%${project_name}%`);
      clauses.push(`project_name ILIKE $${params.length}`);
    }
    if (minPrice) {
      params.push(minPrice);
      clauses.push(`price >= $${params.length}`);
    }
    if (maxPrice) {
      params.push(maxPrice);
      clauses.push(`price <= $${params.length}`);
    }
    if (clauses.length) base += " WHERE " + clauses.join(" AND ");
    base += " ORDER BY created_at DESC";
    const r = await db.query(base, params);
    res.json({ success: true, data: r.rows });
  } catch (err) {
    next(err);
  }
};

exports.getPropertyById = async (req, res, next) => {
  try {
    const r = await db.query("SELECT * FROM properties WHERE id=$1", [
      req.params.id,
    ]);
    if (!r.rows.length)
      return res.status(404).json({ success: false, error: "Not found" });
    res.json({ success: true, data: r.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.updateProperty = async (req, res, next) => {
  try {
    // For MVP: update all fields simply
    const {
      project_name,
      builder_name,
      location,
      price,
      main_image,
      gallery_images,
      description,
      highlights,
    } = req.body;
    const q = `UPDATE properties SET project_name=$1,builder_name=$2,location=$3,price=$4,main_image=$5,gallery_images=$6,description=$7,highlights=$8,updated_at=NOW()
               WHERE id=$9 RETURNING *`;
    const vals = [
      project_name,
      builder_name,
      location,
      price,
      main_image,
      gallery_images || [],
      description,
      highlights,
      req.params.id,
    ];
    const r = await db.query(q, vals);
    if (!r.rows.length)
      return res.status(404).json({ success: false, error: "Not found" });
    res.json({ success: true, data: r.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.deleteProperty = async (req, res, next) => {
  try {
    const r = await db.query("DELETE FROM properties WHERE id=$1 RETURNING *", [
      req.params.id,
    ]);
    if (!r.rows.length)
      return res.status(404).json({ success: false, error: "Not found" });
    res.json({ success: true, data: r.rows[0] });
  } catch (err) {
    next(err);
  }
};
