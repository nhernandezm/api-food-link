const db = require('../config/db');

exports.getDonaciones = async(req, res) => {
  try {
    const query = `select id,nombre_producto as producto,cantida_kilos as kilos,nombre_quien_dona as quienDona, fecha_registro as fechaDonacion,nombre_quien_pide as quienPide,nombre_quien_recibe nombreQuienRecibe,(entregado=1) as entregado,fecha_entregado as fechaEntrega from donaciones;`;

  const [rows] = await db.query(query);
  res.json(rows);

  } catch (err) {
    console.error('❌ Error al obtener donaciones:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/** Inserta un equipo en un torneo */
async function crearDonacion(conn, nombreProducto, cantidad,nombreQuienDona) {
  const [result] = await conn.query(
    'INSERT INTO donaciones (nombre_producto, cantida_kilos,nombre_quien_dona) VALUES (?, ?, ?)',
    [nombreProducto, cantidad, nombreQuienDona]
  );
  return result.insertId;
}

exports.createDonacion = async (req, res) => {
  const { producto, kilos, nombreQuienDona}  = req.body;

  try{

    const conn = await db.getConnection();

    await conn.beginTransaction();

    const idRegistro = await crearDonacion(conn, producto, kilos, nombreQuienDona);
    
    await conn.commit();  

    res.json({
      idRegistro:idRegistro,
      message: 'Donación creado correctamente'
    });

  } catch (err) {
    console.error('❌ Error al obtener donaciones:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

async function getDonacionById(conn, idDonacion) {
  const [result] = await conn.query(
    'SELECT * FROM donaciones WHERE id = ?',
    [idDonacion]
  );
  return result[0];
}

async function actualizarQuinePide(conn,idDonacion,nombreQuienPide){

  if (!idDonacion) {
    return 'idDonacion es requerido';
  }

  const sql = `
    UPDATE donaciones
    SET nombre_quien_pide = ?
    WHERE id = ?
  `;

  const [result] = await conn.query(
    sql,
    [nombreQuienPide,idDonacion]
  );

  return result;
};

exports.asignarQuienPide = async (req, res) => {
  let { idDonacion, nombreQuienPide}  = req.body;

  try{

    const conn = await db.getConnection();

    await conn.beginTransaction();

    let donacion = await getDonacionById(conn, idDonacion);

    if(!donacion.id){
      res.json({
        idRegistro:idRegistro,
        message: 'Donación no existe'
      });
    }

    if(donacion.nombre_quien_pide){
      nombreQuienPide = donacion.nombre_quien_pide +">"+nombreQuienPide;
    }else{
      nombreQuienPide = nombreQuienPide;
    }

    await actualizarQuinePide(conn, idDonacion, nombreQuienPide);
    
    await conn.commit();

    res.json({
      idRegistro:idDonacion,
      message: 'Donación actualizada correctamente'
    });

  } catch (err) {
    console.error('❌ Error al obtener donaciones:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


async function actualizarQuineRecibe(conn,idDonacion,nombreQuienRecibe){

  if (!idDonacion) {
    return 'idDonacion es requerido';
  }

  const sql = `
    UPDATE donaciones
    SET nombre_quien_recibe = ?
    WHERE id = ?
  `;

  const [result] = await conn.query(
    sql,
    [nombreQuienRecibe,idDonacion]
  );

  return result;
};

exports.asignarQuienRecibe = async (req, res) => {
  let { idDonacion, nombreQuienRecibe}  = req.body;

  try{

    const conn = await db.getConnection();

    await conn.beginTransaction();

    let donacion = await getDonacionById(conn, idDonacion);

    if(!donacion.id){
      res.json({
        idRegistro:idRegistro,
        message: 'Donación no existe'
      });
    }

    await actualizarQuineRecibe(conn, idDonacion, nombreQuienRecibe);
    
    await conn.commit();

    res.json({
      idRegistro:idDonacion,
      message: 'Donación actualizada correctamente'
    });

  } catch (err) {
    console.error('❌ Error al obtener donaciones:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

async function actualizarEntregado(conn,idDonacion){

  if (!idDonacion) {
    return 'idDonacion es requerido';
  }

  const sql = `
    UPDATE donaciones
    SET entregado = 1,fecha_entregado = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  const [result] = await conn.query(
    sql,
    [idDonacion]
  );

  return result;
};

exports.actualizarEntregado = async (req, res) => {
  let { idDonacion}  = req.body;

  try{

    const conn = await db.getConnection();

    await conn.beginTransaction();

    let donacion = await getDonacionById(conn, idDonacion);

    if(!donacion.id){
      res.json({
        idRegistro:idRegistro,
        message: 'Donación no existe'
      });
    }

    await actualizarEntregado(conn, idDonacion);
    
    await conn.commit();

    res.json({
      idRegistro:idDonacion,
      message: 'Donación actualizada correctamente'
    });

  } catch (err) {
    console.error('❌ Error al obtener donaciones:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};