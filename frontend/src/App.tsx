import { useState } from "react"
import Login from "./paginas/Login"
import ListarPostulaciones from "./paginas/ListarPostulaciones"
import Registro from "./paginas/Registro"
import NuevaPostulacion from "./paginas/NuevaPostulacion"
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import RutaProtegida from "./componentes/RutaProtegida"
import { useAuth } from "./contextos/AuthContexto"
import DetallePostulacion from "./paginas/DetallePostulacion"
import EditarPostulacion from "./paginas/EditarPostulacion"

function App() {

  const [contador, setContador] = useState(0)
  const { token, removerToken } = useAuth()

  function subirContador() {
    setContador((valorAnterior) => valorAnterior + 1)
  }

  return (
    <>
    <nav className="bg-marino text-white p-4 flex items-center gap-4 justify-between">
      <div className="flex items-center gap-6">

        <Link to="/" className="font-bold text-lg">
          <span className="md:hidden">Rastreador</span>
          <span className="hidden md:inline">Rastreador de Postulaciones</span>
        </Link>

        {token && <Link to="/postulaciones">Mis postulaciones</Link>}
        {token && <Link to="/postulaciones/nueva">Nueva postulación</Link>}
      </div>

      <div>
        {token && <button onClick={removerToken}>Cerrar sesión</button>}
      </div>
    </nav>

    <main className="max-w-4xl mx-auto p-4">
      <Routes>

        <Route path="/registro" element={<Registro/>}/>
        <Route path="/login" element={<Login />}/>

        <Route path="/postulaciones" element={
          <RutaProtegida>
            <ListarPostulaciones contador={contador}/>
          </RutaProtegida>
        }/>

        <Route path="/postulaciones/nueva" element={
          <RutaProtegida>
            <NuevaPostulacion subirContador={subirContador}/>
          </RutaProtegida>
        }/>

        <Route path="/postulaciones/:id" element={
          <RutaProtegida>
            <DetallePostulacion />
          </RutaProtegida>
        }/>

        <Route path="/postulaciones/:id/editar" element={
          <RutaProtegida>
            <EditarPostulacion />
          </RutaProtegida>
        }/>

        <Route path="*" element={<p>La pagina no existe</p>}/>

        <Route path="/" element={token ? <Navigate to="/postulaciones"/> : <Navigate to="/login"/>}/>

      </Routes>
    </main>

    </>
  )
}

export default App