import express from 'express';
import pkg from 'pg';
import cors from 'cors';

const { Pool } = pkg
const pool = new Pool({
    connectionString: 'postgresql://postgres:LNEeBQnRllDjcoDTJzQOQcnccQHqJHYP@monorail.proxy.rlwy.net:11208/railway'
});
const app = express();

app.use(express.json());
app.use(cors());

 
app.get('/',function(req,res){
    res.send('Ruta Inicio');
 } )
 
/*--------------------Obtener articulo--------------------*/
 app.get('/api/articulos',(req,res)=>{
    pool.query('SELECT * FROM articulos',(error,filas)=>{
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    })
});

/*--------------------Obtener articulo--------------------*/
/*Busca un articulo por su id*/
app.get('/api/articulos/:id',(req,res)=>{
    pool.query('SELECT * FROM articulos  WHERE id= ?',[req.params.id],(error,fila)=>{
        if(error){
            throw error;
        }else{
            res.send(fila);
        }
    })
});

/*--------------------Registrar articulo--------------------*/
app.post('/api/articulos',(req,res)=>{
    let data={
        descripcion:req.body.descripcion,
        precio:req.body.precio,
        stock:req.body.stock
    };
    const sql="INSERT INTO articulos SET ?";
    pool.query(sql,data,function(error,results){
        if(error){
            throw error;
        }else{
            res.send(results);
        }

    });
});

/*--------------------Modificar articulo--------------------*/
app.put('/api/articulos/:id',(req,res)=>{
    let id=req.params.id;
    let { descripcion, precio, stock } = req.body;
    let sql="UPDATE articulos SET  descripcion= ?, precio= ?,stock= ? WHERE id= ?";
    pool.query(sql,[descripcion,precio,stock,id],function(error,results){
        if(error){
            throw error;
        }else{
            res.send(results);
        }
    });
});

/*--------------------Eliminar articulo--------------------*/
app.delete('/api/articulos/:id',(req,res)=>{
    pool.query('DELETE FROM articulos WHERE id=?',[req.params.id],function(error,filas){
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    });
});

/*--------------------Obtener cliente--------------------*/
app.get('/api/clientes',(req,res)=>{
    pool.query('SELECT * FROM clientes',(error,filas)=>{
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    })
});

/*--------------------Obtener cliente--------------------*/
/*Busca un cliente por su email*/
app.get('/api/clientes/:email',(req,res)=>{
    pool.query('SELECT * FROM clientes  WHERE email= ?',[req.params.email],(error,fila)=>{
        if(error){
            throw error;
        }else{
            res.send(fila);
        }
    })
});

/*--------------------Registrar cliente--------------------*/
app.post('/api/clientes',(req,res)=>{
    let data={
        nombreCompleto:req.body.nombreCompleto,
        email:req.body.email,
        password:req.body.password,
        tipDoc:req.body.tipDoc,
        numDoc:req.body.numDoc,
        estado:req.body.estado,
        direccion:req.body.direccion
    };
    const sql="INSERT INTO clientes SET ?";
    pool.query(sql,data,function(error,results){
        if(error){
            throw error;
        }else{
            res.send(results);
        }

    });
});

/*--------------------Modificar cliente--------------------*/
app.put('/api/clientes/:email',(req,res)=>{
    let { nombreCompleto, tipDoc, numDoc, estado, direccion } = req.body;
    let email = req.params.email;
    const sql = "UPDATE clientes SET  nombreCompleto= ?, tipDoc= ?, numDoc= ?, estado= ?, direccion= ? WHERE email= ?";
    pool.query(sql,[nombreCompleto, tipDoc, numDoc, estado, direccion, email],function(error,results){
        if(error){
            throw error;
        }else{
            res.json('El cliente fue modificado');
        }
    });
});

/*--------------------Eliminar cliente--------------------*/
app.delete('/api/clientes/:id',(req,res)=>{
    pool.query("DELETE FROM clientes WHERE id= ?" ,[req.params.id], function(error,fila){
        if(error){
            throw error;
        }else{
            res.json('El cliente fue eliminado');
        }
    });
})

/*--------------------Obtener producto--------------------*/
app.get('/api/productos',(req,res)=>{
    pool.query('SELECT * FROM productos',(error,filas)=>{
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    })
});

/*--------------------Obtener producto--------------------*/
/*Busca un producto por su id*/
app.get('/api/productos/:id',(req,res)=>{
    pool.query('SELECT * FROM productos WHERE id= ?',[req.params.id], (error,fila)=>{
        if(error) throw error;
        res.send(fila);
    })
});

/*--------------------Registrar producto--------------------*/
app.post('/api/productos',(req,res)=>{
    const sql = "INSERT INTO productos SET ?";
    const producto = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        stock: req.body.stock,
        precio: req.body.precio,
        nombreImagen: req.body.nombreImagen
    } 
        pool.query(sql, producto, (error, results) => {
            if(error) throw error;
            res.send(results);
        })
});

/*--------------------Modificar producto--------------------*/
app.put('/api/productos/:id', (req, res) => {
    let { nombre, descripcion, precio, nombreImagen } = req.body;
    let id = req.params.id;
    const sql = "UPDATE productos SET  nombre= ?, descripcion= ?,precio= ?, nombreImagen= ? WHERE id= ?";
    pool.query(sql, [nombre, descripcion, precio, nombreImagen, id], (error, results) => {
        if(error)  throw error;
        res.send(results)
    })
})

/*--------------------Modificar Stock--------------------*/
app.put('/api/productosStock/:id', (req, res) => {
    let { stock } = req.body;
    console.log(stock);
    let id = req.params.id;
    const sql = "UPDATE productos SET  stock= ? WHERE id= ?";
    pool.query(sql, [ stock, id ], (error, results) => {
        if(error)  throw error;
        res.send(results);
    })
})


/*--------------------Eliminar producto--------------------*/
app.delete('/api/productos/:id', (req, res) => {
    pool.query('DELETE FROM productos WHERE id = ?',[req.params.id],function(error,results){
        if(error){
            throw error;
        }else{
            res.send(results);
        }
    });
});



/*--------------------Crear pedido--------------------*/
app.post('/api/pedidos', (req, res) => {
    const productosJson = req.body.productos;
    const sql = "INSERT INTO pedidos (pedido) VALUES (?)";
    pool.query(sql, [productosJson], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.json({ message: 'Datos guardados correctamente' });
      }
    });
  });

  /*--------------------Obtener pedidos--------------------*/
app.get('/api/pedidos',(req,res)=>{
    pool.query('SELECT * FROM pedidos',(error,filas)=>{
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    })
})

/*--------------------Eliminar pedido--------------------*/
app.delete('/api/pedidos/:id', (req, res) => {
    pool.query('DELETE FROM pedidos WHERE id = ?',[req.params.id],function(error,results){
        if(error){
            throw error;
        }else{
            res.send(results);
        }
    });
})

 const puerto=process.env.PUERTO || '3000';
 app.listen('3000',function(){
    console.log('Servidor ok en puerto: ' +puerto);
 });